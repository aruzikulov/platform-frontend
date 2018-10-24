import "reflect-metadata";

import { configure, addDecorator } from "@storybook/react";
import { setIntlConfig, withIntl } from "storybook-addon-intl";
import StoryRouter from "storybook-react-router";
import { initScreenshot, withScreenshot } from "storybook-chrome-screenshot/lib";
import { checkA11y } from "@storybook/addon-a11y";

// Load the locale data for all your defined locales
import { addLocaleData } from "react-intl";
import enLocaleData from "react-intl/locale-data/en";

import languageEn from "../intl/locales/en-en.json";

// Provide your messages
const messages = {
  en: languageEn,
};

const getMessages = locale => messages[locale];

// Set intl configuration
addLocaleData(enLocaleData);
setIntlConfig({
  locales: ["en"],
  defaultLocale: "en",
  getMessages,
});

addDecorator(checkA11y);
addDecorator(initScreenshot());
addDecorator(
  withScreenshot({
    delay: 1000,
    viewport: [
      {
        width: 1280,
        height: 800,
      },
    ],
  }),
);
addDecorator(withIntl);
addDecorator(StoryRouter());

// Load storybook
const req = require.context("../app/components/", true, /stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
