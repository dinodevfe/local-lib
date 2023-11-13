import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faCheck,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { KeyExtractor } from "../../helper";
import { IAudio, IVideo } from "../Models";
import LinearProgress from "@mui/material/LinearProgress";
import axios, { CancelToken, CancelTokenSource } from "axios";
import { UploadStatusStyled } from "../styles";
import { Styles, withStyles } from "@mui/styles";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
interface UploadStatusType {
  TypeMedia: "VIDEO" | "AUDIO";
}
enum EFileStatus {
  None,
  Uploading,
  Uploaded,
  Error,
}
interface FileStatus {
  file: File;
  Status: EFileStatus;
  Id: number;
  progressValue: number;
  cancelToken?: CancelTokenSource;
}
interface UploadStatusState {
  IsOpen: boolean;
  CollapseContent: boolean;
  files: FileStatus[];
  IsConfirmClose: boolean
}
interface UploadStatusDispatchProps {
  AddVideo: (video: IVideo) => void;
  AddAudio: (audio: IAudio) => void;
  UploadVideo: (
    file: File,
    token: CancelToken,
    callback: (value: number) => void
  ) => Promise<IVideo | null>;
  UploadAudio: (
    file: File,
    token: CancelToken,
    callback: (value: number) => void
  ) => Promise<IAudio | null>;
}
export type UploadStatusProps = UploadStatusType & UploadStatusDispatchProps;
export class UploadStatusBase extends Component<
  UploadStatusProps,
  UploadStatusState
> {
  constructor(props: UploadStatusProps) {
    super(props);
    this.state = {
      CollapseContent: true,
      IsOpen: false,
      files: [],
      IsConfirmClose: false
    };
  }
  IdMedia = 1;
  onCollapse = () => {
    this.setState({ CollapseContent: !this.state.CollapseContent });
  };
  onClose = () => {
    if (this.state.files.filter((x) => x.Status !== EFileStatus.Uploaded && x.Status !== EFileStatus.Error).length > 0) {
      this.showConfirm()
    } else {
      this.setState({ files: [], IsOpen: false })
    }
  };
  showConfirm = () => {
    this.setState({ IsConfirmClose: true })
  }
  Upload = (files: File[]) => {
    const TmpFiles = [
      ...this.state.files,
      ...files.map((file) => ({
        file,
        Status: EFileStatus.None,
        Id: ++this.IdMedia,
        progressValue: 0,
      })),
    ];

    this.setState({
      files: TmpFiles,
      IsOpen: true,
      CollapseContent: false,
    });
    setTimeout(() => {
      this.ProcessUploadFile();
    }, 1000);
  };
  CancelUpload = (file: FileStatus) => {
    file.cancelToken?.cancel();
    this.DelFile(file);
  };
  DelFile = (file: FileStatus) => {
    const index = this.state.files.findIndex((x) => x.Id === file.Id);
    this.state.files.splice(index, 1);
    this.setState({ files: [...this.state.files] });
  };
  UpdateStatus = () => {
    this.setState({ files: [...this.state.files] });
  };
  ProcessUploadFile = () => {
    for (let index = 0; index < this.AmountWorker; index++) {
      this.WorkerUpload();
    }
  };

  AmountWorker = 3;
  ActiveWork = 0;
  WorkerUpload = async () => {
    if (this.ActiveWork >= this.AmountWorker) {
      return;
    }

    this.ActiveWork++;
    let file = this.state.files.filter((x) => x.Status === EFileStatus.None)[0];

    while (file) {
      const CancelToken = axios.CancelToken.source();
      file.Status = EFileStatus.Uploading;
      file.cancelToken = CancelToken;
      console.log(file);
      this.UpdateStatus();
      try {
        switch (this.props.TypeMedia) {
          case "AUDIO":
            await this.ExecuteUploadAudio(file, CancelToken);
            break;
          case "VIDEO":
            await this.ExecuteUploadVideo(file, CancelToken);
            break;
          default:
            break;
        }
      } catch {
        file.Status = EFileStatus.Error;
      } finally {

      }

      this.UpdateStatus();
      file = this.state.files.filter((x) => x.Status === EFileStatus.None)[0];
    }
    this.ActiveWork--;
  };
  ExecuteUploadVideo = async (
    file: FileStatus,
    CancelToken: CancelTokenSource
  ) => {
    let Video: IVideo | null | undefined = undefined;

    Video = await this.props.UploadVideo(
      file.file,
      CancelToken.token,
      (value) => {
        file.progressValue = value;
        this.UpdateStatus();
      }
    );
    if (this.props.AddVideo && Video) {
      file.Status = EFileStatus.Uploaded;
      this.props.AddVideo(Video);
    } else {
      file.Status = EFileStatus.Error;
    }
  };
  ExecuteUploadAudio = async (
    file: FileStatus,
    CancelToken: CancelTokenSource
  ) => {
    let Audio: IAudio | null | undefined = undefined;

    Audio = await this.props.UploadAudio(
      file.file,
      CancelToken.token,
      (value) => {
        file.progressValue = value;
        this.UpdateStatus();
      }
    );
    if (this.props.AddAudio && Audio) {
      file.Status = EFileStatus.Uploaded;
      this.props.AddAudio && this.props.AddAudio(Audio);
    } else {
      file.Status = EFileStatus.Error;
    }
  };
  UploadPartial = (files: FileStatus[]) => {
    return files.map((file) => {
      const SourceToken = axios.CancelToken.source();
      return this.props.UploadVideo(file.file, SourceToken.token, (value) => {
        file.progressValue = value;
        this.setState({ files: [...this.state.files] });
      });
    });
  };
  getTitle = () => {
    const NoneAmount = this.state.files.reduce(
      (a, b) => a + (b.Status === EFileStatus.Uploading || b.Status === EFileStatus.None ? 1 : 0),
      0
    );
    if (NoneAmount === 0) {
      return "Upload completed"
    } else {
      return `Uploading ${NoneAmount} file(s)`
    }
  }
  onRetryUpload = () => {
    this.state.files.filter(x => x.Status === EFileStatus.Error).forEach(x => (x.Status = EFileStatus.None))
    this.setState({ files: [...this.state.files] })
    this.ProcessUploadFile()
  }
  renderRetryFileError = () => {
    const errorAmount = this.state.files.reduce(
      (a, b) => a + (b.Status === EFileStatus.Error ? 1 : 0),
      0
    );
    const NoneAmount = this.state.files.reduce(
      (a, b) => a + (b.Status === EFileStatus.Uploading || b.Status === EFileStatus.None ? 1 : 0),
      0
    );
    return errorAmount && !NoneAmount ? <div className="header-upload-list">
      {errorAmount} file error(s)
      <Button onClick={this.onRetryUpload} color="info" className="close" >
        Retry
      </Button>
    </div> : ''
  }
  componentWillUnmount() {
    this.state.files.forEach(x => x.cancelToken?.cancel())
  }
  renderButton = (status: EFileStatus, file: FileStatus) => {
    switch (status) {
      case EFileStatus.Uploading:
        return (
          <button onClick={() => this.CancelUpload(file)} className="close">
            ×
          </button>
        );
      case EFileStatus.Uploaded:
        return <FontAwesomeIcon color={"darkgreen"} icon={faCheck} />;
      case EFileStatus.Error:
        return <FontAwesomeIcon color={"red"} icon={faExclamationCircle} />;
      default:
        return (
          <button onClick={() => this.DelFile(file)} className="close">
            ×
          </button>
        );
    }
  };
  renderItem = () => {
    return this.state.files.map((file, index) => {
      return (
        <div key={KeyExtractor(file, file.Id)} className="wrap-item">
          <div className="item-file">
            <span className="title">{file.file.name}</span>
            {this.renderButton(file.Status, file)}
          </div>
          {file.Status === EFileStatus.Uploading && (
            <LinearProgress variant="determinate" value={file.progressValue} />
          )}
        </div>
      );
    });
  };
  handleClose = () => {
    this.setState({ IsConfirmClose: false })
  }
  onCancelConfirm = async () => {
    const files = this.state.files.filter(x => x.cancelToken)
    this.setState({ files: [] })
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      try {
        element.cancelToken?.cancel();
      } finally {
      }

    }
    this.setState({ IsConfirmClose: false, files: [], IsOpen: false })
  }
  render() {
    const UploadedAmount = this.state.files.reduce(
      (a, b) => a + (b.Status === EFileStatus.Uploaded ? 1 : 0),
      0
    );
    return (
      <div className={`upload-list shadow ${this.state.IsOpen ? "show" : ""}`}>
        <div className="header-upload-list" onClick={this.onCollapse}>
          <button className="close left" onClick={this.onClose}>
            ×
          </button>
          <span className="title">
            {this.getTitle()}
          </span>
          <button className="close">
            <FontAwesomeIcon
              icon={this.state.CollapseContent ? faAngleUp : faAngleDown}
            />
          </button>
        </div>
        <div
          className={`content-upload-list ${this.state.CollapseContent ? "" : "show"
            }`}
        > {this.renderRetryFileError()}
          {this.renderItem()}
        </div>
        <Dialog
          open={this.state.IsConfirmClose}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            cancel confirmation
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              are you sure to cancel the upload?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color='error' onClick={this.onCancelConfirm} autoFocus>
              Ok
            </Button>
            <Button color='inherit' onClick={this.handleClose}>no</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
const WrapUploadStatus: React.FC<
  UploadStatusProps & { innerRef: React.RefObject<UploadStatusBase> }
> = (props) => {
  return <UploadStatusBase {...props} ref={props.innerRef} />;
};
export const UploadStatus = withStyles(UploadStatusStyled as Styles<any, any>)(
  WrapUploadStatus
);
// const mapStateToProps = (state: RootState) => ({});
// const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
//   return {
//     AddVideo: (video: IVideo) => {
//       dispatch(AddVideo(video));
//     },
//     AddAudio: (audio: IAudio) => {
//       dispatch(AddAudio(audio));
//     },
//   };
// };
// export default connect(mapStateToProps, mapDispatchToProps, null, {
//   forwardRef: true,
// })(UploadStatus);
