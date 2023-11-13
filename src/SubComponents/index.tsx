import React, { FC, useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  Radio,
  RadioGroup,
  Switch,
  SwitchClassKey,
  SwitchProps,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// import { WithContext as ReactTags } from "react-tag-input";
import { KeyExtractor } from "../helper";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
export interface ErrorProps {
  error?: boolean;
  message?: string;
}
export interface InputOutlineProps extends ErrorProps {
  Title: string;
  MaxLength: number;
  minRows: number;
  maxRows: number;
  className?: string;
  onChangeValue?: (text: string) => void;
  onBlur?: (text: string) => void;
  defaultValue?: string;
  innerInput?: React.RefObject<HTMLInputElement>
  disabled?: boolean
  inputProps?: TextFieldProps
}
export const InputOutline: FC<InputOutlineProps> = (props) => {
  const [state, SetState] = useState({
    value: props.defaultValue,
  });
  const Title = `${props.Title} (${state.value?.length ?? 0}/${props.MaxLength
    })`;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChangeValue && props.onChangeValue(event.target.value);
    SetState((st) => ({ ...st, value: event.target.value }));
  };
  return (
    <FormControl className={props.className} fullWidth variant="outlined">
      <TextField
        id={`outlined-adornment-${props.Title}`}
        label={Title}
        error={props.error}
        disabled={props.disabled}
        helperText={props.message}
        onChange={handleChange}
        defaultValue={props.defaultValue}
        onBlur={() => props.onBlur && props.onBlur(state.value || "")}
        minRows={props.minRows}
        maxRows={props.maxRows}
        inputProps={{
          maxLength: props.MaxLength,
        }}
        inputRef={props.innerInput}
        multiline
        variant="outlined"
        {...(props.inputProps ?? {})}
      />
    </FormControl>
  );
};

interface InputOutlinePasswordProps extends ErrorProps {
  Title: string;
  MaxLength: number;
  className?: string;
  onChangeValue?: (text: string) => void;
  onBlur?: (text: string) => void;
  defaultValue?: string;
  innerInput?: React.RefObject<HTMLInputElement>
  disabled?: boolean
  inputProps?: OutlinedInputProps
}
export const InputOutlinePassword: FC<InputOutlinePasswordProps> = (props) => {
  const [state, SetState] = useState({
    value: props.defaultValue,
  });
  const [isShowPassword, setIsShowPassword] = useState(false)
  const Title = `${props.Title} (${state.value?.length ?? 0}/${props.MaxLength})`;
  console.log(Title)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChangeValue && props.onChangeValue(event.target.value);
    SetState((st) => ({ ...st, value: event.target.value }));
  };
  const handleClickShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  return (
    <FormControl className={props.className} fullWidth>
      <ErrorBox error={props.error} message={props.message}>
        <InputLabel htmlFor={`outlined-adornment-${props.Title}`}>{Title}</InputLabel>
        <OutlinedInput
          id={`outlined-adornment-${props.Title}`}
          label={Title}
          error={props.error}
          disabled={props.disabled}
          fullWidth
          onChange={handleChange}
          defaultValue={props.defaultValue}
          onBlur={() => props.onBlur && props.onBlur(state.value || "")}
          inputProps={{
            maxLength: props.MaxLength,
          }}
          inputRef={props.innerInput}
          type={isShowPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {isShowPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          {...(props.inputProps ?? {})}
        />
      </ErrorBox>
    </FormControl>
  );
};
type ErrorBoxProps = ErrorProps & {
  position?: "Top" | "Bottom"
}
const ErrorBoxBase: FC<ErrorBoxProps> = (props) => {
  let lstContent = [
    <div key={"key1"} className={props.error ? "border-error" : ""}>{props.children}</div>,
    <FormHelperText
      key={"key2"}
      className="MuiFormHelperText-contained"
      error={props.error}
    >
      {props.message}
    </FormHelperText>]
  if (props.position === "Top") {
    lstContent = lstContent.reverse()
  }
  return (
    <>
      {lstContent}
    </>
  );
};
export const ErrorBox = styled(ErrorBoxBase)({
  ".border-error": { border: "1px solid #f44336", borderRadius: "5px" },
});
interface GroupCheckProps extends ErrorProps {
  data: any[];
  SelectLabel: (item: any) => number | string;
  SelectId: (item: any) => number | string;
  MaxSelect: number;
  Onchange?: (data: { [key: string]: any }) => void;
  defaultValue?: string[] | number[];
}
interface GroupCheckState {
  CheckedList: {
    [key: string]: any;
  };
  disable: boolean;
}

export const GroupCheck: FC<GroupCheckProps> = (props) => {
  const [state, SetState] = useState<GroupCheckState>({
    CheckedList: (() => {
      const data: {
        [key: string]: any;
      } = [];
      props.defaultValue?.forEach((x) => {
        const item = props.data.find((item) => props.SelectId(item) === x);
        if (item) {
          data[x] = item;
        }
      });
      return data;
    })(),
    disable: (props.defaultValue?.length ?? 0) >= props.MaxSelect,
  });

  const OnChange = (item: any, index: number, checked: boolean) => {
    if (checked) {
      state.CheckedList[props.SelectId(item)] = item;
    } else {
      delete state.CheckedList[props.SelectId(item)];
    }

    if (Object.values(state.CheckedList).length >= props.MaxSelect) {
      SetState({ ...state, disable: true });
    } else if (state.disable) {
      SetState({ ...state, disable: false });
    }
    props.Onchange && props.Onchange(state.CheckedList);
  };
  return (
    <ErrorBox error={props.error} message={props.message}>
      <Box
        color="text.primary"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          ml: 3,
          justifyContent: "space-between",
        }}
      >
        {props.data.map((item, index) => {
          return (
            <FormControlLabel
              key={KeyExtractor(item, index)}
              label={props.SelectLabel(item)}
              control={
                <Checkbox
                  disabled={
                    state.disable && !state.CheckedList[props.SelectId(item)]
                  }
                  onChange={(e, checked) => OnChange(item, index, checked)}
                  checked={!!state.CheckedList[props.SelectId(item)]}
                />
              }
            />
          );
        })}
      </Box>
    </ErrorBox>
  );
};

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}
const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

interface SwitchButtonProp extends ErrorProps {
  label?: string;
  onChange?: (value: boolean) => void;
  defaultChecked?: boolean;
  disabled?: boolean;
}
export const SwitchButton = (props: SwitchButtonProp) => {
  return (
    <ErrorBox error={props.error} message={props.message}>
      <Box
        color="text.primary"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          ml: 3,
          justifyContent: "space-between",
        }}
      >
        <FormControlLabel
          control={
            <IOSSwitch
              disabled={props.disabled}
              defaultChecked={props.defaultChecked}
              onChange={(e, checked) =>
                props.onChange && props.onChange(checked)
              }
              name="checkedB"
            />
          }
          label={props.label ?? ""}
        />
      </Box>
    </ErrorBox>
  );
};
export interface RadioData {
  id: string;
  text: string;
  isDisable?: boolean;
}
interface RadioButtonsGroupProp {
  data: RadioData[];
  title: string | JSX.Element;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export const RadioButtonsGroup: FC<RadioButtonsGroupProp> = (props) => {
  const [value, setValue] = React.useState(props.defaultValue ?? "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange && props.onChange((event.target as HTMLInputElement).value);
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{props.title}</FormLabel>
      <RadioGroup value={value} onChange={handleChange}>
        {props.data.map((x, index) => {
          return (
            <FormControlLabel
              key={KeyExtractor(x, index)}
              value={x.id}
              control={<Radio disabled={props.disabled || x.isDisable} />}
              label={x.text}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};
export const WrapStyleBase: React.FC<any> = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);
// const KeyCodes = {
//   comma: 188,
//   enter: 13,
// };

// const delimiters = [KeyCodes.comma, KeyCodes.enter];
// interface ITag {
//   id: string;
//   text: string;
// }
// interface TagInputState {
//   tags: ITag[];
//   suggestions: ITag[];
// }
// interface TagInputProps {
//   className?: string;
// }
// export class TagInputs extends React.Component<TagInputProps, TagInputState> {
//   constructor(props: TagInputProps) {
//     super(props);

//     this.state = {
//       tags: [
//         { id: "Thailand", text: "Thailand" },
//         { id: "India", text: "India" },
//       ],
//       suggestions: [
//         { id: "USA", text: "USA" },
//         { id: "Germany", text: "Germany" },
//         { id: "Austria", text: "Austria" },
//         { id: "Costa Rica", text: "Costa Rica" },
//         { id: "Sri Lanka", text: "Sri Lanka" },
//         { id: "Thailand", text: "Thailand" },
//       ],
//     };
//     this.handleDelete = this.handleDelete.bind(this);
//     this.handleAddition = this.handleAddition.bind(this);
//     this.handleDrag = this.handleDrag.bind(this);
//     this.Id = new Date().getTime().toString();
//   }
//   Id: string;
//   handleDelete(i: number) {
//     const { tags } = this.state;
//     this.setState({
//       tags: tags.filter((tag, index) => index !== i),
//     });
//   }

//   handleAddition(tag: ITag) {
//     this.setState((state) => ({ tags: [...state.tags, tag] }));
//   }

//   handleDrag(tag: ITag, currPos: number, newPos: number) {
//     const tags = [...this.state.tags];
//     const newTags = tags.slice();

//     newTags.splice(currPos, 1);
//     newTags.splice(newPos, 0, tag);

//     // re-render
//     this.setState({ tags: newTags });
//   }
//   Content = () => {
//     const { tags, suggestions } = this.state;
//     return (
//       <ReactTags
//         tags={tags}
//         suggestions={suggestions}
//         handleDelete={this.handleDelete}
//         handleAddition={this.handleAddition}
//         handleDrag={this.handleDrag}
//         delimiters={delimiters}
//       />
//     );
//   };
//   render() {
//     const { Content } = this;
//     return (
//       <FormControl
//         className={this.props.className}
//         fullWidth
//         variant="outlined"
//       >
//         <OutlinedInput
//           inputComponent={Content}
//           // labelWidth={1}
//           rows={4}
//           multiline
//         />
//       </FormControl>
//     );
//   }
// }
