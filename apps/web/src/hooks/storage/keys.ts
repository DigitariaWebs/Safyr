export const storageKeys = {
  all: ["storage"] as const,
  signedUrl: (key: string) => [...storageKeys.all, "signed-url", key] as const,
};
