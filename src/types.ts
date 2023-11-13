import { StyledComponentProps, CreateCSSProperties, Styles } from "@mui/styles";
export type withStylesRef<
  Props,
  ClassKey extends string = string
> = React.JSXElementConstructor<
  Omit<Props, "classes"> & StyledComponentProps<ClassKey> & object
>;
export type StyledCss<Props extends object = any, Theme = any> =
  | CreateCSSProperties<Props>
  | ((props: { theme: Theme } & Props) => CreateCSSProperties<Props>)
  | Styles<any, any>;
