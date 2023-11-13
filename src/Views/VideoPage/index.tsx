import React, { Component, FC } from "react";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/VideoCall";
import {
  ModalCreate,
  ModalCreateBase,
  ModalCreateDefaultProps,
  ModalCreateProps,
  ModelType,
} from "./ModalCreate";
import EditIcon from "@mui/icons-material/Edit";
import {
  EMediaStatus,
  EUploadStatus,
  ICategory,
  IMedia,
  IVideo,
} from "../Models";
import { Dictionary, Update } from "@reduxjs/toolkit";
import { UploadStatusBase, UploadStatusProps } from "./UploadStatus";
import { IconButton, Tooltip } from "@mui/material";
import { AxiosError } from "axios";
import { ConfigTable, CreateTable, DataTableProps, TypeTableRef } from "local-lib/GridTable";
import {
  ExtractProps,
  LazyStatus,
  StyleClasses,
  TDispatchRedux,
} from "../types";
import { Styles, withStyles } from "@mui/styles";
import { VideoPageStyle } from "../styles";
import { Sleep } from "../../helper";
import DeleteIcon from "@mui/icons-material/DeleteForever";
import { DateTimeFilters, mergeConfigTable, OverlayPage, } from "../SubComponents";
import { AlertDialog, ApiAlertContext } from "../AlertGlobal";
interface VideoPageProps {
  CheckStatus: (
    IdList: string[],
    status: EUploadStatus
  ) => Promise<IVideo[] | null>;
  EditVideo: (model: IVideo) => Promise<IVideo>;
  UploadStatusComponent: React.ComponentType<
    Omit<
      UploadStatusProps,
      "AddVideo" | "AddAudio" | "UploadVideo" | "UploadAudio"
    > & { innerRef: React.RefObject<UploadStatusBase> }
  >;
  classes: StyleClasses<typeof VideoPageStyle>;
  ModalCreate: React.ComponentType<
    Omit<ModalCreateProps, keyof ModalCreateDefaultProps> & {
      innerRef: React.RefObject<ModalCreateBase>;
    } & ExtractProps<ModalCreateDefaultProps>
  >;
  configTable?: Partial<ConfigTable<any>>
}
interface VideoState {
  IsOpenOverlay: boolean
  DeleteConfirm: boolean
  Title: string;
  message: string;
  Video?: IVideo;
}
interface VideoReduxState {
  Status: LazyStatus;
  data: Dictionary<IVideo>;
  Categories: Dictionary<ICategory>;
}

interface VideoDispatchProps extends TDispatchRedux<any> {
  FetchData: () => void;
  UpdateVideoRange: (videos: Update<IVideo>[]) => void;
  DeleteVideo?: (video: IVideo) => Promise<void>;
  IsDelete?: boolean | ((media: IMedia) => boolean)
}
type _VideoPageProps = VideoReduxState & VideoDispatchProps & VideoPageProps;
export class VideoPage extends Component<_VideoPageProps, VideoState> {

  constructor(props: _VideoPageProps) {
    super(props);
    this.VideoTable = this.InitialTable();
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
    return CreateTable<IVideo>(mergeConfigTable({
      SelectId: (r) => r.Id,
      Options: {
        Thumbnail: {
          minWidth: 150,
          align: "center",
          headerName: "Thumbnail",
          renderCell: (data) => {
            return (
              <ItemThumb
                url={(data.row as IVideo).Thumbnail}
                status={(data.row as IVideo).UploadStatus}
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
                HasDelete={!!this.props.DeleteVideo && this.HasDelete(data.row)}
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
            return <ItemStatus video={data.row as IVideo} />;
          },
        },
      },
    }, this.props.configTable ?? {}));
  };
  VideoTable: TypeTableRef<DataTableProps<IVideo>>;
  refModal = React.createRef<ModalCreateBase>();
  refUploadList = React.createRef<UploadStatusBase>();
  TimerCheckStatus: NodeJS.Timeout | number | undefined;
  SetUpCheckStatus = () => {
    clearInterval(this.TimerCheckStatus as number);
    this.TimerCheckStatus = setInterval(() => {
      const data = (Object.values(this.props.data) as IVideo[])
        .filter((x) => x.UploadStatus === EUploadStatus.Processing)
        .map((x) => x.Id);
      if (data.length < 1) {
        clearInterval(this.TimerCheckStatus as number);
        return;
      }
      this.CheckStatus(data);
    }, 5000);
  };
  HasDelete = (media: IVideo) => {
    if (!this.props.IsDelete) return false;
    return typeof this.props.IsDelete === 'boolean' ? this.props.IsDelete : this.props.IsDelete(media);
  }
  CheckStatus = async (IdList: string[]) => {
    const data = await this.props.CheckStatus(IdList, EUploadStatus.Completed);
    if (data === null) return;
    this.props.UpdateVideoRange(
      data.map((x) => ({
        id: x?.Id,
        changes: x,
      }))
    );
  };
  OnCreate = () => {
    this.refModal.current?.handleOpen();
  };
  componentDidMount = () => {
    this.SetUpCheckStatus();
  };
  componentDidUpdate = () => {
    this.SetUpCheckStatus();
    this.refModal?.current?.RefreshModel((m: IVideo | undefined) =>
      m ? this.props.data[m.Id] : undefined
    );
  };
  componentWillUnmount() {
    clearInterval(this.TimerCheckStatus as number);
  }
  onUpload = async (files: File[]) => {
    if (files.length > 0) {
      this.refUploadList.current?.Upload(files);
    }
    await Sleep(1000);
    return Promise.resolve();
  };
  onEdit = (video: IVideo) => {
    const tmp = this.props.data[video.Id];
    this.refModal.current?.handleOpen(tmp, ModelType.EditVideo);
  };
  onDelete = async (Video: IVideo) => {
    this.setState({
      Video,
      DeleteConfirm: true,
      Title: "Are you sure delete?",
      message: "Audio name: " + Video.Title
    })
  }
  onAccept = async () => {
    this.setState({ DeleteConfirm: false })
    if (this.state.Video && this.props.DeleteVideo) {
      if (!this.props.DeleteVideo) return;
      const tmp = this.props.data[this.state.Video.Id];
      if (tmp) {
        try {
          this.setState({ IsOpenOverlay: true })
          await this.props.DeleteVideo(tmp);
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
  onSaveVideo = async (model: IVideo) => {
    console.log({ model });
    this.refModal.current?.OpenOverlay();
    try {
      const video = await this.props.EditVideo(model);
      console.log({ video });
      if (video) {
        this.props.UpdateVideoRange([{ id: video.Id, changes: video }]);
      }
      this.refModal.current?.handleClose();
    } catch (error) {
      this.refModal.current?.SetError(error as AxiosError);
    }
    this.refModal.current?.CloseOverlay();
  };
  render() {
    const { VideoTable } = this;
    const { UploadStatusComponent, ModalCreate: ModalCreateProp } = this.props;
    return (
      <OverlayPage Show={this.state.IsOpenOverlay} isMobile={true}>
        <div className={"container-video-page"}>
          <div className="panel-action">
            <div className="title">Videos</div>
            <Button
              onClick={this.OnCreate}
              variant="contained"
              color="primary"
              endIcon={<UploadIcon />}
            >
              Create
            </Button>
          </div>
          <VideoTable
            rowHeight={100}
            data={Object.values(this.props.data) as IVideo[]}
          />
          <ModalCreateProp
            onUpload={this.onUpload}
            onSaveVideo={this.onSaveVideo}
            Categories={Object.values(this.props.Categories) as ICategory[]}
            innerRef={this.refModal}
          />
          <UploadStatusComponent
            TypeMedia={"VIDEO"}
            innerRef={this.refUploadList}
          />
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
  status: EUploadStatus;
}
const renderThumb = (data: ItemThumbProps) => {
  if (data.status === EUploadStatus.Processing) {
    return <div className="thumb-processing">Processing</div>;
  } else {
    return <img src={data.url} alt={data.title} />;
  }
};
const ItemThumb: FC<ItemThumbProps> = (props) => {
  return <div className="wrap-thumb-video">{renderThumb(props)}</div>;
};
interface ItemStatusProps {
  video: IVideo;
}
const renderStatus = (video: IVideo) => {
  if (video.UploadStatus === EUploadStatus.Processing) {
    return "Processing";
  }
  switch (video.Status) {
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
  return <div>{renderStatus(props.video)}</div>;
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
export const VideoPageBase = withStyles(
  VideoPageStyle as Styles<
    any,
    Omit<_VideoPageProps, keyof typeof VideoPage.defaultProps> &
    ExtractProps<keyof typeof VideoPage.defaultProps>
  >
)(VideoPage);
// const mapStateToProps = (state: RootState): ReduxState => ({
//   Status: state.UserVideoSlice.Status,
//   data: state.UserVideoSlice.entities,
//   Categories: state.AppStateSlice.VideoCategory.entities,
// });
// const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
//   return {
//     FetchData: () => {
//       dispatch(fetchUserVideoAll());
//     },
//     UpdateVideoRange: (videos: Update<IVideo>[]) => {
//       dispatch(UpdateVideoRange(videos));
//     },
//   };
// };
// export default CreateHocLazy<any, ReduxState>(
//   VideoPage,
//   mapStateToProps,
//   mapDispatchToProps,
//   {
//     IsChanceLayout: true,
//   }
// );
