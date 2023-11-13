export interface IResultAuth {
  status: string;
  message?: string;
  state?: any;
}
export interface LoadingAppState {
  IsOpen: boolean;
  message?: string;
}
export interface LoadingDispatchProps {
  ChangeStatus: (state: LoadingAppState) => void;
}
