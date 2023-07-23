import {
  AllElementsSelectors,
  getDOMElementHandler,
  onLoadHandler,
  redirectHandler,
} from "./helpers/_base";
import { getStoredValue, storeValue } from "./helpers/storage";

const onMountHandler = async () => {
  const focusModeEnabled = await getStoredValue("focusModeEnabled");

  if (!focusModeEnabled) {
    redirectHandler("/src/popup.html");
  }

  onLoadHandler();
};

onMountHandler();

const selectors = AllElementsSelectors;

const focusElement = {
  turnOff: getDOMElementHandler(selectors.focusOffButton),
  takeABreak: getDOMElementHandler(selectors.focusBreakButton),
};

/**
 *
 * @NOTE focus button
 */
focusElement.turnOff?.addEventListener("click", () => {
  // ...
  storeValue("focusModeEnabled", false);

  redirectHandler("/src/popup.html");
});
