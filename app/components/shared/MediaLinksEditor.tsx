import { connect, FieldArray } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { CommonHtmlProps, TFormikConnect } from "../../types";
import { ButtonIcon } from "./buttons";
import { FormField } from "./forms";

import * as closeIcon from "../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../assets/img/inline_icons/round_plus.svg";

interface ISingleMediaLinkFieldInternalProps {
  isLastElement?: boolean;
  isFirstElement: boolean;
  formFieldKey: string;
  onAddClick: () => void;
  onRemoveClick: () => void;
  name: string;
  url?: string;
  placeholder: string;
  blankField: any;
}

const SingleMediaLinkField: React.SFC<
  ISingleMediaLinkFieldInternalProps & CommonHtmlProps
> = props => {
  const {
    isFirstElement,
    onAddClick,
    onRemoveClick,
    isLastElement,
    placeholder,
    blankField,
  } = props;

  return (
    <Row className="my-4">
      <Col xs={1}>
        {isLastElement && <ButtonIcon className="mt-2" svgIcon={plusIcon} onClick={onAddClick} />}
      </Col>
      <Col xs={10}>
        {blankField &&
          Object.keys(blankField).map(fieldName => {
            const isFieldWithCharactersLimit = fieldName === "title";

            return isFieldWithCharactersLimit ? (
              <FormField
                key={`${props.name}.${fieldName}`}
                name={`${props.name}.${fieldName}`}
                placeholder={fieldName || placeholder}
                charactersLimit={100}
              />
            ) : (
              <FormField
                key={`${props.name}.${fieldName}`}
                name={`${props.name}.${fieldName}`}
                placeholder={fieldName || placeholder}
              />
            );
          })}
      </Col>
      {!isFirstElement && (
        <Col xs={1}>
          <span className="pt-2">
            <ButtonIcon className="mt-2" svgIcon={closeIcon} onClick={onRemoveClick} />
          </span>
        </Col>
      )}
    </Row>
  );
};

interface IProps {
  name: string;
  placeholder: string;
  blankField: object;
}

class MediaLinksEditorLayout extends React.Component<IProps & TFormikConnect> {
  componentDidMount(): void {
    const { name, formik } = this.props;
    const { setFieldValue, values } = formik;

    if (!values[name]) setFieldValue(`${name}.0`, this.props.blankField);
  }

  render(): React.ReactNode {
    const { name, blankField, placeholder, formik } = this.props;
    const { setFieldValue, values } = formik;

    const mediaLinks: object[] = values[name] || [blankField];
    return (
      <FieldArray
        name={name}
        render={arrayHelpers =>
          mediaLinks
            .map((_: object, index: number) => {
              const isLastElement = !(index < mediaLinks.length - 1);
              const isFirstElement = index === 0;
              return (
                <SingleMediaLinkField
                  blankField={blankField}
                  name={`${name}.${index}`}
                  formFieldKey={"url"}
                  onRemoveClick={() => {
                    arrayHelpers.remove(index);
                  }}
                  onAddClick={() => {
                    setFieldValue(`${name}.${index + 1}`, blankField);
                  }}
                  placeholder={placeholder}
                  isFirstElement={isFirstElement}
                  isLastElement={isLastElement}
                  key={`${name}.${index}`}
                />
              );
            })
            .reverse()
        }
      />
    );
  }
}

export const MediaLinksEditor = connect<IProps, any>(MediaLinksEditorLayout);
