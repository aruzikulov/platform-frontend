import * as cn from "classnames";
import { Field, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import { Creatable as ReactSelectCreatable } from "react-select";
import Select from "react-virtualized-select";

import { CommonHtmlProps } from "../../../types";
import { FormError } from "../../shared/forms";
import { Tag } from "../../shared/Tag";

import * as checkIcon from "../../../assets/img/inline_icons/close_no_border.svg";
import * as styles from "./EtoTagWidget.module.scss";

type ICombinedProps = IProps & CommonHtmlProps;

interface IProps {
  name: string;
  selectedTagsLimit: number;
  options: { value: string; label: string }[];
}

interface IInternalProps {
  values: string[];
  onChange: (newTag: string) => void;
  handleSelectedTagClick: (tag: string) => void;
  disabled: boolean;
  testId?: string;
}

//This is a temporary solution
//@see https://github.com/JedWatson/react-select/issues/2181
class Creatable extends React.Component {
  render(): React.ReactNode {
    return <ReactSelectCreatable {...this.props} />;
  }
}

export const generateTagOptions = (tags: string[]): { value: string; label: string }[] =>
  tags.map((word: string) => ({
    value: word,
    label: word,
  }));

const TagsFormEditor: React.SFC<ICombinedProps & IInternalProps> = ({
  name,
  className,
  disabled,
  options,
  values,
  handleSelectedTagClick,
  onChange,
}) => (
  <div className={cn(styles.tagWidget, className)} data-test-id={`form.name.${name}`}>
    <Select
      disabled={disabled}
      options={options}
      clearable={false}
      matchPos="start"
      matchProp="value"
      simpleValue
      selectComponent={Creatable}
      onChange={newTag => onChange(newTag as any)}
      placeholder={"Add category"}
      noResultsText="No matching word"
      className={cn("mb-3", styles.tagsForm)}
    />
    {values.length > 0 && (
      <div>
        {values.map(tag => (
          <Tag
            onClick={() => handleSelectedTagClick(tag)}
            text={tag}
            className={cn(styles.tag, "ml-1")}
            svgIcon={checkIcon}
            size="small"
            key={tag}
            placeSvgInEnd
          />
        ))}
      </div>
    )}
    <FormError name={name} />
  </div>
);

class EtoTagWidget extends React.Component<IProps & CommonHtmlProps> {
  render(): React.ReactNode {
    const { name, selectedTagsLimit } = this.props;

    return (
      <FormikConsumer>
        {({ values, setFieldValue }) => {
          const selectedTags: string[] = values[name] || [];

          return (
            <Field
              name={name}
              render={({ field }: FieldProps) => (
                <TagsFormEditor
                  {...this.props}
                  {...field}
                  onChange={newTag => {
                    const isAlreadyOnTheList = selectedTags.some(tag => tag === newTag);
                    if (!isAlreadyOnTheList) setFieldValue(name, [...selectedTags, newTag]);
                  }}
                  handleSelectedTagClick={(clickedTag: string) => {
                    const listWithRemovedTag = selectedTags.filter(tag => tag !== clickedTag);
                    return setFieldValue(name, listWithRemovedTag);
                  }}
                  disabled={selectedTags.length === selectedTagsLimit}
                  values={selectedTags}
                />
              )}
            />
          );
        }}
      </FormikConsumer>
    );
  }
}

export { EtoTagWidget };
