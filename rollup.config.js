import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import copy from "rollup-plugin-cpy";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import typescript from "@rollup/plugin-typescript";
// import embedCSS from "rollup-plugin-embed-css";
// import inlinePostCSS from 'rollup-plugin-inline-postcss';
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";
import externalGlobals from "rollup-plugin-external-globals";

const bundle =
  (folder, ext = "ts") =>
  (config) => {
    folder = folder ? folder + "/" : "";
    return {
      ...config(folder),
      input: `src/${folder}entry.${ext}`,
    };
  };
const CreateEntryTS = (folder, plugins = []) => {
  return bundle(folder)((folder) => ({
    plugins: [
      ...plugins,
      typescript({
        target: "es6",
      }),
      // resolve(),
      // terser(),
      external({
        includeDependencies: true,
      }),
      babel({
        exclude: /node_modules/,
        // We are using @babel/plugin-transform-runtime
        runtimeHelpers: true,
      }),
      copy({
        files: [`src/${folder}index.d.ts`],
        dest: `dest/${folder}`,
      }),
      copy({
        files: ["package.json"],
        dest: `dest`,
      }),
      commonjs(),
      sizeSnapshot(),
    ],
    output: [
      {
        file: `dest/${folder}${pkg.main}`,
        format: "cjs",
        sourcemap: true,
      },
      // {
      //   file: `${name}.mjs`,
      //   format: "es",
      //   sourcemap: true,
      // },
      {
        file: `dest/${folder}${pkg.module}`,
        format: "es",
        sourcemap: true,
      },
    ],
  }));
};
const CreateEntryJS = (folder, plugins = []) => {
  return bundle(
    folder,
    "js"
  )((folder) => ({
    plugins: [
      ...plugins,
      external({
        includeDependencies: true,
      }),
      terser(),
      babel({
        exclude: /node_modules/,
        // We are using @babel/plugin-transform-runtime
        runtimeHelpers: true,
      }),
      copy({
        files: [`src/${folder}index.d.ts`],
        dest: `dest/${folder}`,
      }),
      resolve(),
      commonjs(),
      // sizeSnapshot(),
    ],
    output: [
      {
        file: `dest/${folder}${pkg.main}`,
        format: "cjs",
        sourcemap: true,
      },
      // {
      //   file: `${name}.mjs`,
      //   format: "es",
      //   sourcemap: true,
      // },
      {
        file: `dest/${folder}${pkg.module}`,
        format: "es",
        sourcemap: true,
      },
    ],
  }));
};
export default [
  // CreateEntryTS("GridTable"),
  // CreateEntryTS("ApiAuthorization"),
  // CreateEntryTS("SubComponents"),
  // CreateEntryTS("helper", [
  //   copy({
  //     files: [`@types/index.d.ts`],
  //     dest: `dest/@types`,
  //   }),
  // ]),
  // CreateEntryJS("DropZone"),
  // CreateEntryJS("CKEditor5"),
  // CreateEntryJS("CKEditor5Classic"),
  CreateEntryTS("Views"),
];
