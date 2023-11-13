export enum EMediaStatus {
  Draft = "Draft",
  Pending = "Pending",
  Approved = "Approved",
  Banned = "Banned",
}
export enum EUploadStatus {
  Processing = "Processing",
  Completed = "Completed",
}
export enum EMediaType {
  Video="Video",
  Audio="Audio",
}
export interface IMedia {
  Title: string;
  Length: number;
  Id: string;
  Categories?: string[];
  IsOwner: boolean;
  IsLicensed?: boolean;
  Status: EMediaStatus;
  Type: EMediaType;
  Summary: string;
  DateCreated: Date | string;
}
export interface IVideo extends IMedia {
  Thumbnail: string;
  UploadStatus: EUploadStatus;
  VideoUrl: string;
}
export interface IAudio extends IMedia {
  AudioUrl: string;
}
export interface IAudioExtend extends IAudio {
  Thumbnail?: string;
}
export interface ICart {
  Title: string;
  Id: string;
  Thumb?: string;
  OptionId?: string;
  Price: number;
  Options?: string[];
  Type: EMediaType;
  Error?: string;
  ChannelUrl?: string;
}
export interface ICategory {
  Id: string;
  Name: string;
  UrlImage: string;
  IsActive: boolean;
}
export interface ICheckStatusResult {
  Id: string;
  Status: EUploadStatus;
}
export enum EOrderStatus {
  Pending = "Pending",
  Completed = "Completed",
}
export enum EPaymentMethod {
  PayPal = "PayPal",
}
export interface IOrder {
  Id: string;
  Name: string;
  PaymentId: string;
  TransactionId: string;
  Method: EPaymentMethod;
  DateCreated: string | Date;
  Quantity: number;
  TotalMoney: number;
  UserId: string;
  Status: EOrderStatus;
}

export interface IOrderDetail {
  Id: string;
  OrderName: string;
  MediaName: string;
  OptionName: string;
  Price: number;
  OrderId: string;
  MediaId: string;
  OptionId: string;
  Type: EMediaType;
  ChannelUrl: string;
}
export enum EBillingStatus {
  Paid = "Paid",
  UnPaid = "UnPaid",
}

// export interface IBillingDetail {
//   Id: string;
//   Name: string;
// }
export interface IEarning {
  Id: string;
  Name: string;
  Value: number;
  Color: string;
  IsPaymentRequest: boolean;
}
export interface IOptionPackage {
  Id: string;
  Name: string;
  Price: number;
  Description: string;
}

export enum ELogic {
  And,
  Or,
}

export enum EOrder {
  Ascending = "Ascending",
  Descending = "Descending",
}

export interface IPropFilter<TModel> {
  Logic?: ELogic;
  IsExactly?: boolean;
  FieldName: keyof TModel;
  Value: string;
  Scopes?: IPropFilter<TModel>[];
}

export interface IPropOrderBy<TModel> {
  Type: EOrder;
  FieldName: keyof TModel | string;
}

export interface IModelFilter<TModel> {
  Page?: number;
  Amount?: number;
  PropFilters: IPropFilter<TModel>[];
  PropOrders: IPropOrderBy<TModel>[];
}
export enum EStatusBilling {
  Unpaid = "Unpaid",
  Request = "Request",
  Paid = "Paid",
}
export interface EntityTimeBase {
  DateCreated: Date | string;
  DateUpdated: Date | string;
}
export interface IBilling extends EntityTimeBase {
  Id: string;
  Name: string;
  // PaymentRequest: Date | string | null;
  DatePayment: Date | string | null;
  DiscountRate: number;
  UserId: string;
  TotalMoney: number;
  Payout: number;
  Status: EStatusBilling;
  TransactionId: string;
  ReportTimeId: string;
  // AccountBankId?: string;
  // AccountNumber: string;
  ReportName: string;
  DateReported?: Date | string;
}
