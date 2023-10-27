import { NightwatchTests, NightwatchBrowser } from "nightwatch";
import { exec } from "child_process";
import { resolve, basename } from "path";

import { BundlerPage } from "../pages/bundlerPage";

const directory = __dirname;

function fetch(filename: string) {
  return resolve(`${directory}/../../files/${filename}`);
}

function filename(filepath: string) {
  return basename(filepath);
}

const bundlerTests: NightwatchTests = {
  before: function () {
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

  "Landing Page Test": (browser: NightwatchBrowser) => {
    const bundler = browser.page.bundlerPage();

    bundler.navigate().assert.titleContains("LÖVEBrew").end();
  },

  // #region Texture Tests

  "Texture Too Big": (browser: NightwatchBrowser) => {
    const bundler = browser.page.bundlerPage();
    const filepath = fetch("cat_big_both.png");

    const message = `Image ${filename(filepath)} is too large!`;

    bundler
      .navigate()
      .uploadFile("input[type='file']", filepath)
      .assertToastMessage(false, message);

    browser.end();
  },

  // #endregion
};

export default bundlerTests;
