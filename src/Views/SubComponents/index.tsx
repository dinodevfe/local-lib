import { CircularProgress } from '@mui/material';
import { Styles, withStyles } from '@mui/styles'
import React, { ComponentType, CSSProperties, FC, MouseEvent, useCallback } from 'react'
import { CreateUseMediaQuery } from '../../helper';
import { StyleClasses } from '../types'
import {
    GridCellParams,
    GridFilterInputValueProps,
    GridFilterItem,
    GridStateColDef,
} from "@mui/x-data-grid";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { ConfigTable } from 'local-lib/GridTable';
import deepmerge from 'deepmerge';

const OverlayViewStyles: Styles<any, OverlayProps> = () => ({
    "wrapModal": {
        backgroundColor: "white",
        height: "85vh",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        padding: "2px",
        width: props => props.isMobile ? "auto" : "70vw"
    },
    "OverLayLazy": {
        position: "absolute",
        top: "0",
        left: "0",
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        display: props => props.Show ? "flex" : "none"
    },

})
const OverlayPageStyles: Styles<any, OverlayProps> = () => ({
    "wrapModal": {
        display: "flex",
        width: props => props.isMobile ? "auto" : "70vw",
        flex: 1
    },
    "OverLayLazy": {
        position: "absolute",
        top: "0",
        left: "0",
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        display: props => props.Show ? "flex" : "none"
    },

})
const LazyContent: FC<any> = (props) => {
    return <CircularProgress color="info" />
}
interface OverlayProps {
    classes: StyleClasses<typeof OverlayViewStyles>;
    style?: CSSProperties;
    Show?: boolean;
    isMobile?: boolean;
    Content?: ComponentType<{ classes: StyleClasses<typeof OverlayViewStyles>; }>,
    onPressOut?: React.MouseEventHandler<HTMLDivElement>
}
const OverLayBase: FC<OverlayProps> = (props) => {
    const { Content } = props
    const _onPressOut = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            event.stopPropagation()
            props.onPressOut && props.onPressOut(event)
        },
        [props],
    )
    return (
        <div onMouseDown={_onPressOut} className={props.classes.wrapModal} style={props.style}>
            {props.children}
            <div className={props.classes.OverLayLazy} >
                {Content && <Content classes={props.classes} />}
            </div>
        </div>
    );
};
OverLayBase.defaultProps = {
    Content: LazyContent
}
const WrapMobile: FC<OverlayProps> = (props) => {
    const isMobile = CreateUseMediaQuery();
    return <OverLayBase isMobile={isMobile} {...(props as any)} />
}
WrapMobile.defaultProps = {
    Content: LazyContent
}
export const OverlayView = withStyles<Styles<any, Omit<OverlayProps, "classes" | "isMobile">>>(OverlayViewStyles as any)(WrapMobile);
export const OverlayPage = withStyles<Styles<any, Omit<OverlayProps, "classes" | "isMobile">>>(OverlayPageStyles as any)(WrapMobile);

export interface MaterialUIPickersProps {
    OnChange: (value: Date | null) => void
    value?: Date
}
const MaterialUIPickers: FC<MaterialUIPickersProps> = (props) => {

    const handleChange = (newValue: Date | null) => {
        props.OnChange(newValue)
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                label="Value"
                inputFormat="MM/dd/yyyy"
                value={props.value || null}
                onChange={handleChange}
                renderInput={(params) => <TextField variant="standard" {...params} />}
            />
        </LocalizationProvider>
    );
}
export interface GridFilterOperator {
    label?: string;
    value: string;
    getApplyFilterFn: (
        filterItem: GridFilterItem,
        column: GridStateColDef
    ) => null | ((params: GridCellParams) => boolean);
    InputComponent?: React.JSXElementConstructor<GridFilterInputValueProps>;
    InputComponentProps?: Record<string, any>;
}

export const DateTimeFilters: GridFilterOperator[] = [
    {
        label: "From",
        value: "From",
        getApplyFilterFn: (filterItem) => {
            if (
                !filterItem.columnField ||
                !filterItem.value ||
                !filterItem.operatorValue
            ) {
                return null;
            }
            return (params: GridCellParams): boolean => {
                return new Date(new Date(params.value).toDateString()) >= new Date(new Date(filterItem.value).toDateString());
            };
        },
        InputComponent: (props: GridFilterInputValueProps) => {
            const Onchange = useCallback(
                (value: Date | null) => {

                    value && props.applyValue({ ...props.item, value });
                },
                [props]
            );
            return (
                <MaterialUIPickers value={props.item.value} OnChange={Onchange} />
            );
        },
    },
    {
        label: "To",
        value: "To",
        getApplyFilterFn: (filterItem) => {
            if (
                !filterItem.columnField ||
                !filterItem.value ||
                !filterItem.operatorValue
            ) {
                return null;
            }
            return (params: GridCellParams): boolean => {
                return new Date(new Date(params.value).toDateString()) <= new Date(new Date(filterItem.value).toDateString());
            };
        },
        InputComponent: (props: GridFilterInputValueProps) => {
            const Onchange = useCallback(
                (value: Date | null) => {

                    value && props.applyValue({ ...props.item, value });
                },
                [props]
            );
            return (
                <MaterialUIPickers value={props.item.value} OnChange={Onchange} />
            );
        },
    },
    {
        label: "Equal",
        value: "Equal",
        getApplyFilterFn: (filterItem) => {
            if (
                !filterItem.columnField ||
                !filterItem.value ||
                !filterItem.operatorValue
            ) {
                return null;
            }
            return (params: GridCellParams): boolean => {
                return new Date(new Date(params.value).toDateString()) === new Date(new Date(filterItem.value).toDateString());
            };
        },
        InputComponent: (props: GridFilterInputValueProps) => {
            const Onchange = useCallback(
                (value: Date | null) => {

                    value && props.applyValue({ ...props.item, value });
                },
                [props]
            );
            return (
                <MaterialUIPickers value={props.item.value} OnChange={Onchange} />
            );
        },
    },
];

export const mergeConfigTable = (config1: Partial<ConfigTable<any>>, config2: Partial<ConfigTable<any>>) => {
    const mergeOptions = deepmerge(config1, config2)
    const noneOptionIndex = Object.keys(mergeOptions.Options).filter(key => mergeOptions.Options[key]?.InsertPosition === undefined)
    const OptionIndex = Object.keys(mergeOptions.Options).filter(key => mergeOptions.Options[key]?.InsertPosition !== undefined)

    OptionIndex.forEach(key => {
        const index = (mergeOptions.Options as any)[key].InsertPosition
        noneOptionIndex.splice(index, 0, key)
    })
    mergeOptions.Options =
        noneOptionIndex.reduce((obj: any, key: string) => { obj[key] = (mergeOptions.Options as any)[key]; return obj }, {} as any)
    return mergeOptions
}