const StorageKeys = {
  SESSION_TOKEN: "SESSION_TOKEN",
} as const;

export type StorageKeysType = (typeof StorageKeys)[keyof typeof StorageKeys];

class StorageUtility {
  static setItem<T>(key: StorageKeysType, value: T): void {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch {
      // Ignoré
    }
  }

  static getItem<T>(key: StorageKeysType): T | null {
    try {
      const jsonValue = localStorage.getItem(key);
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      return value;
    } catch {
      return null;
    }
  }

  static removeItem(key: StorageKeysType): void {
    try {
      localStorage.removeItem(key);
    } catch {}
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch {}
  }

  static getMultipleItems(
    keys: Array<StorageKeysType>,
  ): Record<StorageKeysType, unknown> | undefined {
    try {
      const storage = localStorage as unknown as {
        multiGet?: (keys: string[]) => Array<[string, string | null]>;
      };
      if (!storage.multiGet) return undefined;

      const result = storage.multiGet(keys);
      const final = result.reduce(
        (
          pre: Record<StorageKeysType, unknown>,
          curr: [string, string | null],
        ) => {
          const val = curr[1] ? JSON.parse(curr[1]) : null;
          return {
            ...pre,
            [curr[0]]: val,
          };
        },
        {} as Record<StorageKeysType, unknown>,
      );
      return final;
    } catch {
      return undefined;
    }
  }
}

export { StorageUtility, StorageKeys };
