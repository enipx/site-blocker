import {
  AllElementsSelectors,
  ModeType,
  getCurrentMode,
  getDOMElementHandler,
  getDeviceMode,
  onLoadHandler,
  showFeedbackHandler,
} from "./helpers/_base";
import { getStoredValue, storeValue } from "./helpers/storage";

const selectors = AllElementsSelectors;

const globalState = {
  password: "",
  mode: getDeviceMode(),
  allowIgnore: false,
};

const passwordElements = {
  form: getDOMElementHandler(selectors.passwordForm),
  password: getDOMElementHandler(selectors.passwordInput) as HTMLInputElement,
  currentPassword: getDOMElementHandler(
    selectors.currentPasswordInput
  ) as HTMLInputElement,
};

const ignoreSwitchElement = getDOMElementHandler(
  selectors.ignoreSwitch
) as HTMLInputElement;
const modeSwitchElement = getDOMElementHandler(
  selectors.modeSwitch
) as HTMLInputElement;

const onMountHandler = async () => {
  const currentMode = (await getCurrentMode()) as ModeType;

  const password = await getStoredValue("password");

  const allowIgnore = await getStoredValue("allowIgnore");

  modeSwitchElement.checked = currentMode === "dark";
  ignoreSwitchElement.checked = allowIgnore;

  globalState.mode = currentMode;
  globalState.password = password;
  globalState.allowIgnore = allowIgnore;

  if (!password) {
    passwordElements.currentPassword?.classList.add("hide");
  }

  onLoadHandler();
};

onMountHandler();

/**
 *
 * @NOTE update password to add extra layer of security
 */

const updatePasswordHandler = (evt: Event) => {
  evt.preventDefault();

  const { value: passwordValue } = passwordElements.password;
  const { value: currentPassword } = passwordElements.currentPassword;

  const passwordExists = !!globalState.password;

  const onSuccess = () => {
    if (!passwordValue) {
      showFeedbackHandler({
        message: "Please enter a password! ❌",
        type: "error",
      });

      return;
    }

    storeValue("password", passwordValue);
    globalState.password = passwordValue;
    passwordElements.currentPassword?.classList.remove("hide");

    passwordElements.password.value = "";
    passwordElements.currentPassword.value = "";

    showFeedbackHandler({
      message: "Password set! 🎉",
    });
  };

  if (passwordExists) {
    if (currentPassword === globalState.password) {
      onSuccess();
    } else {
      showFeedbackHandler({
        message: "Password doesn't match! ❌",
        type: "error",
      });
    }
  } else {
    onSuccess();
  }
};

passwordElements.form?.addEventListener("submit", updatePasswordHandler);

/**
 *
 * @NOTE allowing ignore support
 */
const switchAllowIgnoreHandler = (evt: Event) => {
  const allow = (<HTMLInputElement>evt.target).checked;

  storeValue("allowIgnore", allow);
};

ignoreSwitchElement?.addEventListener(
  "change",
  switchAllowIgnoreHandler,
  false
);

/**
 *
 * @NOTE switch mode
 */
const switchModeHandler = (evt: Event) => {
  const mode: ModeType = (<HTMLInputElement>evt.target).checked
    ? "dark"
    : "light";

  document.documentElement.setAttribute("data-theme", mode);
  storeValue("mode", mode);
};

modeSwitchElement?.addEventListener("change", switchModeHandler, false);
