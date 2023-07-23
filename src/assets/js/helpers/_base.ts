import { getStoredValue, storeValue } from "./storage";

export type ModeType = "dark" | "light";
export type BlockingType = "site" | "word";

export const AllClassNames = {
  removeItemButton: "remove-list-item",
};

export const AllElementsSelectors = {
  passwordForm: "#password-form",
  passwordInput: "#password-input",
  currentPasswordInput: "#current-password-input",
  ignoreSwitch: "#ignore-switch",
  modeSwitch: "#mode-switch",
  focusButton: "#focus-mode-btn",
  feedback: ".feedback",
  wordFeedback: ".word-feedback",
  blockSiteForm: "#block-site-form",
  blockWordForm: "#block-word-form",
  blockSiteList: "#block-site-list",
  blockWordList: "#block-word-list",
  siteInput: "#site-input",
  wordInput: "#word-input",
  focusOffButton: "#focus-off-btn",
  focusBreakButton: "#focus-break-btn",
  removeItemButton: `.${AllClassNames.removeItemButton}`,
};

export const getDOMElementHandler = (selector?: string) => {
  const domElement = document.querySelector(selector || "");

  return (domElement as HTMLElement | null) || undefined;
};

export const redirectHandler = (url: string) => {
  window.location.href = url;
};

type GetCurrentModeOptions = {
  load?: boolean;
} | void;

export const getDeviceMode = () => {
  const mode: ModeType =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  return mode;
};

export const getCurrentMode = async (options: GetCurrentModeOptions) => {
  let mode = getDeviceMode();

  const storedMode = (await getStoredValue("mode")) as ModeType;

  mode = storedMode || mode;

  if (options && options?.load) {
    document.documentElement.setAttribute("data-theme", mode);
  }

  return mode;
};

export const loadModeHandler = () => {
  getCurrentMode({ load: true });
};

export const onLoadHandler = () => {
  loadModeHandler();
};

type ShowFeedbackHandlerOptions = {
  message: string;
  type?: "error" | "success";
  timeout?: number;
  className?: string;
  selector?: string;
};

export const showFeedbackHandler = (options: ShowFeedbackHandlerOptions) => {
  const {
    message,
    type = "success",
    timeout = 3000,
    className,
    selector,
  } = options;

  const feedbackElement = getDOMElementHandler(
    selector || AllElementsSelectors.feedback
  );

  if (feedbackElement) {
    feedbackElement.classList.remove("hide");
    feedbackElement.classList.add(type);

    if (className) {
      feedbackElement.classList.add(className);
    }

    feedbackElement.textContent = message;

    setTimeout(() => {
      feedbackElement.classList.add("hide");
      feedbackElement.classList.remove(type);
    }, timeout);
  }
};

export type AddItemToListHandlerOptions = {
  value: string;
  type?: BlockingType;
  store?: boolean;
};

export const addItemToListHandler = (options: AddItemToListHandlerOptions) => {
  const { value, type = "site", store } = options;

  const selector =
    type === "site"
      ? AllElementsSelectors.blockSiteList
      : AllElementsSelectors.blockWordList;

  const selectorElement = getDOMElementHandler(selector);

  const itemElement = `
    <div class="list_item" data-item="${value}" data-type="${type}">
      <p class="content">${value}</p>
      <div class="cursor ${AllClassNames.removeItemButton} lh-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.2525 1.49951H12.755C15.2975 1.49951 17 3.28451 17 5.93951V12.0678C17 14.7153 15.2975 16.4995 12.755 16.4995H6.2525C3.71 16.4995 2 14.7153 2 12.0678V5.93951C2 3.28451 3.71 1.49951 6.2525 1.49951ZM11.7575 11.2495C12.0125 10.9953 12.0125 10.5828 11.7575 10.3278L10.4225 8.99276L11.7575 7.65701C12.0125 7.40276 12.0125 6.98276 11.7575 6.72776C11.5025 6.47201 11.09 6.47201 10.8275 6.72776L9.5 8.06201L8.165 6.72776C7.9025 6.47201 7.49 6.47201 7.235 6.72776C6.98 6.98276 6.98 7.40276 7.235 7.65701L8.57 8.99276L7.235 10.3203C6.98 10.5828 6.98 10.9953 7.235 11.2495C7.3625 11.377 7.535 11.4453 7.7 11.4453C7.8725 11.4453 8.0375 11.377 8.165 11.2495L9.5 9.92276L10.835 11.2495C10.9625 11.3853 11.1275 11.4453 11.2925 11.4453C11.465 11.4453 11.63 11.377 11.7575 11.2495Z"
            fill="#E03347"
          />
        </svg>
      </div>
    </div>
  `;

  selectorElement?.insertAdjacentHTML("beforeend", itemElement);

  if (store) {
    manageItemsHandler({
      value,
      type,
    });
  }
};

export type AddArrayItemToListHandlerOptions = {
  values?: string[];
  type?: BlockingType;
};

export const addArrayItemToListHandler = (
  options: AddArrayItemToListHandlerOptions
) => {
  const { values, type } = options;

  if (values && values.length > 0) {
    values.forEach((value) => {
      addItemToListHandler({ value, type });
    });
  }
};

export type RemoveItemFromListHandlerOptions = {
  callback?: (arg: { value: string; type: BlockingType }) => void;
  store?: boolean;
};

export const removeItemFromListHandler = (
  options: RemoveItemFromListHandlerOptions
) => {
  const { callback, store } = options;

  window.addEventListener("click", (evt: Event) => {
    const target = <HTMLElement>evt.target;
    const targetIsRemoveItem = target.classList.contains(
      AllClassNames.removeItemButton
    );
    const targetClosestItem = target.closest(
      AllElementsSelectors.removeItemButton
    );

    if (targetIsRemoveItem || targetClosestItem) {
      const targetParentElement = target.closest(".list_item");

      if (targetParentElement) {
        const value = targetParentElement.getAttribute("data-item") || "";
        const type =
          (targetParentElement.getAttribute("data-type") as BlockingType) ||
          "site";

        targetParentElement.remove();
        callback?.({ value, type });

        if (store) {
          manageItemsHandler({
            value,
            type,
            action: "remove",
          });
        }
      }
    }
  });
};

export type ManageItemsHandlerOptions = {
  type?: BlockingType;
  value: string;
  action?: "add" | "remove";
  store?: boolean;
};

export const manageItemsHandler = async (
  options: ManageItemsHandlerOptions
) => {
  const { type = "site", action = "add", store = true } = options;

  const words = await getStoredValue("disabledWords");

  const sites = await getStoredValue("disabledSites");

  const list = (type === "site" ? sites || [] : words || []) as string[];

  const remove = action === "remove";

  const value = options.value.toLowerCase();

  let data = list;

  if (remove) {
    data = data.filter((i) => i?.toLowerCase?.() !== value);
  } else {
    // add item
    const exist = data.find((i) => i?.toLowerCase() === value);

    if (!exist) {
      data = [...data, value];
    }
  }

  if (store) {
    storeValue(type === "site" ? "disabledSites" : "disabledWords", data);
  }

  return data;
};
