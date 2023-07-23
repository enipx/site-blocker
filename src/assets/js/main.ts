import {
  AllElementsSelectors,
  addArrayItemToListHandler,
  addItemToListHandler,
  getDOMElementHandler,
  isValidUrlHandler,
  onLoadHandler,
  redirectHandler,
  removeItemFromListHandler,
  showFeedbackHandler,
} from "./helpers/base";
import { getStoredValue, storeValue } from "./helpers/storage";

type GlobalStateType = {
  disabledSites: string[];
  disabledWords: string[];
};

const globalState: GlobalStateType = {
  disabledSites: [],
  disabledWords: [],
};

const selectors = AllElementsSelectors;

const formsElement = {
  site: getDOMElementHandler(selectors.blockSiteForm),
  word: getDOMElementHandler(selectors.blockWordForm),
};

const inputsElement = {
  site: getDOMElementHandler(selectors.siteInput) as HTMLInputElement,
  word: getDOMElementHandler(selectors.wordInput) as HTMLInputElement,
};

const onMountHandler = async () => {
  const focusModeEnabled = await getStoredValue("focusModeEnabled");

  const storedBlockedSites = await getStoredValue("disabledSites");
  const storedBlockedWords = await getStoredValue("disabledWords");

  if (focusModeEnabled) {
    redirectHandler("/src/focus.html");
  }

  const blockedSites = [
    ...globalState.disabledSites,
    ...(storedBlockedSites || []),
  ];

  const blockedWords = [
    ...globalState.disabledWords,
    ...(storedBlockedWords || []),
  ];

  globalState.disabledSites = blockedSites;

  globalState.disabledWords = blockedWords;

  addArrayItemToListHandler({
    values: globalState.disabledSites,
  });

  addArrayItemToListHandler({
    values: globalState.disabledWords,
    type: "word",
  });

  removeItemFromListHandler({
    store: true,
  });

  onLoadHandler();

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTabUrl = tabs[0].url;
    const newUrl = new URL(currentTabUrl || "");

    if (inputsElement.site && currentTabUrl && currentTabUrl !== undefined) {
      // @ts-ignore
      inputsElement.site.value = newUrl.hostname;
    }
  });
};

onMountHandler();

/**
 *
 * @NOTE block site form
 */
const onSiteFormHandler = (evt: Event) => {
  evt.preventDefault();

  const { value } = inputsElement.site;

  if (value) {
    addItemToListHandler({ value, store: true });
    inputsElement.site.value = "";
  } else {
    showFeedbackHandler({
      message: "Enter a value ❌",
      type: "error",
    });
  }
};

formsElement.site?.addEventListener("submit", onSiteFormHandler);

/**
 *
 * @NOTE block word form
 */
const onWordFormHandler = (evt: Event) => {
  evt.preventDefault();

  const { value } = inputsElement.word;

  if (value) {
    addItemToListHandler({ value, type: "word", store: true });
    inputsElement.word.value = "";
  } else {
    showFeedbackHandler({
      selector: selectors.wordFeedback,
      message: "Enter a value ❌",
      type: "error",
    });
  }
};

formsElement.word?.addEventListener("submit", onWordFormHandler);

/**
 *
 * @NOTE focus button
 */
const focusButton = getDOMElementHandler(
  selectors.focusButton
) as HTMLButtonElement;

focusButton?.addEventListener("click", () => {
  // ...
  storeValue("focusModeEnabled", true);

  redirectHandler("/src/focus.html");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // @ts-ignore
    chrome.tabs.reload(tabs[0].id);
  });
});
