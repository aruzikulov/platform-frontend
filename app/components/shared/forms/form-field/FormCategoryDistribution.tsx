import { connect, FieldArray } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { CommonHtmlProps, TFormikConnect, TTranslatedString } from "../../../../types";
import { ButtonIcon } from "../../buttons";
import { FormHighlightGroup } from "../FormHighlightGroup";
import { FormField } from "./FormField";
import { FormTextArea } from "./FormTextArea";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";
import { FormTransformingField } from "./FormTransformingField";

interface IProps {
  disabled?: boolean;
  name: string;
  label?: TTranslatedString;
  prefix?: string;
  selectedCategory?: { name: string; percentage: number };
  transformRatio?: number;
}
interface IInternalProps {
  addField: () => void;
  removeField: () => void;
  isLastElement: boolean;
  placeholder: string;
  isFirstElement: boolean;
  formFieldKeys: string[];
}

interface IExternalProps {
  suggestions: string[];
  paragraphName?: string;
  blankField: object;
}

const SingleCategoryDistributionComponent: React.SFC<IProps & IInternalProps> = ({
  disabled,
  isFirstElement,
  removeField,
  isLastElement,
  placeholder,
  addField,
  formFieldKeys,
  prefix,
  transformRatio,
  name,
}) => (
  <Row>
    <Col xs={8}>
      <Row className="justify-content-center">
        <Col xs={1} className="pt-2">
          {isLastElement && !disabled && <ButtonIcon svgIcon={plusIcon} onClick={addField} />}
        </Col>
        <Col>
          <FormField
            disabled={disabled}
            name={`${name}.${formFieldKeys[0]}`}
            placeholder={placeholder}
          />
        </Col>
      </Row>
    </Col>
    <Col>
      <Row>
        <Col xs={9}>
          {transformRatio ? (
            <FormTransformingField
              disabled={disabled}
              min="0"
              prefix={prefix}
              name={`${name}.${formFieldKeys[1]}`}
              ratio={transformRatio}
            />
          ) : (
            <FormField
              disabled={disabled}
              min="0"
              prefix={prefix}
              name={`${name}.${formFieldKeys[1]}`}
              type="number"
            />
          )}
        </Col>
        {!isFirstElement && (
          <span className="pt-2">
            {!disabled && <ButtonIcon svgIcon={closeIcon} onClick={removeField} />}
          </span>
        )}
      </Row>
    </Col>
  </Row>
);

class FormCategoryDistributionLayout extends React.Component<
  IProps & IExternalProps & CommonHtmlProps & TFormikConnect
> {
  private blankField = { ...this.props.blankField };
  private suggestions = [...this.props.suggestions];

  componentWillMount(): void {
    const { name, formik } = this.props;
    const { setFieldValue, values } = formik;

    if (!values[name]) {
      this.suggestions.forEach((_, index) => setFieldValue(`${name}.${index}`, this.blankField));
    }
  }

  render(): React.ReactNode {
    const {
      name,
      label,
      className,
      paragraphName,
      prefix,
      transformRatio,
      disabled,
      formik,
    } = this.props;
    const { setFieldValue, values } = formik;

    const categoryDistribution = values[name] || [];
    const formFieldKeys = Object.keys(this.blankField);

    return (
      <FormHighlightGroup>
        <div className={className}>
          <div className="mb-4 text-uppercase">{label}</div>
          {paragraphName && (
            <FormTextArea name={paragraphName} placeholder="Detail" disabled={disabled} />
          )}

          <FieldArray
            name={name}
            render={arrayHelpers => (
              <>
                {categoryDistribution.map(
                  (_: { description: string; percent: number }, index: number) => {
                    const isLastElement = index === categoryDistribution.length - 1;
                    const isFirstElement = index === 0;

                    return (
                      <SingleCategoryDistributionComponent
                        disabled={disabled}
                        key={index}
                        formFieldKeys={formFieldKeys}
                        prefix={prefix}
                        name={`${name}.${index}`}
                        removeField={() => {
                          arrayHelpers.remove(index);
                          this.suggestions.splice(index, 1);
                        }}
                        placeholder={this.suggestions[index] || "Other"}
                        addField={() => {
                          setFieldValue(`${name}.${index + 1}`, this.blankField);
                        }}
                        isFirstElement={isFirstElement}
                        isLastElement={isLastElement}
                        transformRatio={transformRatio}
                      />
                    );
                  },
                )}
              </>
            )}
          />
        </div>
      </FormHighlightGroup>
    );
  }
}

export const FormCategoryDistribution = connect<IProps & IExternalProps & CommonHtmlProps, any>(
  FormCategoryDistributionLayout,
);
