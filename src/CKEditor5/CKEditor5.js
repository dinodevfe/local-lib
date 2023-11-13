import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
export const CKEditor5 = (props) => {
  return <CKEditor {...props} editor={Editor} />;
};