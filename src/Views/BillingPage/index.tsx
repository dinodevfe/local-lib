import React, { Component, FC, } from "react";

import { IBilling, IEarning, IOrderDetail } from "../Models";
import { Dictionary } from "@reduxjs/toolkit";
import {
  Card,
  CardContent,
  IconButton,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import DetailIcon from "@mui/icons-material/Apps";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOnOutlined";
import { FormatterUSD, KeyExtractor } from "../../helper";
import { ConfigTable, CreateTable, DataTableProps, GridInputComponentProps, TypeTableRef } from "local-lib/GridTable";
import {
  ModalDetailBase,
  ModalDetailStyleBase,
} from "../OrderPage/ModalDetail";
import { LazyStatus, TDispatchRedux } from "../types";
import { Styles, withStyles } from "@mui/styles";
import { OrderPageStyle } from "../styles";
import { DateTimeFilters, mergeConfigTable } from "../SubComponents";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export interface BillingPageProps {
  fetchUserBillingDetail: (...param: any[]) => Promise<IOrderDetail[]>;
  DownloadMedia: (data: IOrderDetail) => Promise<void>;
  MenuExtends?: MenuExtentBilling[]
  isTable?: boolean
  configTable?: Partial<ConfigTable<any>>
  InnerProps?: Partial<GridInputComponentProps<any>>
  renderExtendActions?: (sender: BillingPage) => JSX.Element
}

interface BillingState { }
export interface BillingReduxState {
  Status: LazyStatus;
  data: Dictionary<IBilling>;
  dataEarning: Dictionary<IEarning>;
}

export interface BillingDispatchProps extends TDispatchRedux<any> {
  FetchData: () => void;
}

export interface MenuExtentBilling {
  onPress: (model: IBilling) => void
  tooltip?: string
  Icon: typeof SvgIcon
  Color?:
  | 'inherit'
  | 'action'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

  IsShow?: (model: IBilling) => boolean
}
type _BillingPageProps = BillingReduxState & BillingDispatchProps & BillingPageProps;
class BillingPage extends Component<_BillingPageProps, BillingState> {
  constructor(props: _BillingPageProps) {
    super(props);
    this.BillingTable = this.InitialTable();
    this.MenuExtends = props.MenuExtends ?? []
    this.renderExtendActions = props.renderExtendActions || this._renderExtendActions
  }
  renderExtendActions: (sender: BillingPage) => JSX.Element
  _renderExtendActions = () => {
    return <div></div>
  }
  InitialTable = () => {
    return CreateTable<IBilling>(mergeConfigTable({
      SelectId: (r) => r.Id,
      Options: {
        Name: {
          flex: 1,
          minWidth: 250,
          renderCell: (data) => {
            return (
              <ItemTitle
                MenuExtends={this.MenuExtends}
                onDetail={() => this.onDetail(data.row as IBilling)}
                data={data.row}
                title={data.value?.toString() ?? ""}
              />
            );
          },
        },
        ReportName: {
          flex: 1,
          minWidth: 200,
          hide: true
        },
        DateCreated: {
          flex: 1,
          minWidth: 200,
          type: "date",
          valueFormatter: (param) => {
            return param.value ? new Date(param.value as any).toLocaleString() : '';
          },
          filterOperators: DateTimeFilters
        },
        TotalMoney: {
          flex: 1,
          minWidth: 200,
          valueFormatter: (param) => {
            return FormatterUSD().format(param.value as number);
          },
        },
        DiscountRate: {
          flex: 1,
          minWidth: 200,
          valueFormatter: (param) => {
            return param.value + "%";
          },
        },
        Payout: {
          flex: 1,
          minWidth: 200,
          valueFormatter: (param) => {
            return FormatterUSD().format(param.value as number);
          },
        },
        DatePayment: {
          flex: 1,
          minWidth: 200,
          type: "date",
          valueFormatter: (param) => {
            return param.value ? new Date(param.value as any).toLocaleString() : '';
          },
          filterOperators: DateTimeFilters
        },
        // PaymentRequest: {
        //   flex: 1,
        //   minWidth: 200,
        //   type: "date",
        //   hide: true,
        //   valueFormatter: (param) => {
        //     return param.value ? new Date(param.value as any).toLocaleString() : '';
        //   },
        //   filterOperators: DateTimeFilters
        // },
        // AccountNumber: {
        //   flex: 1,
        //   minWidth: 200,
        //   hide: true
        // },
        TransactionId: {
          flex: 1,
          minWidth: 200
        },
        Status: {
          flex: 1,
          minWidth: 100
        },
      },
    }, this.props.configTable ?? {}));
  };
  MenuExtends: MenuExtentBilling[] = []
  BillingTable: TypeTableRef<DataTableProps<IBilling>>;
  refModal = React.createRef<ModalDetailBase>();
  onDetail = (billing: IBilling) => {
    this.refModal.current?.handleOpen(billing);
  };
  renderEarningCard = () => {
    return (Object.values(this.props.dataEarning) as IEarning[]).map(
      (item, index) => {
        return <CardReport data={item} key={KeyExtractor(item, index)} />;
      }
    );
  };

  render() {
    const { BillingTable } = this;
    return (
      <div className="container-video-page">
        {this.props.isTable ? '' :
          <div className="panel-action">
            <div className="title">Billings</div>
            <div className="wrap-cards">{this.renderEarningCard()}</div>
            {this.renderExtendActions(this)}
          </div>}
        <BillingTable
          rowHeight={100}
          data={Object.values(this.props.data) as IBilling[]}
          InnerProps={this.props.InnerProps}
        />
        <ModalDetailStyleBase
          FetchData={this.props.fetchUserBillingDetail}
          innerRef={this.refModal}
          DownloadMedia={this.props.DownloadMedia}
        />
      </div>
    );
  }
}
// const mapStateToProps = (state: RootState): ReduxState => ({
//   Status: state.UserBillingSlice.Status,
//   data: state.UserBillingSlice.Billing.entities,
//   dataEarning: state.UserBillingSlice.Earning.entities,
// });
// const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
//   return {
//     FetchData: () => {
//       dispatch(fetchUserBillingAll());
//       dispatch(fetchUserEarningAll());
//     },
//   };
// };
interface CardReportProps {
  data: IEarning | null;
}
const CardReport: FC<CardReportProps> = (props) => {
  return (
    <Card
      className="container-card"
      style={{
        color: props.data?.Color ?? "",
      }}
    >
      <>
        {props.data ? (
          <CardContent>
            <Typography variant="subtitle2">{props.data.Name}</Typography>
            <Typography
              component="h6"
              variant="h6"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {props.data.Name === 'Discount' ? (
                <>
                  <LocalOfferIcon />
                  {FormatterUSD().format(props.data.Value).replace("$", "")}%
                </>) :
                (<>
                  <MonetizationOnIcon />
                  {FormatterUSD().format(props.data.Value).replace("$", "")}
                </>)}
            </Typography>
          </CardContent>
        ) : (
          <div className="thumb-processing"></div>
        )}
      </>
    </Card>
  );
};

interface ItemTitleProps {
  title: string;
  onDetail?: () => void;
  MenuExtends: MenuExtentBilling[]
  data: IBilling
}
const ItemTitle: FC<ItemTitleProps> = (props) => {
  return (
    <div className="wrap-title-video">
      <span className="title">{props.title}</span>
      <div className="container-action">
        <Tooltip title="Details">
          <IconButton onClick={props.onDetail}>
            <DetailIcon color="primary" />
          </IconButton>
        </Tooltip>
        {
          props.MenuExtends.filter(x => !x.IsShow || x.IsShow(props.data)).map((menu, index) => {
            const Icon = menu.Icon
            return <Tooltip key={'key' + index} title={menu.tooltip ?? ''}>
              <IconButton onClick={() => menu.onPress(props.data)}>
                <Icon color={menu.Color ? menu.Color : 'primary'} />
              </IconButton>
            </Tooltip>
          })
        }
      </div>
    </div>
  );
};
export const BillingPageBase = withStyles(OrderPageStyle as Styles<any, _BillingPageProps>)(
  BillingPage
);
export const CreateBillingPage = (initial: (sender: BillingPage) => void) => {
  class BillingPageExtents extends BillingPage {
    constructor(props: any) {
      super(props)
      initial(this)
    }
  }
  return withStyles(OrderPageStyle as Styles<any, any>)(
    BillingPageExtents
  );
} 