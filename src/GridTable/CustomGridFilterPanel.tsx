import * as React from "react";
import Button from "@mui/material/Button";
import {
  GridFilterItem,
  GridLinkOperator,
  GridAddIcon,
  GridPanelContent,
  GridPanelFooter,
  GridPanelWrapper,
  GridFilterForm,
  useGridApiContext,
} from "@mui/x-data-grid";
// export const optionsColumns = (state: GridState) => {
//   console.log("object", { state });
//   return state.columns;
// };
// export const optionsRows = (state: GridState) => {
//   return state.rows;
// };
// import { useGridSelector } from '../../../hooks/features/core/useGridSelector';
// import { useGridState } from '../../../hooks/features/core/useGridState';
// import { optionsSelector } from '../../../hooks/utils/optionsSelector';
// import { GridFilterItem, GridLinkOperator } from '../../../models/gridFilterItem';
// import { GridApiContext } from '../../GridApiContext';
// import { GridAddIcon } from '../../icons/index';
// import { GridPanelContent } from '../GridPanelContent';
// import { GridPanelFooter } from '../GridPanelFooter';
// import { GridPanelWrapper } from '../GridPanelWrapper';
// import { GridFilterForm } from './GridFilterForm';
interface CustomGridFilterPanelProps {
  disableMultipleColumnsFiltering?: boolean;
}

export const CustomGridFilterPanel: React.FC<CustomGridFilterPanelProps> = (
  props
) => {
  // const apiRef = React.useContext(GridApiContext);
  const apiRef = useGridApiContext();
  const gridState = apiRef.current.state
  const SetGridState = apiRef.current.setState
  const hasMultipleFilters = React.useMemo(
    () => gridState.filter.filterModel.items.length > 1,
    [gridState.filter.filterModel.items.length]
  );

  const applyFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef!.current.upsertFilterItem(item);
    },
    [apiRef]
  );

  const applyFilterLinkOperator = React.useCallback(
    (operator: GridLinkOperator) => {
      apiRef!.current.setFilterLinkOperator(operator);
    },
    [apiRef]
  );
  const addNewFilter = React.useCallback(() => {
    const columns = gridState.columns.all.map(key => gridState.columns.lookup[key]).filter(x => x.filterable)
    if (columns.length < 1) {
      return
    }
    const col = apiRef!.current.getColumn(columns[0].field)
    if (!col.filterOperators) {
      return
    }
    const newItem = { 
      columnField: columns[0].field,
      operatorValue: col.filterOperators[0].value
    }
    apiRef!.current.upsertFilterItem(newItem);
  }, [apiRef, gridState.columns.all, gridState.columns.lookup]);

  const deleteFilter = React.useCallback(
    (item: GridFilterItem) => {
      apiRef!.current.deleteFilterItem(item);
    },
    [apiRef]
  );

  React.useEffect(() => {
    if (gridState.filter.filterModel.items.length === 0) {
      addNewFilter();
    }
  }, [addNewFilter, gridState.filter.filterModel.items.length]);
  console.log(gridState.filter.filterModel.items)
  return (
    <GridPanelWrapper>
      <GridPanelContent>
        {gridState.filter.filterModel.items.map((item, index) => (
          <GridFilterForm
            key={item.id}
            item={item}
            applyFilterChanges={applyFilter}
            deleteFilter={deleteFilter}
            hasMultipleFilters={hasMultipleFilters}
            showMultiFilterOperators={index > 0}
            multiFilterOperator={gridState.filter.filterModel.linkOperator}
            disableMultiFilterOperator={index !== 1}
            applyMultiFilterOperatorChanges={applyFilterLinkOperator}
          />
        ))}
      </GridPanelContent>
      <GridPanelFooter>
        <Button
          onClick={addNewFilter}
          startIcon={<GridAddIcon />}
          color="primary"
        >
          {apiRef!.current.getLocaleText("filterPanelAddFilter")}
        </Button>
      </GridPanelFooter>
    </GridPanelWrapper>
  );
};
