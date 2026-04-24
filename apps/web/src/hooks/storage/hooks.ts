import { useMutation, useQuery } from "@tanstack/react-query";
import { getSignedUrl, uploadFile } from "@safyr/api-client";
import { storageKeys } from "./keys";

export function useSignedUrl(key: string | null | undefined) {
  return useQuery({
    queryKey: storageKeys.signedUrl(key ?? ""),
    queryFn: () => getSignedUrl(key as string),
    enabled: !!key,
  });
}

export function useUploadFile() {
  return useMutation({ mutationFn: uploadFile });
}
