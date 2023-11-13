import fs from "fs";
const replaceInFile = (file, text, replace) => {
  const content = fs.readFileSync(file, "utf8");
  const result = content.replace(new RegExp(text, "g"), replace);
  fs.writeFileSync(file, result);
};

const lstFile = [
  "./node_modules/@mui/x-data-grid/DataGrid/useDataGridProps.js",
  "./node_modules/@mui/x-data-grid/legacy/DataGrid/useDataGridProps.js",
  "./node_modules/@mui/x-data-grid/modern/DataGrid/useDataGridProps.js",
  "./node_modules/@mui/x-data-grid/node/DataGrid/useDataGridProps.js",
];

lstFile.forEach((path) =>
  replaceInFile(
    path,
    "disableMultipleColumnsFiltering: true",
    "disableMultipleColumnsFiltering: false"
  )
);
