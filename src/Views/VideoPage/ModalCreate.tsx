import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { Fade, FormControl, FormLabel, IconButton } from "@mui/material";
import Modal from "@mui/material/Modal";
import { Styles, withStyles } from "@mui/styles";
import { OverlayView } from "../SubComponents";
import { AxiosError } from "axios";
import React, { Component } from "react";
import { DropzoneArea } from '../../DropZone'
import ReactAudioPlayer from "react-audio-player";
import ReactPlayer from "react-player";
import { FormGroup } from "reactstrap";
import {
  FormValidator,
  PartialError,
  SingleRuleValidate,
} from "../../helper/ValidateModel";
import * as Sub from "../../SubComponents";
import {
  EMediaStatus,
  EUploadStatus,
  IAudio,
  ICategory,
  IMedia,
  IVideo,
} from "../Models";
import { ModalCreateStyled } from "../styles";
import { ExtractProps } from "../types";
export enum ModelType {
  UploadVideo,
  UploadAudio,
  EditVideo,
  EditAudio,
}
interface ModalCreateState {
  IsOpen: boolean;
  Title: string;
  AmountCategory: number;
  Type: ModelType;
  Model?: any;
  ModelRender?: any;
  IsOpenOverlay: boolean;
  FormValidator?: FormValidator<IVideo> | FormValidator<IAudio>;
  MessageErrors?: PartialError<IVideo> | PartialError<IAudio>;
}
export interface ModalCreateDefaultProps {
  renderExtendForm: (sender: ModalCreateBase) => JSX.Element;
}
export interface ModalCreateProps extends ModalCreateDefaultProps {
  Categories: ICategory[];
  onUpload?: (files: File[]) => Promise<void>;
  onSaveVideo?: (model: IVideo) => void;
  onSaveAudio?: (model: IAudio) => void;
}

const TypeFilters: { [key: string]: string[] } = {};
TypeFilters[ModelType.UploadVideo] = ["video/*"];
TypeFilters[ModelType.UploadAudio] = ["audio/*"];
export class ModalCreateBase extends Component<
  ModalCreateProps,
  ModalCreateState
> {
  /**
   *
   */
  constructor(props: ModalCreateProps) {
    super(props);
    this.state = {
      IsOpen: false,
      Title: "",
      AmountCategory: 0,
      Type: ModelType.UploadVideo,
      IsOpenOverlay: false,
    };
  }
  public static defaultProps = {
    renderExtendForm: (sender: ModalCreateBase) => {
      return <></>;
    },
  };
  handleOpen = (model?: any, Type: ModelType = ModelType.UploadVideo) => {
    this.setState({
      IsOpen: true,
      Type,
      Model: model,
      Title: (model as IMedia)?.Title ?? "",
      ModelRender:
        (model as IMedia)?.Status === EMediaStatus.Draft
          ? { ...model, IsOwner: undefined, IsLicensed: undefined }
          : { ...model },
      AmountCategory: (model as IMedia)?.Categories?.length ?? 0,
      FormValidator: this.getValidator(Type),
      MessageErrors: undefined,
    });
  };
  getValidator = (
    type: ModelType
  ): FormValidator<IAudio> | FormValidator<IVideo> | undefined => {
    switch (type) {
      case ModelType.EditVideo:
        return new FormValidator<IVideo>({
          Title: {
            Rules: [
              {
                rule: SingleRuleValidate.Required,
              },
            ],
          },
          Summary: {
            Rules: [
              {
                rule: SingleRuleValidate.Required,
              },
            ],
          },
          IsOwner: {
            Rules: [
              {
                rule: SingleRuleValidate.RequiredValue,
                Value: true,
                message: "Please confirm that the media belongs to you!",
              },
            ],
          },
          IsLicensed: {
            Rules: [
              {
                rule: SingleRuleValidate.RequiredValue,
                Value: false,
                message:
                  "Medias that have been provided to others cannot be uploaded!",
              },
            ],
          },
          Categories: {
            Rules: [
              {
                rule: SingleRuleValidate.Required,
              },
            ],
          },
        });
      case ModelType.EditAudio:
        return new FormValidator<IAudio>({
          Title: {
            Rules: [
              {
                rule: SingleRuleValidate.Required,
              },
            ],
          },
          Summary: {
            Rules: [
              {
                rule: SingleRuleValidate.Required,
              },
            ],
          },
          IsOwner: {
            Rules: [
              {
                rule: SingleRuleValidate.RequiredValue,
                Value: true,
                message: "Please confirm that the media belongs to you!",
              },
            ],
          },
          IsLicensed: {
            Rules: [
              {
                rule: SingleRuleValidate.RequiredValue,
                Value: false,
                message:
                  "Medias that have been provided to others cannot be uploaded!",
              },
            ],
          },
          Categories: {
            Rules: [
              {
                rule: SingleRuleValidate.Required,
              },
            ],
          },
        });
      default:
        return undefined;
    }
  };
  handleClose = () => {
    this.setState({ IsOpen: false });
  };
  onChangeTitle = (text: string) => {
    this.setState({ Title: text });
  };
  onChangeCategory = (data: any) => {
    const dataTmp = Object.keys(data);
    this.setState({
      AmountCategory: Object.values(data).length,
      ModelRender: {
        ...this.state.ModelRender,
        Categories: dataTmp.length < 1 ? undefined : dataTmp,
      },
    });
  };

  SetError = (error: AxiosError) => {
    const data = error.response?.data;
    if (data) {
      const keys = Object.keys(this.state.ModelRender);
      const MessageErrors:
        | PartialError<IVideo>
        | PartialError<IAudio>
        | undefined = {};
      keys.forEach((key) => {
        const messages = data[key];
        if (Array.isArray(messages) && messages.length > 0) {
          (MessageErrors as any)[key] = [
            {
              message: messages[0],
            },
          ];
        }
      });
      console.log({ MessageErrors });
      this.setState({ MessageErrors });
    }
  };

  onSubmit = () => {
    const messageErrors = this.state.FormValidator?.run(this.state.ModelRender);
    console.log({ messageErrors });
    if (messageErrors) {
      this.setState({
        MessageErrors: messageErrors,
      });
      if (Object.keys(messageErrors).length > 0) return;
    }

    if (this.state.Type === ModelType.EditAudio) {
      this.props.onSaveAudio && this.props.onSaveAudio(this.state.ModelRender);
    } else if (this.state.Type === ModelType.EditVideo) {
      this.props.onSaveVideo && this.props.onSaveVideo(this.state.ModelRender);
    }
  };
  OpenOverlay = () => this.setState({ IsOpenOverlay: true });
  CloseOverlay = () => this.setState({ IsOpenOverlay: false });
  getErrorMessage = (key: string) => {
    return this.state.MessageErrors && (this.state.MessageErrors as any)[key]
      ? {
        ...(this.state.MessageErrors as any)[key][0],
        error: true,
      }
      : { error: false };
  };
  renderEdit = (Model: IMedia) => {
    return (
      <>
        <div className="modal-header">
          <div className="title">{this.state.Title}</div>
          <button className="close" onClick={this.handleClose}>
            ×
          </button>
        </div>
        <div className="modal-content-custom">
          <div className="body-left">
            <div className="group-title pb-1">Details</div>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                <Sub.InputOutline
                  onBlur={this.onChangeTitle}
                  MaxLenth={100}
                  Title="Title"
                  defaultValue={Model?.Title}
                  {...this.getErrorMessage("Title")}
                  onChangeValue={(Title) => {
                    this.setState({
                      ModelRender: { ...this.state.ModelRender, Title },
                    });
                  }}
                  minRows={1}
                />
              </FormGroup>
              <FormGroup>
                <Sub.InputOutline
                  MaxLenth={2000}
                  defaultValue={Model?.Summary}
                  {...this.getErrorMessage("Summary")}
                  Title="Description"
                  onChangeValue={(Summary) => {
                    this.setState({
                      ModelRender: { ...this.state.ModelRender, Summary },
                    });
                  }}
                  minRows={5}
                />
              </FormGroup>
            </FormControl>
            <div className="group-title">{`Categories (${this.state.AmountCategory}/3)`}</div>
            <FormControl component="fieldset" fullWidth>
              <FormGroup>
                <Sub.GroupCheck
                  MaxSelect={3}
                  defaultValue={Model?.Categories}
                  {...this.getErrorMessage("Categories")}
                  Onchange={this.onChangeCategory}
                  data={this.props.Categories}
                  SelectLabel={(cate) => (cate as ICategory).Name}
                  SelectId={(cate) => (cate as ICategory).Id}
                />
              </FormGroup>
            </FormControl>
            <div className="group-title">OwnerShip</div>
            <Sub.ErrorBox {...this.getErrorMessage("IsOwner")}>
              <FormControl
                component="fieldset"
                fullWidth
                style={{ padding: "0 10px" }}
              >
                <FormLabel component="legend">
                  Do you own the video you are uploading?
                  <IconButton color="primary" aria-label="add to shopping cart">
                    <ContactSupportIcon />
                  </IconButton>
                </FormLabel>
                <Sub.SwitchButton
                  disabled={Model?.Status !== EMediaStatus.Draft}
                  defaultChecked={Model?.IsOwner}
                  onChange={(value) => {
                    this.setState({
                      ModelRender: {
                        ...this.state.ModelRender,
                        IsOwner: value,
                      },
                    });
                  }}
                  label="Yes, I filmed or own the right to this video."
                />
              </FormControl>
            </Sub.ErrorBox>
            <Sub.ErrorBox {...this.getErrorMessage("IsLicensed")}>
              <FormControl
                component="fieldset"
                fullWidth
                style={{ padding: "0 10px" }}
              >
                <Sub.RadioButtonsGroup
                  disabled={Model?.Status !== EMediaStatus.Draft}
                  data={[
                    {
                      id: "true",
                      text: "I have.",
                    },
                    {
                      id: "false",
                      text: "I have not.",
                    },
                  ]}
                  defaultValue={
                    Model?.IsLicensed === undefined ||
                      Model?.Status === EMediaStatus.Draft
                      ? undefined
                      : Model?.IsLicensed
                        ? "true"
                        : "false"
                  }
                  onChange={(value) => {
                    this.setState({
                      ModelRender: {
                        ...this.state.ModelRender,
                        IsLicensed: value === "true",
                      },
                    });
                  }}
                  title={
                    <>
                      Have you licensed this video to another company?
                      <IconButton
                        color="primary"
                        aria-label="add to shopping cart"
                      >
                        <ContactSupportIcon />
                      </IconButton>
                    </>
                  }
                />
              </FormControl>
            </Sub.ErrorBox>
            {this.props.renderExtendForm(this)}
          </div>
          <div className="body-right sticky">{this.GeneratePreview()}</div>
        </div>
        <div className="modal-footer-c">
          {Model.Status === EMediaStatus.Draft ? (
            <button className="btn btn-primary mr-1" onClick={this.onSubmit}>
              Publish
            </button>
          ) : (
            <button className="btn btn-success mr-1" onClick={this.onSubmit}>
              Save
            </button>
          )}
        </div>
      </>
    );
  };
  GeneratePreview = () => {
    const { Model } = this.state;
    return this.state.Type === ModelType.EditVideo ? (
      <div className="preview-video">
        {Model?.UploadStatus !== EUploadStatus.Processing ? (
          <ReactPlayer
            width={"100%"}
            height={"auto"}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                },
              },
            }}
            onContextMenu={(e: any) => e.preventDefault()}
            url={Model?.VideoUrl}
            controls
          />
        ) : (
          <div className="thumb-processing">Processing</div>
        )}
      </div>
    ) : (
      <div className="preview-video">
        <ReactAudioPlayer
          className="shadow"
          src={Model?.AudioUrl}
          controls
          controlsList="nodownload"
        />
      </div>
    );
  };
  async handleChange(files: File[]) {
    if (!this.props.onUpload) return
    this.setState({
      IsOpen: false, IsOpenOverlay: false
    });

    if (files.length > 0) {
      try {
        this.props.onUpload(files);
      } finally { }
    }
  }
  RefreshModel = (callback: (Model: any) => any) => {
    const Model = callback(this.state.Model);
    if (Model) {
      this.setState({ Model });
    }
  };
  renderUploadMedia = () => {
    return (
      <>
        <div className="wrap-modal" style={{ position: "relative" }}>
          <div className="modal-header">
            <div className="title">Upload media</div>
            <button className="close" onClick={this.handleClose}>
              ×
            </button>
          </div>
          <div className="modal-content-custom scroll-style4 h-100 p-5">
            <DropzoneArea
              dropzoneText="Drag and drop files here or click"
              showPreviewsInDropzone={false}
              maxFileSize={1073741824}
              filesLimit={1000}
              onDrop={this.handleChange.bind(this)}
              acceptedFiles={TypeFilters[this.state.Type]}
            />
          </div>
        </div>
      </>
    );
  };
  SwitchRender = () => {
    switch (this.state.Type) {
      case ModelType.EditVideo:
      case ModelType.EditAudio:
        return this.renderEdit(this.state.Model);
      default:
        return this.renderUploadMedia();
    }
  };
  render() {
    return (
      <Modal
        open={this.state.IsOpen}
        // onClose={this.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Fade in={this.state.IsOpen}>
          <div className="container-modal">
            <OverlayView Show={this.state.IsOpenOverlay} >
              {this.SwitchRender()}
            </OverlayView>
          </div>
        </Fade>
      </Modal>
    );
  }
}
export declare type WrapModelCreateProps = Omit<
  ModalCreateProps,
  keyof ModalCreateDefaultProps
> & {
  innerRef: React.RefObject<ModalCreateBase>;
} & ExtractProps<ModalCreateDefaultProps>;
const WrapModelCreate: React.FC<
  Omit<ModalCreateProps, keyof ModalCreateDefaultProps> & {
    innerRef: React.RefObject<ModalCreateBase>;
  } & ExtractProps<ModalCreateDefaultProps>
> = (props) => {
  return <ModalCreateBase {...props} ref={props.innerRef} />;
};

export const ModalCreate = withStyles(
  ModalCreateStyled as Styles<
    any,
    Omit<ModalCreateProps, keyof ModalCreateDefaultProps> & {
      innerRef: React.RefObject<ModalCreateBase>;
    } & ExtractProps<ModalCreateDefaultProps>
  >
)(WrapModelCreate);
