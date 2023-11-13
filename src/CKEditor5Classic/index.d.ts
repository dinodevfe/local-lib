import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Event from "@ckeditor/ckeditor5-utils/src/eventinfo";
import { EditorConfig } from "@ckeditor/ckeditor5-core/src/editor/editorconfig";
import * as React from "react";
type Editor = typeof ClassicEditor;
export interface CKEditor5ClassicProps {
  disabled?: boolean;
  data?: string;
  id?: string;
  config?: EditorConfig;
  onReady?: (editor: Editor) => void;
  onChange?: (event: Event, editor: Editor) => void;
  onBlur?: (event: Event, editor: Editor) => void;
  onFocus?: (event: Event, editor: Editor) => void;
  onError?: (event: Event, editor: Editor) => void;
}
export const CKEditor5Classic: React.FunctionComponent<CKEditor5ClassicProps>;
