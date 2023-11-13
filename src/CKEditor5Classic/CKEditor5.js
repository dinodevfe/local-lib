import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import EditorClassic from "ckeditor5-custom-build-classic/build/ckeditor";
export const CKEditor5Classic = (props) => {
  return <CKEditor {...props} editor={EditorClassic} />;
};
