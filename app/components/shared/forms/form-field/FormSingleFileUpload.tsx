import { connect as formikConnect, Field, FieldProps, FormikContext } from "formik";
import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { CommonHtmlProps, TAcceptedFileType, TFormikConnect } from "../../../../types";
import { SingleFileUpload } from "../../SingleFileUpload";

interface IOwnProps {
  disabled?: boolean;
  name: string;
  label: string | React.ReactNode;
  acceptedFiles: TAcceptedFileType;
  fileFormatInformation: string;
  "data-test-id"?: string;
}
interface IDispatchProps {
  uploadFile: (file: File, onDone: (error: any, fileUrl?: string) => any) => any;
  getFile: (fileUrl: string, onDone: (error: any, fileInfo?: any) => any) => any;
}
interface IState {
  isUploading: boolean;
}

export class FormSingleFileUploadComponent extends React.Component<
  IOwnProps & IDispatchProps & CommonHtmlProps & TFormikConnect,
  IState
> {
  state = {
    isUploading: false,
  };

  private onDropFile = (file: File) => {
    this.setState({ isUploading: true });

    this.props.uploadFile(file, this.onUploadingDone);
  };

  private onUploadingDone = (error: any, url?: string) => {
    this.setState({ isUploading: false });

    if (!error && url) {
      this.setValue(url);
    }
  };

  private onDeleteFile = () => {
    this.setValue(undefined);
  };

  private setValue(value?: string): void {
    const { name, formik } = this.props;
    const { setFieldValue } = formik;

    setFieldValue(name, value);
  }

  render(): React.ReactChild {
    const {
      label,
      name,
      fileFormatInformation,
      acceptedFiles,
      className,
      style,
      disabled,
    } = this.props;

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => (
          <SingleFileUpload
            data-test-id={this.props["data-test-id"]}
            acceptedFiles={acceptedFiles}
            fileUploading={this.state.isUploading}
            fileFormatInformation={fileFormatInformation}
            label={label}
            file={field.value}
            onDropFile={this.onDropFile}
            onDeleteFile={this.onDeleteFile}
            className={className}
            style={style}
            disabled={disabled}
          />
        )}
      />
    );
  }
}

export const FormSingleFileUpload = compose<
  IOwnProps &
    IDispatchProps &
    CommonHtmlProps & {
      formik: FormikContext<any>;
    },
  IOwnProps & CommonHtmlProps
>(
  appConnect<{}, IDispatchProps, IOwnProps>({
    dispatchToProps: dispatch => ({
      uploadFile: (file, onDone) =>
        dispatch(actions.formSingleFileUpload.uploadFileStart(file, onDone)),
      getFile: (fileUrl, onDone) =>
        dispatch(actions.formSingleFileUpload.getFileStart(fileUrl, onDone)),
    }),
    options: {
      pure: false,
    },
  }),
  formikConnect,
)(FormSingleFileUploadComponent);
