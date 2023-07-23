export const StorageKeys = {
  mode: "site_blocker-mode",
  password: "site_blocker-password",
  allowIgnore: "site_blocker-allowIgnore",
  focusModeEnabled: "site_blocker-focusModeEnabled",
  disabledSites: "site_blocker-disabledSites",
  disabledWords: "site_blocker-disabledWords",
};

export type StorageKeysType = keyof typeof StorageKeys;

export const storeValue = (key: StorageKeysType, value: any) => {
  const data = {
    [StorageKeys[key]]: value,
  };

  chrome.storage.local.set(data, () => {
    console.log(`Value ${value} has been stored for key ${key}.`);
  });
};

export const getAllStoredValue = (key: StorageKeysType) => {
  const storageKey = StorageKeys[key];

  // Immediately return a promise and start asynchronous work
  return new Promise(
    (
      resolve: (arg0: { [key: string]: any }) => void,
      reject: (arg0: chrome.runtime.LastError) => void
    ) => {
      // Asynchronously fetch all data from storage.sync.
      chrome.storage.local.get(storageKey, (items) => {
        // Pass any observed errors down the promise chain.
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        // Pass the data retrieved from storage down the promise chain.
        resolve(items);
      });
    }
  );
};

export const getStoredValue = async (key: StorageKeysType) => {
  const storageKey = StorageKeys[key];

  const storedValue = await getAllStoredValue(key);

  return storedValue[storageKey];
};
