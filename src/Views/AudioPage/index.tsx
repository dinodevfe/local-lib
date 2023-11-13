import UploadIcon from "@mui/icons-material/Audiotrack";
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Styles, withStyles } from "@mui/styles";
import { Dictionary, Update } from "@reduxjs/toolkit";
import { ConfigTable, CreateTable, DataTableProps, TypeTableRef } from "local-lib/GridTable";
import React, { Component, FC } from "react";
import { Sleep } from "../../helper";
import { EMediaStatus, IAudio, IAudioExtend, ICategory, IMedia } from "../Models";
import { VideoPageStyle } from "../styles";
import { ExtractProps, LazyStatus, TDispatchRedux } from "../types";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { AlertDialog, ApiAlertContext } from '../AlertGlobal'

// import ImageAudio from "../../Assets/Image/Defaults/image-audio-100.png";
import {
  ModalCreate,
  ModalCreateBase,
  ModelType,
  ModalCreateDefaultProps,
  ModalCreateProps,
} from "../VideoPage/ModalCreate";
import { UploadStatusBase, UploadStatusProps } from "../VideoPage/UploadStatus";
import { DateTimeFilters, mergeConfigTable, OverlayPage } from "../SubComponents";

interface AudioReduxState {
  Status: LazyStatus;
  data: Dictionary<IAudio>;
  Categories: Dictionary<ICategory>;
}
interface AudioPageProps {
  EditAudio: (audio: IAudio) => Promise<IAudio>;
  ImageAudio: string;
  UploadStatusComponent: React.ComponentType<
    Omit<
      UploadStatusProps,
      "AddVideo" | "AddAudio" | "UploadVideo" | "UploadAudio"
    > & { innerRef: React.RefObject<UploadStatusBase> }
  >;
  ModalCreate: React.ComponentType<
    Omit<ModalCreateProps, keyof ModalCreateDefaultProps> & {
      innerRef: React.RefObject<ModalCreateBase>;
    } & ExtractProps<ModalCreateDefaultProps>
  >;
  configTable?: Partial<ConfigTable<any>>
}
interface AudioState {
  IsOpenOverlay: boolean
  DeleteConfirm: boolean
  Title: string;
  message: string;
  Audio?: IAudio;
}

interface AudioDispatchProps extends TDispatchRedux<any> {
  FetchData: () => void;
  UpdateAudioRange: (audios: Update<IAudio>[]) => void;
  DeleteAudio?: (audio: IAudio) => Promise<void>;
  IsDelete?: boolean | ((media: IMedia) => boolean)
}
type _AudioPageProps = AudioReduxState & AudioDispatchProps & AudioPageProps;
export class AudioPage extends Component<_AudioPageProps, AudioState> {
  constructor(props: _AudioPageProps) {
    super(props);
    this.AudioTable = this.InitialTable();
    this.state = {
      IsOpenOverlay: false,
      DeleteConfirm: false,
      Title: "Delete",
      message: "",
    }
  }
  public static defaultProps = {
    ModalCreate: ModalCreate,
  };
  InitialTable = () => {
    return CreateTable<IAudioExtend>(mergeConfigTable({
      SelectId: (r) => r.Id,
      Options: {
        Thumbnail: {
          minWidth: 150,
          align: "center",
          headerName: "Thumbnail",
          renderCell: (data) => {
            return (
              <ItemThumb
                url={data.formattedValue as any}
                ImageAudio={this.props.ImageAudio}
                status={(data.row as IAudioExtend).Status}
                title={data.value?.toString() ?? ""}
              />
            );
          },
        },
        Title: {
          flex: 1,
          renderCell: (data) => {
            return (
              <ItemTitle
                onEdit={() => this.onEdit(data.row)}
                onDelete={() => this.onDelete(data.row)}
                HasDelete={!!this.props.DeleteAudio && this.HasDelete(data.row)}
                title={data.value?.toString() ?? ""}
              />
            );
          },
        },
        Length: {
          flex: 1,
          width: 150,
          valueFormatter: (param) => {
            return (param.value as any)?.toHHMMSS();
          },
        },
        Summary: {
          flex: 1,
        },
        DateCreated: {
          flex: 1,
          minWidth: 200,
          type: "date",
          valueFormatter: (param) => {
            return new Date(param.value as any).toLocaleString();
          },
          filterOperators: DateTimeFilters
        },
        Status: {
          flex: 1,
          width: 150,
          renderCell: (data) => {
            return <ItemStatus status={(data.row as IAudioExtend).Status} />;
          },
        },
      },
    }, this.props.configTable ?? {}));
  };
  AudioTable: TypeTableRef<DataTableProps<IAudioExtend>>;
  refModal = React.createRef<ModalCreateBase>();
  refUploadList = React.createRef<UploadStatusBase>();
  OnCreate = () => {
    this.refModal.current?.handleOpen(null, ModelType.UploadAudio);
  };
  HasDelete = (media: IAudio) => {
    if (!this.props.IsDelete) return false;
    return typeof this.props.IsDelete === 'boolean' ? this.props.IsDelete : this.props.IsDelete(media);
  }
  onUpload = async (files: File[]) => {
    if (files.length > 0) {
      this.refUploadList.current?.Upload(files);
    }
    await Sleep(1000);
    return Promise.resolve();
  };
  onEdit = (Audio: IAudio) => {
    const tmp = this.props.data[Audio.Id];
    this.refModal.current?.handleOpen(tmp, ModelType.EditAudio);
  };
  onDelete = async (Audio: IAudio) => {
    this.setState({
      Audio,
      DeleteConfirm: true,
      Title: "Are you sure delete?",
      message: "Audio name: " + Audio.Title
    })
  }
  onSaveAudio = async (model: IAudio) => {
    this.refModal.current?.OpenOverlay();
    try {
      const Audio = await this.props.EditAudio(model);
      if (Audio) {
        this.props.UpdateAudioRange([{ id: Audio.Id, changes: Audio }]);
      }
    } catch { }
    this.refModal.current?.handleClose();
    this.refModal.current?.CloseOverlay();
  };
  onAccept = async () => {
    this.setState({ DeleteConfirm: false })
    if (this.state.Audio && this.props.DeleteAudio) {
      const tmp = this.props.data[this.state.Audio.Id];
      if (tmp) {
        try {
          this.setState({ IsOpenOverlay: true })
          await this.props.DeleteAudio(tmp);
          ApiAlertContext.ApiAlert?.PushSuccess("Delete success!")
        } catch {
          ApiAlertContext.ApiAlert?.PushError("Delete fail!")
        } finally {
          this.setState({ IsOpenOverlay: false })
        }
      }
    }
  }
  onDeleteConfirm = async () => {
    this.setState({ DeleteConfirm: false })
  }
  render() {
    const { AudioTable } = this;
    const { UploadStatusComponent, ModalCreate: ModalCreateProp } = this.props;

    return (
      <OverlayPage Show={this.state.IsOpenOverlay} isMobile={true}>
        <div className="container-video-page">
          <div className="panel-action">
            <div className="title">Audios</div>
            <Button
              onClick={this.OnCreate}
              variant="contained"
              color="primary"
              endIcon={<UploadIcon />}
            >
              Create
            </Button>
          </div>
          <AudioTable
            rowHeight={100}
            data={Object.values(this.props.data) as IAudio[]}
          />
          <ModalCreateProp
            onUpload={this.onUpload}
            onSaveAudio={this.onSaveAudio}
            Categories={Object.values(this.props.Categories) as ICategory[]}
            innerRef={this.refModal}
          />
          <UploadStatusComponent TypeMedia="AUDIO" innerRef={this.refUploadList} />
          <AlertDialog
            Title={this.state.Title}
            Message={this.state.message}
            IsOpen={this.state.DeleteConfirm}
            onClose={this.onDeleteConfirm}
            onAccept={this.onAccept}
          />
        </div>
      </OverlayPage>
    );
  }
}
interface ItemThumbProps {
  url: string;
  title: string;
  status: EMediaStatus;
  ImageAudio: string;
}
const renderThumb = (data: ItemThumbProps) => {
  return (
    <img
      style={{
        height: "60%",
        width: "auto",
      }}
      src={data.ImageAudio}
      alt={data.title}
    />
  );
};
const ItemThumb: FC<ItemThumbProps> = (props) => {
  return <div className="wrap-thumb-video">{renderThumb(props)}</div>;
};
interface ItemStatusProps {
  status: EMediaStatus;
}
const renderStatus = (status: EMediaStatus) => {
  switch (status) {
    case EMediaStatus.Approved:
      return "Approved";
    case EMediaStatus.Banned:
      return "Banned";
    case EMediaStatus.Pending:
      return "Pending";
    case EMediaStatus.Draft:
      return "Draft";
    default:
      return "Processing";
  }
};
const ItemStatus: FC<ItemStatusProps> = (props) => {
  return <div>{renderStatus(props.status)}</div>;
};
interface ItemTitleProps {
  title: string;
  onEdit?: () => void;
  onDelete?: () => void;
  HasDelete: boolean
}
const ItemTitle: FC<ItemTitleProps> = (props) => {
  return (
    <div className="wrap-title-video">
      <span className="title">{props.title}</span>
      <div className="container-action">
        <Tooltip title="Edit">
          <IconButton onClick={props.onEdit}>
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
        {props.HasDelete ? (
          <Tooltip title="Delete">
            <IconButton onClick={props.onDelete}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>) : ''}
      </div>
    </div>
  );
};
export const AudioPageBase = withStyles(VideoPageStyle as Styles<
  any,
  Omit<_AudioPageProps, keyof typeof AudioPage.defaultProps> &
  ExtractProps<keyof typeof AudioPage.defaultProps>
>)(AudioPage);
// const mapStateToProps = (state: RootState): ReduxState => ({
//   Status: state.UserAudioSlice.Status,
//   data: state.UserAudioSlice.entities,
//   Categories: state.AppStateSlice.AudioCategory.entities,
// });
// const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
//   return {
//     FetchData: () => {
//       dispatch(fetchUserAudioAll());
//     },
//     UpdateAudioRange: (audios: Update<IAudio>[]) => {
//       dispatch(UpdateAudioRange(audios));
//     },
//   };
// };

// export default CreateHocLazy<any, ReduxState>(
//   AudioPage,
//   mapStateToProps,
//   mapDispatchToProps,
//   {
//     IsChanceLayout: true,
//   }
// );
