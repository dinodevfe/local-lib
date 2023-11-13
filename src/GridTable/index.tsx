import * as React from "react";
import {
  DataGrid,
  DataGridProps,
  DATA_GRID_PROPS_DEFAULT_VALUES,
  GridColDef,
  GridFilterItem,
  gridFilterModelSelector,
  GridRowIdGetter,
  GridToolbar,
  GridValidRowModel,
  useGridApiContext,
} from "@mui/x-data-grid";
import { mergeStateWithFilterModel } from '@mui/x-data-grid/hooks/features/filter/gridFilterUtils'
import { CustomGridFilterPanel } from "./CustomGridFilterPanel";
import { withStyles } from "@mui/styles";
import { withStylesRef } from "../types";

type GridInputComponentProps<R extends GridValidRowModel = any> = DataGridProps<R> & React.RefAttributes<HTMLDivElement>

type ModelBase = { [key: string]: any };
type GridColDefCustom<TModel> = {
  [key in keyof Extract<TModel, ModelBase>]?: Omit<GridColDef, "field"> & { InsertPosition?: number };
};

export interface DataTableProps<TModel> {
  // columns: GridColDefCustom<TModel>[];
  data: TModel[];
  rowHeight?: number;
  loading?: boolean;
  classes: {
    "container-DataGrid": string;
  };
  InnerProps?: Partial<GridInputComponentProps>;
}
interface ConfigTable<TModel> {
  Options: GridColDefCustom<TModel>;
  SelectId: GridRowIdGetter<TModel>;
}
export declare type TypeTableRef<Props> = withStylesRef<
  Props,
  "container-DataGrid"
>;

const CustomerGridToolbar: React.FC<any> = (props) => {
  const apiRef = useGridApiContext();
  // const [gridState, SetGridState] = useGridState(apiRef!);
  const upsertFilterItem = React.useCallback(
    (item: GridFilterItem) => {
      const gridState = apiRef.current.state
      if (item.id) {
        const index = gridState.filter.filterModel.items.findIndex(
          (x) => x.id === item.id
        );
        if (index >= 0) {
          gridState.filter.filterModel.items[index] = Object.assign(
            {},
            gridState.filter.filterModel.items[index],
            item
          );
        }
      } else {
        const field = item.columnField
          ? item.columnField
          : gridState.columns.all[0];
        const column = gridState.columns.lookup[field];
        const Temp = {
          id: Math.round(1e5 * Math.random()),
          columnField: field,
          operatorValue: column.filterOperators
            ? column.filterOperators[0].value
            : "",
        };
        gridState.filter.filterModel.items.push(Object.assign({}, Temp, item));
      }
      // apiRef.current.setState(mergeStateWithFilterModel({ ...gridState.filter.filterModel }, false, apiRef));
      // apiRef.current.unstable_applyFilters();
      apiRef.current.setFilterModel({ ...gridState.filter.filterModel, items: [...gridState.filter.filterModel.items] });
      const apiObject = apiRef.current as any
      const key_fun = Object.keys(apiObject).find(x => /(_applyFilters)/.test(x)) ?? ''
      apiObject[key_fun]();
    },
    [apiRef]
  );
  //componentdidmount
  React.useEffect(() => {
    console.log({ first: apiRef!.current })
    apiRef!.current.upsertFilterItem = upsertFilterItem;
  }, [apiRef, upsertFilterItem]);

  return <GridToolbar {...props} />;
};

export function CreateTable<TModel>(
  Config: ConfigTable<TModel>
): TypeTableRef<DataTableProps<TModel>> {
  // console.log({ disableMultipleColumnsFiltering: DATA_GRID_PROPS_DEFAULT_VALUES.disableMultipleColumnsFiltering })
  if (DATA_GRID_PROPS_DEFAULT_VALUES.disableMultipleColumnsFiltering) {
    throw "disableMultipleColumnsFiltering is true"
  }
  const columns = Object.keys(Config.Options).map((key) => {
    return { ...Config.Options[key], field: key } as GridColDef;
  });

  const DataTable: React.FC<DataTableProps<TModel>> = (props) => {
    // const [sortModel, setSortModel] = React.useState<GridSortModel>([
    //   {
    //     field: "id",
    //     sort: "asc",
    //   },
    // ]);

    return (
      <div className={props.classes["container-DataGrid"]}>
        <DataGrid
          density={"compact"}
          getRowId={Config.SelectId}
          rows={props.data}
          // sortModel={sortModel}
          components={{
            Toolbar: CustomerGridToolbar,
            FilterPanel: (props: any) => <CustomGridFilterPanel {...props} />,
          }}
          loading={props.loading}
          rowHeight={props.rowHeight ?? 100}
          columns={columns}
          // onSortModelChange={(model) => setSortModel(model)}
          {...(props.InnerProps ?? {}) as any}
        />
      </div>
    );
  };
  return withStyles(
    () => ({
      "container-DataGrid": { height: "100%" },
    }),
    { name: "DataTable" }
  )(DataTable);
}
