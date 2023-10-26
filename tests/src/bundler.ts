import { NightwatchTests, NightwatchBrowser } from "nightwatch";

const bundlerTests: NightwatchTests = {
  "Landing Page Test": (browser: NightwatchBrowser) => {
    browser.url(browser.baseUrl).assert.titleContains("LÖVEBrew").end();
  },

  "Texture Conversion Test": (browser: NightwatchBrowser) => {
    browser
      .url(browser.baseUrl)
      .uploadFile("input[type='file']", "files/test.png")
      .end();
  }
};

export default bundlerTests;
