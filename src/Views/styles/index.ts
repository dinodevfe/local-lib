import { Theme } from "@mui/material";
import deepmerge from "deepmerge";
export const VideoPageStyle = (theme: Theme) => ({
  "@global": {
    ".container-video-page": {
      display: "flex",
      flex: 1,
      padding: "10px",
      flexDirection: "column",
    },
    ".container-video-page .panel-action": {
      height: "5rem",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "5px 10px",
    },
    ".container-video-page .panel-action .title": {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    ".wrap-thumb-video": {
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    ".wrap-thumb-video img": { height: "100%" },
    ".thumb-processing": {
      animation: "back-ground-change 5s infinite",
      backgroundColor: "gray",
      height: "100%",
      width: "100%",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "@keyframes back-ground-change": {
      "0%": { backgroundColor: "lightgray" },
      "50%": { backgroundColor: "gray" },
      "100%": { backgroundColor: "lightgray" },
    },
    ".wrap-title-video": {
      alignItems: "center",
      width: "100%",
      position: "relative",
    },
    ".wrap-title-video .title": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "1rem",
      display: "block",
    },
    ".wrap-title-video .container-action": {
      display: "none",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    ".MuiDataGrid-row:hover .container-action": {
      position: "absolute",
      display: "flex",
      width: "100%",
      height: "100%",
      backgroundColor: "#f0f1f9cc",
      top: "0",
    },
    ".MuiDataGrid-row.Mui-selected:hover .container-action": {
      backgroundColor: "#f0f1f9cc",
    },
    ".MuiDataGrid-cell:focus": {
      outline: "none !important",
    },
  },
});
export const OrderPageStyle = (theme: Theme) => ({
  "@global": {
    ...VideoPageStyle(theme)["@global"],
    ".container-card": { minWidth: "150px", margin: "5px", minHeight: "100px" },
    ".container-video-page .panel-action": { height: "auto" },
    ".wrap-cards": {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
    },
  },
});
export const ModalDetailStyled = (theme: Theme) =>
  deepmerge(
    {
      "@global": {
        ".container-show-more": {
          minWidth: "300px",
          maxWidth: "800px",
          minHeight: "100px",
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid #1976d2",
          padding: "0px 10px 0px 0px",
          margin: "10px",
        },
        ".show-more-title": {
          fontWeight: "bold",
          margin: "5px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      },
    },
    ModalCreateStyled(theme)
  );
export const ModalCreateStyled = (theme: Theme) => ({
  "@global": {
    ".container-modal": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      position: "relative",
    },
    ".wrap-modal": {
      backgroundColor: "white",
      height: "85vh",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
    },
    ".wrap-modal.not-mobile": { width: "70vw" },
    ".modal-header": { height: "4rem" },
    ".modal-header .title": { fontWeight: "bold" },
    ".modal-content-custom": { overflowY: "auto", display: "flex", flex: 1 },
    ".modal-footer-c": {
      display: "flex",
      justifyContent: "flex-end",
      borderTop: "1px solid #e0e0e0",
      padding: "2px",
    },
    ".body-left": { flex: 6, padding: "10px" },
    ".body-right": { flex: 4, display: "flex", justifyContent: "center" },
    ".preview-video": {
      justifyContent: "center",
      margin: "5px",
      width: "100%",
      display: "flex",
      alignItems: "center",
    },
    ".group-input": { marginBottom: "1rem" },
    ".sticky": { position: "sticky" },
    " .sticky": { position: "-webkit-sticky", top: "10px" },
    ".group-title": { fontWeight: "bold", fontSize: "1rem" },
    ".modal-content-custom .MuiDropzoneArea-root": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "gray",
    },
    ".MuiSvgIcon-root.MuiDropzoneArea-icon": { color: "#303f9f" },
    ".MuiSvgIcon-root.MuiDropzoneArea-icon:hover": { opacity: 0.8 },
    ".overlay-lazy": {
      position: "absolute",
      top: "0",
      left: "0",
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      alignItems: "center",
      justifyContent: "center",
      display: "none",
    },
    ".overlay-lazy.show": { display: "flex" },
  },
});
export const UploadStatusStyled = (theme: Theme) => ({
  "@global": {
    ".upload-list": {
      display: "none",
      position: "fixed",
      bottom: "10px",
      zIndex: 99,
      fontSize: "18px",
      border: "none",
      outline: "none",
      cursor: "pointer",
      borderRadius: "4px",
      width: "20rem",
      backgroundColor: "white",
    },
    ".upload-list.show": { display: "block" },
    ".content-upload-list": {
      borderRadius: "5px",
      height: "0",
      animationDuration: "0.5s",
      animationName: "show-content-upload",
      overflowY: "auto",
    },
    ".header-upload-list": {
      padding: "7px",
      borderBottom: "1px solid #e0e0e0",
      height: "40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    ".content-upload-list.show": {
      height: "20rem",
      animationName: "collapse-content-upload",
    },
    // "@keyframes collapse-content-upload": {
    //   from: { height: "0" },
    //   to: { height: "20rem" },
    // },
    // "@keyframes show-content-upload": {
    //   from: { height: "20rem" },
    //   to: { height: "0" },
    // },
    ".close.left": { cssFloat: "left" },
    ".header-upload-list .title": {
      margin: "0 10px",
      fontSize: "1rem",
      fontWeight: "bold",
    },
    ".item-file": { display: "flex", alignItems: "center" },
    ".item-file .title": {
      flex: 1,
      display: "block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "0.8rem",
    },
    ".wrap-item:hover": { backgroundColor: "#e0e0e0" },
    ".wrap-item": { padding: "10px" },
  },
});
