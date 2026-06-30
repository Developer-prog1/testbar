"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface DashboardActionOptions<T> {
  readonly action: () => Promise<T>;
  readonly onSuccess?: (result: T) => void | Promise<void>;
  readonly onError?: (result: T) => void | Promise<void>;
  readonly refresh?: boolean;
  readonly isSuccess?: (result: T) => boolean;
}

/**
 * Runs a dashboard mutation with instant pending state and non-blocking refresh.
 */
export function useDashboardAction() {
  const router = useRouter();
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  const isPending = useCallback(
    (key: string) => pendingKey === key,
    [pendingKey],
  );

  const run = useCallback(
    async <T,>(
      key: string,
      {
        action,
        onSuccess,
        onError,
        refresh = true,
        isSuccess = () => true,
      }: DashboardActionOptions<T>,
    ): Promise<T> => {
      setPendingKey(key);
      try {
        const result = await action();
        if (isSuccess(result)) {
          await onSuccess?.(result);
          if (refresh) {
            startTransition(() => {
              router.refresh();
            });
          }
        } else {
          await onError?.(result);
        }
        return result;
      } finally {
        setPendingKey(null);
      }
    },
    [router],
  );

  return { run, isPending, isRefreshing, pendingKey };
}
