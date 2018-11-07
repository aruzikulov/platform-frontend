import { connect, FieldArray } from "formik";
import { get } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import * as Yup from "yup";

import { CommonHtmlProps, TFormikConnect, TTranslatedString } from "../../../../types";
import { ButtonIcon } from "../../buttons";
import { FormInput } from "./FormInput";
import { FormTransformingField } from "./FormTransformingField";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";

interface IProps {
  disabled?: boolean;
  name: string;
  label?: TTranslatedString;
  prefix?: string;
  selectedCategory?: { name: string; percentage: number };
  transformRatio?: number;
}

interface IInternalProps {
  addField: (e: Event) => void;
  removeField: (e: Event) => void;
  isLastElement: boolean;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  isFirstElement: boolean;
  formFieldKeys: string[];
  validationSchema: { fields: { [key: string]: Yup.Schema<any> } };
}

interface IExternalProps {
  suggestions: string[];
  paragraphName?: string;
  fieldNames: string[];
  valuePlaceholder?: string;
}

class KeyValueCompoundFieldBase extends React.Component<IProps & IInternalProps & TFormikConnect> {
  name = this.props.name;

  setAllFieldsTouched = (event: any, isTouched?: boolean) => {
    if (event.target.value !== undefined) {
      return Object.keys(get(this.props.formik.values, this.name)).map(key => {
        this.props.formik.setFieldTouched(`${this.name}.${key}`, isTouched);
      });
    }
  };

  compoundFieldValidation = (fieldName: string, neighborName: string) => {
    const schema = this.props.validationSchema && this.props.validationSchema.fields[fieldName];
    return (value: any) => {
      const neighborValue = get(this.props.formik.values, neighborName);
      if (neighborValue !== undefined && value === undefined) {
        return <FormattedMessage id="form.field.error.both-fields-required" />;
      } else {
        try {
          if (schema) {
            schema.validateSync(value);
          }
        } catch (e) {
          return e.errors;
        }
      }
    };
  };

  render = () => {
    const {
      disabled,
      isFirstElement,
      removeField,
      isLastElement,
      keyPlaceholder,
      valuePlaceholder,
      addField,
      formFieldKeys,
      prefix,
      transformRatio,
      name,
    } = this.props;
    return (
      <>
        <Row>
          <Col xs={8}>
            <Row className="justify-content-center">
              <Col xs={1} className="pt-2">
                {isLastElement && !disabled && <ButtonIcon svgIcon={plusIcon} onClick={addField} />}
              </Col>
              <Col>
                <FormInput
                  disabled={disabled}
                  name={`${name}.${formFieldKeys[0]}`}
                  placeholder={keyPlaceholder}
                  onBlur={this.setAllFieldsTouched}
                  customValidation={this.compoundFieldValidation(
                    formFieldKeys[0],
                    `${name}.${formFieldKeys[1]}`,
                  )}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col xs={9}>
                {
                  <FormTransformingField
                    disabled={disabled}
                    min="0"
                    prefix={prefix}
                    name={`${name}.${formFieldKeys[1]}`}
                    ratio={transformRatio}
                    onBlur={this.setAllFieldsTouched}
                    placeholder={valuePlaceholder}
                    customValidation={this.compoundFieldValidation(
                      formFieldKeys[1],
                      `${name}.${formFieldKeys[0]}`,
                    )}
                  />
                }
              </Col>
              {!isFirstElement && (
                <span className="pt-2">
                  {!disabled && <ButtonIcon svgIcon={closeIcon} onClick={removeField} />}
                </span>
              )}
            </Row>
          </Col>
        </Row>
        <Row />
      </>
    );
  };
}

class ArrayOfKeyValueFieldsBase extends React.Component<
  IProps & IExternalProps & CommonHtmlProps & TFormikConnect
> {
  private blankField = this.props.fieldNames.reduce((acc: any, key: string) => {
    acc[key] = undefined;
    return acc;
  }, {});
  private suggestions = [...this.props.suggestions];
  private setFieldValue = this.props.formik.setFieldValue;
  private validationSchema =
    this.props.formik.validationSchema &&
    this.props.formik.validationSchema().fields[this.props.name]._subType;

  componentWillMount(): void {
    if (!get(this.props.formik.values, this.props.name)) {
      this.suggestions.forEach((_, index) =>
        this.setFieldValue(`${this.props.name}.${index}`, this.blankField),
      );
    }
  }

  render(): React.ReactNode {
    const { prefix, transformRatio, disabled, formik, name, valuePlaceholder } = this.props;

    const categoryDistribution = get(formik.values, name) || [];
    const formFieldKeys = this.props.fieldNames;

    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <>
            {categoryDistribution.map(
              (_: { description: string; percent: number }, index: number) => {
                const isLastElement = index === categoryDistribution.length - 1;
                const isFirstElement = index === 0;

                return (
                  <KeyValueCompoundField
                    disabled={disabled}
                    key={index}
                    formFieldKeys={formFieldKeys}
                    prefix={prefix}
                    name={`${name}.${index}`}
                    removeField={(e: Event) => {
                      e.preventDefault();
                      arrayHelpers.remove(index);
                      this.suggestions.splice(index, 1);
                    }}
                    valuePlaceholder={valuePlaceholder}
                    keyPlaceholder={this.suggestions[index] || "Other"}
                    addField={() => {
                      this.setFieldValue(`${name}.${index + 1}`, this.blankField);
                    }}
                    isFirstElement={isFirstElement}
                    isLastElement={isLastElement}
                    transformRatio={transformRatio}
                    validationSchema={this.validationSchema}
                  />
                );
              },
            )}
          </>
        )}
      />
    );
  }
}

const KeyValueCompoundField = connect<IProps & IInternalProps>(KeyValueCompoundFieldBase);

export const ArrayOfKeyValueFields = connect<IProps & IExternalProps & CommonHtmlProps, any>(
  ArrayOfKeyValueFieldsBase,
);
