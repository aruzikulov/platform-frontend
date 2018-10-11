import { findKey, forEach } from "lodash";
import { formField, formFieldErrorMessage, tid } from "./selectors";

type TFormFieldFixture =
  | {
      value: string;
      type: "tags" | "file" | "date" | "select" | "check";
    }
  | {
      type: "media";
      values: Record<string, string>;
    }
  | {
      type: "submit";
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
 * @param submit - wether to submit the form or not, default true
 */
export const fillForm = (fixture: TFormFixture, { submit = true }: { submit?: boolean } = {}) => {
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
    // click on a field
    else if (field.type === "check") {
      cy.get(formField(key))
        .first()
        .check({ force: true });
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
    else if (field.type === "file") {
      uploadFileToFieldWithTid(key, field.value);
      cy.wait(1000);
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
    }
  });

  if (submit) {
    const submitField = findKey(fixture, isSubmitField);

    if (!submitField) {
      throw new Error("Please provide 'submit' fixture");
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
 * Upload a file to a dropzone field
 * @param targetTid - test id of the dropzone field
 * @param fixture - which fixture to load
 */
export const uploadFileToFieldWithTid = (targetTid: string, fixture: string = "example.jpg") => {
  const dropEvent = {
    dataTransfer: {
      files: [] as any,
    },
  };

  cy.fixture(fixture).then(picture => {
    return Cypress.Blob.base64StringToBlob(picture, "image/png").then((blob: any) => {
      dropEvent.dataTransfer.files.push(blob);
    });
  });

  cy.get(tid(targetTid)).trigger("drop", dropEvent);
};
