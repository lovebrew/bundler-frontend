import { NightwatchTests, NightwatchBrowser } from "nightwatch";
import { exec } from "child_process";
import { resolve } from "path";

const directory = __dirname;

function fetch(filename: string) {
  return resolve(`${directory}/../../files/${filename}`);
}

const bundlerTests: NightwatchTests = {
  before: function() {
    exec("flask --app 'lovebrew:create_app(dev=True)' run", (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  },

  "Landing Page Test": (browser: NightwatchBrowser) => {
    browser.url(browser.baseUrl).assert.titleContains("LÖVEBrew").end();
  },

  // #region Texture Tests

  "Texture Too Big": (browser: NightwatchBrowser) => {
    browser
      .url(browser.baseUrl)
      .uploadFile("input[type='file']", fetch("cat_big_both.png"))
      .waitForElementVisible("div[id=toaster-error]")
      .end();
  }

  // #endregion
};

export default bundlerTests;
