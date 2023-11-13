import React, { Component, FC } from "react";
import { Dictionary } from "@reduxjs/toolkit";
import { IconButton, Tooltip } from "@mui/material";
import DetailIcon from "@mui/icons-material/Apps";
import { ModalDetailBase, ModalDetailStyleBase } from "./ModalDetail";
import { FormatterUSD } from "../../helper";
import { ConfigTable, CreateTable, DataTableProps, TypeTableRef } from "local-lib/GridTable";
import { ExtractProps, LazyStatus, TDispatchRedux } from "../types";
import { IOrder, IOrderDetail } from "../Models";
import { Styles, withStyles } from "@mui/styles";
import { OrderPageStyle } from "../styles";
import { DateTimeFilters, mergeConfigTable } from "../SubComponents";
interface OrderPageProps {
  configTable?: Partial<ConfigTable<any>>
}
interface OrderState { }
export interface OrderReduxState {
  Status: LazyStatus;
  data: Dictionary<IOrder>;
  fetchUserOrderDetail: (...param: any[]) => Promise<IOrderDetail[]>;
  DownloadMedia: (data: IOrderDetail) => Promise<void>;
}

export interface OrderDispatchProps extends TDispatchRedux<any> {
  FetchData: () => void;
}
type _OrderPageProps = OrderReduxState & OrderDispatchProps & OrderPageProps;
export class OrderPage extends Component<_OrderPageProps, OrderState> {
  constructor(props: _OrderPageProps) {
    super(props);
    this.OrderTable = this.InitialTable();
  }
  InitialTable = () => {
    return CreateTable<IOrder>(mergeConfigTable({
      SelectId: (r) => r.Id,
      Options: {
        Name: {
          flex: 1,
          minWidth: 200,
          renderCell: (data) => {
            return (
              <ItemTitle
                onDetail={() => this.onDetail(data.row as IOrder)}
                title={data.value?.toString() ?? ""}
              />
            );
          },
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
        Method: {
          flex: 1,
          minWidth: 200
        },
        TransactionId: {
          flex: 1,
          minWidth: 200
        },
        Quantity: {
          flex: 1,
          minWidth: 150
        },
        TotalMoney: {
          flex: 1,
          minWidth: 200,
          valueFormatter: (param) => {
            return FormatterUSD().format(param.value as number);
          },
        },
        Status: {
          flex: 1,
          minWidth: 150
        },
      },
    }, this.props.configTable ?? {}));
  };
  OrderTable: TypeTableRef<DataTableProps<IOrder>>;
  refModal = React.createRef<ModalDetailBase>();
  onDetail = (order: IOrder) => {
    this.refModal.current?.handleOpen(order);
  };
  render() {
    const { OrderTable } = this;
    return (
      <div className="container-video-page">
        <div className="panel-action">
          <div className="title">Orders</div>
          <div></div>
        </div>
        <OrderTable
          rowHeight={100}
          data={Object.values(this.props.data) as IOrder[]}
        />
        <ModalDetailStyleBase
          FetchData={this.props.fetchUserOrderDetail}
          innerRef={this.refModal}
          DownloadMedia={this.props.DownloadMedia}
        />
      </div>
    );
  }
}
// const mapStateToProps = (state: RootState) => ({
//   Status: state.UserOrderSlice.Status,
//   data: state.UserOrderSlice.entities,
// });
// const mapDispatchToProps = (dispatch: AppDispatch): DispatchProps => {
//   return {
//     FetchData: () => {
//       dispatch(fetchUserOrderAll());
//     },
//   };
// };
interface ItemTitleProps {
  title: string;
  onDetail?: () => void;
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
      </div>
    </div>
  );
};
// export default CreateHocLazy<any, ReduxState, DispatchProps>(
//   OrderPage,
//   mapStateToProps,
//   mapDispatchToProps,
//   {
//     IsChanceLayout: true,
//   }
// );
export const OrderPageBase = withStyles(OrderPageStyle as Styles<any, _OrderPageProps>)(
  OrderPage
);
