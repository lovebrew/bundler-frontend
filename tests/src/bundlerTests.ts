import { NightwatchTests, NightwatchBrowser } from "nightwatch";
import { exec } from "child_process";
import { resolve, basename } from "path";

import { BundlerPage } from "../pages/bundlerPage";

const directory = __dirname;

function fetch(filepath: string) {
  return resolve(`${directory}/../../resources/${filepath}`);
}

const testDataPath = fetch("data.json");
const testData = require(testDataPath);

const bundlerTests: NightwatchTests = {
  before: () => {
    exec(
      "flask --app 'lovebrew:create_app(dev=True)' run",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      }
    );
  },

  "Landing Page": (browser: NightwatchBrowser) => {
    const bundler = browser.page.bundlerPage();

    bundler.navigate().assert.titleContains("LÖVEBrew").end();
  },

  // #region Texture Tests

  "Texture Dimensions Too Big": (browser: NightwatchBrowser) => {
    const bundler = browser.page.bundlerPage();

    testData.largeTextureBoth.forEach((filename: string) => {
      const filepath = fetch(filename);

      const message = `Image ${basename(filename)} is too large!`;

      bundler
        .navigate()
        .uploadFile("input[type='file']", filepath)
        .verifyToastMessage(false, message);
    });

    browser.end();
  },

  "Texture Width Too Big": (browser: NightwatchBrowser) => {
    const bundler = browser.page.bundlerPage();

    testData.largeTextureWidth.forEach((filename: string) => {
      const filepath = fetch(filename);

      const message = `Image ${basename(filename)} is too large!`;

      bundler
        .navigate()
        .uploadFile("input[type='file']", filepath)
        .verifyToastMessage(false, message);
    });

    browser.end();
  },

  "Texture Height Too Big": (browser: NightwatchBrowser) => {
    const bundler = browser.page.bundlerPage();

    testData.largeTextureHeight.forEach((filename: string) => {
      const filepath = fetch(filename);

      const message = `Image ${basename(filename)} is too large!`;

      bundler
        .navigate()
        .uploadFile("input[type='file']", filepath)
        .verifyToastMessage(false, message);
    });

    browser.end();
  },

  "Invalid Files Uploaded": (browser: NightwatchBrowser) => {
    const bundler = browser.page.bundlerPage();

    testData.invalidTexture.forEach((filename: string) => {
      const filepath = fetch(filename);

      const message = `Image ${basename(filename)} is invalid!`;

      bundler
        .navigate()
        .uploadFile("input[type='file']", filepath)
        .verifyToastMessage(false, message);
    });

    browser.end();
  },

  "No Texture Data Supplied": (browser: NightwatchBrowser) => {},

  // #endregion
};

export default bundlerTests;
