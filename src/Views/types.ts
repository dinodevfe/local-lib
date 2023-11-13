export enum LazyStatus {
  Loading,
  Loaded,
  Error,
}
export interface TStateRedux {
  Status: LazyStatus;
}
export type FetchAction<TParam> = (p: TParam) => void;
export interface TDispatchRedux<TParam = any> {
  FetchData: FetchAction<Partial<TParam>>;
}
export type StyleClasses<Model extends (...args: any) => any> = {
  [key in keyof Extract<ReturnType<Model>, unknown>]: string;
};
export type ExtractProps<Model> = {
  [key in keyof Extract<Model, unknown>]?: Model[key];
};

export type ExtractDefaultProps<props, defaultProps> =
  ExtractProps<defaultProps> & Omit<props, keyof defaultProps>;
