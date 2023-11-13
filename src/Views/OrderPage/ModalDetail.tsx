import React, { Component, FC, useRef } from "react";
import {
  CircularProgress,
  Fade,
  IconButton,
  Modal,
  Tooltip,
} from "@mui/material";
import "./ModalDetail.css";
import DownloadIcon from "@mui/icons-material/ArrowDownwardOutlined";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IBilling, IOrder, IOrderDetail } from "../Models";
import { CreateUseMediaQuery, FormatterUSD, KeyExtractor } from "../../helper";
import { CreateTable, DataTableProps, TypeTableRef } from "local-lib/GridTable";
import { withStyles } from "@mui/styles";
import { ModalDetailStyled } from "../styles";
import { OverlayPage } from "../SubComponents";

interface ModalCreateState {
  IsOpenOverlay: boolean;
  IsOpen: boolean;
  data?: IOrderDetail[];
  Title: string;
  IsShowMore: boolean,
  dataItem?: IOrderDetail
}
interface ModalDetailProps {
  FetchData: (...param: any[]) => Promise<IOrderDetail[]>;
  DownloadMedia: (data: IOrderDetail) => Promise<void>;
}
export class ModalDetailBase extends Component<
  ModalDetailProps,
  ModalCreateState
> {
  constructor(props: ModalDetailProps) {
    super(props);
    this.state = {
      IsOpenOverlay: false,
      IsOpen: false,
      Title: "",
      IsShowMore: false
    };
  }
  refOrderDetailTable = React.createRef<OrderDetailContent>();
  OpenOverlay = () => this.setState({ IsOpenOverlay: true });
  CloseOverlay = () => this.setState({ IsOpenOverlay: false });
  handleOpen = async (order: IOrder | IBilling) => {
    this.setState({
      IsOpen: true,
      data: undefined,
      Title: order.Name,
    });
    // const orderDetail = await ReportService.fetchUserOrderDetail(order);
    const orderDetail = await this.props.FetchData(order);
    this.setState({ data: orderDetail });
  };
  handleClose = () => {
    this.setState({ IsOpen: false });
  };

  generateChannelUrl = (text?: string) => {
    return <ol style={{ overflow: 'auto', maxHeight: '500px' }}> {text?.split("\n").map((t, i) => {
      return <li key={KeyExtractor(t, i)}>{t}</li>
    })}</ol>
  }

  renderShowMore = () => {
    return this.state.IsShowMore ? <div onMouseDown={e => e.stopPropagation()} className="container-show-more">
      <div className="show-more-title text-truncate">Channel/Video url ({this.state.dataItem?.MediaName})</div>
      {this.generateChannelUrl(this.state.dataItem?.ChannelUrl)}
    </div> : <div></div>
  }
  onShowMore = (data: IOrderDetail) => {
    this.setState({ IsShowMore: true, dataItem: data })
  }
  onPressOut = () => {
    this.setState({ IsShowMore: false, dataItem: undefined })
  }
  render() {
    return (
      <Modal
        open={this.state.IsOpen}
        // onClose={this.handleClose}
        aria-labelledby="simple-modal-title"

        aria-describedby="simple-modal-description"
      >
        <Fade in={this.state.IsOpen} >
          <div className="container-modal">
            <OverlayPage
              onPressOut={this.onPressOut}
              Show={this.state.IsShowMore} isMobile={true} style={{ flex: 1, display: 'flex', justifyContent: 'center' }} Content={this.renderShowMore}>
              <WrapModel>
                <div className="modal-header">
                  <div className="title">{this.state.Title}</div>
                  <button className="close" onClick={this.handleClose}>
                    ×
                  </button>
                </div>
                <OrderDetailContent
                  onShowMore={this.onShowMore}
                  loading={!this.state.data}
                  DownloadMedia={this.props.DownloadMedia}
                  data={this.state.data}
                  ref={this.refOrderDetailTable}
                />
              </WrapModel>
            </OverlayPage>
            <div
              className={`overlay-lazy ${this.state.IsOpenOverlay ? "show" : ""
                }`}
            >
              <CircularProgress color="secondary" />
            </div>
          </div>
        </Fade>
      </Modal >
    );
  }
}
const WrapModel: FC<any> = (props) => {
  const isMobile = CreateUseMediaQuery();
  return (
    <div className={isMobile ? "wrap-modal" : "wrap-modal not-mobile"}>
      {props.children}
    </div>
  );
};
interface ItemTitleProps {
  title: string;
  onDownload?: () => void;
}
const ItemTitle: FC<ItemTitleProps> = (props) => {
  return (
    <div className="wrap-title-video">
      <span className="title">{props.title}</span>
      <div className="container-action" >
        <Tooltip title="Download">
          <IconButton onClick={props.onDownload}>
            <DownloadIcon color="primary" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};
interface OrderDetailContentProps {
  loading?: boolean;
  data?: IOrderDetail[];
  DownloadMedia: (data: IOrderDetail) => Promise<void>;
  onShowMore: (data: IOrderDetail) => void;
}
interface OrderDetailContentState { }
class OrderDetailContent extends Component<
  OrderDetailContentProps,
  OrderDetailContentState
> {
  constructor(props: OrderDetailContentProps) {
    super(props);
    this.OrderTableDetail = this.InitialTable();
    this.state = {};
  }
  onDownload = async (data: IOrderDetail) => {
    await this.props.DownloadMedia(data);
  };
  onShowMore = async (data: IOrderDetail) => {
    this.props.onShowMore(data)
  };
  InitialTable = () => {
    return CreateTable<IOrderDetail>({
      SelectId: (r) => r.Id,
      Options: {
        MediaName: {
          flex: 1,
          minWidth: 200,
          renderCell: (data) => {
            return (
              <ItemTitle
                onDownload={() => this.onDownload(data.row as IOrderDetail)}
                title={data.value?.toString() ?? ""}
              />
            );
          },
        },
        Type: { minWidth: 50 },
        OptionName: { minWidth: 150 },
        ChannelUrl: {
          flex: 1, minWidth: 150, headerName: "Channel/Video Url", renderCell: (data) => {
            return (
              <ChannelUrl
                onShowMore={() => this.onShowMore(data.row as IOrderDetail)}
                value={data.value?.toString() ?? ""}
              />
            );
          },
        },
        Price: {
          minWidth: 100,
          valueFormatter: (param) => {
            return FormatterUSD().format(param.value as number);
          },
        },
      },
    });
  };

  OrderTableDetail: TypeTableRef<DataTableProps<IOrderDetail>>;
  render() {
    const { OrderTableDetail } = this;
    return (
      <OrderTableDetail
        rowHeight={100}
        loading={this.props.loading}
        data={this.props.loading ? [] : this.props.data ?? []}
      />
    );
  }
}
const WrapComponent: React.FC<
  ModalDetailProps & { innerRef?: React.RefObject<ModalDetailBase> }
> = (props) => {
  return <ModalDetailBase {...props} ref={props.innerRef} />;
};

interface ChannelUrlProps {
  value: string;
  onShowMore?: () => void;
}
const ChannelUrl: FC<ChannelUrlProps> = (props) => {
  return (
    <div className="wrap-title-video">
      <span className="title">{props.value}</span>
      <div className="container-action">
        <Tooltip title="Show all">
          <IconButton onClick={props.onShowMore}>
            <VisibilityIcon color="info" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export const ModalDetailStyleBase = withStyles(ModalDetailStyled as any)(
  WrapComponent
);
