import { findKey, forEach } from "lodash";

import { Dictionary } from "../../types";
import { acceptWallet } from "./index";
import { formField, formFieldErrorMessage, tid } from "./selectors";

type TFormFieldFixture =
  | {
      value: string;
      type: "submit" | "tags" | "single-file" | "date" | "select" | "range" | "radio";
    }
  | {
      values: Dictionary<boolean>;
      type: "checkbox";
    }
  | {
      type: "media";
      values: Record<string, string>;
    }
  | {
      type: "multiple-files";
      values: string[];
    }
  | {
      type: "submit";
    }
  | {
      type: "custom";
      method: string;
      value: any;
    }
  | string;

export type TFormFixture = {
  [fieldIdentifier: string]: TFormFieldFixture;
};

export const fillField = (key: string, value: string, parent: string = "body") => {
  cy.get(parent).within(() => {
    cy.get(formField(key))
      .clear()
      .type(value);
  });
};

const isSubmitField = (field: TFormFieldFixture) =>
  typeof field === "object" && field.type === "submit";

/**
 * Fill out a form
 * @param fixture - Which form fixture to load
 * @param submit - whether to submit the form or not, default true
 * @param methods - custom methods to fill input
 */
export const fillForm = (
  fixture: TFormFixture,
  { submit = true, methods = {} }: { submit?: boolean; methods?: any } = {},
) => {
  forEach(fixture, (field, key) => {
    // the default is just typing a string into the input
    if (typeof field === "string") {
      fillField(key, field);
    }
    // date
    else if (field.type === "date") {
      const values = field.value.split("/");
      cy.get(formField(key)).each((subField, index) => {
        cy.wrap(subField).type(values[index]);
      });
    }
    // select field
    else if (field.type === "select") {
      cy.get(formField(key)).select(field.value);
    }

    //TODO changes here are not reflected in other parts of UI.
    // Need to investigate this further
    else if (field.type === "range") {
      cy.get(formField(key))
        .invoke("val", field.value)
        .trigger("change");
    }
    // check or uncheck a radio
    else if (field.type === "radio") {
      cy.get(formField(key)).check(field.value, { force: true });
    }
    //check or uncheck a checkbox
    else if (field.type === "checkbox") {
      const element = cy.get(formField(key));

      forEach(field.values, (checked, value) => {
        if (checked) {
          element.check(value, { force: true });
        } else {
          element.uncheck(value, { force: true });
        }
      });
    }
    // tags
    else if (field.type === "tags") {
      cy.get(formField(key))
        .then($form => $form.find("input"))
        .type(field.value, { force: true, timeout: 20 })
        .wait(1000)
        .type("{enter}", { force: true });
    }
    // files
    else if (field.type === "single-file") {
      uploadSingleFileToFieldWithTid(key, field.value);
    } else if (field.type === "multiple-files") {
      uploadMultipleFilesToFieldWithTid(key, field.values);
    } else if (field.type === "media") {
      const socialProfilesTid = tid(key);

      cy.get(socialProfilesTid).then($socialProfiles => {
        forEach(field.values, (value, key) => {
          const $button = $socialProfiles.find(tid(`social-profiles.profile-button.${key}`));

          if (!$button.hasClass("is-selected")) {
            $button.click();
          }

          fillField(`social-profiles.profile-input.${key}`, value, socialProfilesTid);
        });
      });
    } else if (field.type === "custom") {
      const method = methods[field.method];

      if (!method) {
        throw new Error(`Cannot find custom method ${method}`);
      }

      method(key, field.value);
    }
  });

  if (submit) {
    const submitField = findKey(fixture, isSubmitField);

    if (!submitField) {
      throw new Error("Please provide ' submit' fixture");
    }

    cy.get(tid(submitField)).awaitedClick();
  }
};

/**
 * Returns field error message.
 * In case there is no error empty string is returned
 * @param formTid Form TID
 * @param key Field name
 * @returns Chainable string
 */
export const getFieldError = (formTid: string, key: string): Cypress.Chainable<string> => {
  const errorMessageTid = formFieldErrorMessage(key);

  return cy.get(formTid).then($form => $form.find(errorMessageTid).text());
};

/**
 * Upload ipfs document to a dropzone field
 * @param targetTid - test id of the dropzone field
 * @param fixture - which fixture to load
 */
export const uploadDocumentToFieldWithTid = (targetTid: string, fixture: string) => {
  cy.get(tid(targetTid, tid("eto-add-document-drop-zone"))).dropFile(fixture);

  cy.get(tid("documents-ipfs-modal-continue")).click();
  acceptWallet();

  cy.get(tid(targetTid, tid("documents-download-document"))).should("exist");
};

/**
 * Upload single file to a dropzone field
 * @param targetTid - test id of the dropzone field
 * @param fixture - which fixture to load
 */
export const uploadSingleFileToFieldWithTid = (targetTid: string, fixture: string) => {
  cy.get(tid(targetTid)).within(() => {
    cy.root().dropFile(fixture);
    cy.get(tid("single-file-upload-delete-file")).should("exist");
  });
};

/**
 * Upload multiple files to a dropzone field
 * @param targetTid - test id of the dropzone field
 * @param fixtures - which fixtures to load
 */
export const uploadMultipleFilesToFieldWithTid = (targetTid: string, fixtures: string[]) => {
  fixtures.forEach(fixture =>
    cy.get(tid(targetTid)).within(() => {
      cy.get(tid("multi-file-upload-dropzone")).dropFile(fixture);

      cy.get(tid(`multi-file-upload-file-${fixture}`)).should("exist");
    }),
  );
};
