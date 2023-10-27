import { PageObjectModel, EnhancedPageObject } from "nightwatch";

const bundlerCommands = {
  assertToastMessage(
    this: EnhancedPageObject,
    isSuccess: boolean,
    message: string
  ) {
    const toast = isSuccess ? "@successToast" : "@errorToast";

    return this.waitForElementVisible(toast).assert.textContains(
      toast,
      message
    );
  },
};

const bundlerPage: PageObjectModel = {
  url: browser.baseUrl,
  commands: bundlerCommands,
  elements: {
    errorToast: {
      selector: "//*[contains(@class, 'bg-red-600')]",
      locateStrategy: "xpath",
    },
    successToast: {
      selector: "//*[contains(@class, 'bg-green-600')]",
      locateStrategy: "xpath",
    },
  },
};

export default bundlerPage;
export interface BundlerPage
  extends EnhancedPageObject<
    typeof bundlerCommands,
    typeof bundlerPage.elements
  > {}
