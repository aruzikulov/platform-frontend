import { storiesOf } from "@storybook/react";
import * as React from "react";

import { MultiFileUpload } from "./MultiFileUpload";

const files = [
  {
    id: "test id 1",
    fileName: "test file 1",
  },
  {
    id: "test id 2",
    fileName: "test file 2",
  },
];

storiesOf("Upload/MultiFileUpload", module)
  .add("individual", () => (
    <MultiFileUpload
      uploadType="individual"
      acceptedFiles="image/*,application/pdf"
      onDropFile={() => {}}
      files={[]}
      fileUploading={false}
      layout="vertical"
    />
  ))
  .add("business layout: vertical", () => (
    <MultiFileUpload
      uploadType="business"
      acceptedFiles="image/*,application/pdf"
      onDropFile={() => {}}
      files={[]}
      layout="vertical"
      fileUploading={false}
    />
  ))
  .add("business layout: horizontal", () => (
    <MultiFileUpload
      uploadType="business"
      acceptedFiles="image/*,application/pdf"
      onDropFile={() => {}}
      files={[]}
      layout="horizontal"
      fileUploading={false}
    />
  ))
  .add("business state: uploading", () => (
    <MultiFileUpload
      uploadType="business"
      acceptedFiles="image/*,application/pdf"
      onDropFile={() => {}}
      files={[]}
      fileUploading={true}
    />
  ))
  .add("business state: with files", () => (
    <MultiFileUpload
      uploadType="business"
      acceptedFiles="image/*,application/pdf"
      onDropFile={() => {}}
      files={files}
      fileUploading={false}
    />
  ));
