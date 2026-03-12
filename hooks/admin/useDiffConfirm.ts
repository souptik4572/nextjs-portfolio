"use client";

import { useState, useCallback } from "react";

interface PendingSave {
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  title?: string;
  doSave: () => Promise<void>;
}

/**
 * Manages a pending save that requires diff review before committing.
 *
 * Usage:
 *   const diff = useDiffConfirm();
 *   // Trigger the review:
 *   diff.request(originalValues, newValues, "Entry title", async () => { await save(key, data); });
 *   // Render the modal:
 *   <DiffModal isOpen={diff.isOpen} before={diff.before} after={diff.after}
 *              title={diff.title} onConfirm={diff.confirm} onCancel={diff.cancel} />
 */
export function useDiffConfirm() {
  const [pending, setPending] = useState<PendingSave | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const request = useCallback(
    (
      before: Record<string, unknown>,
      after: Record<string, unknown>,
      title: string | undefined,
      doSave: () => Promise<void>,
    ) => {
      setPending({ before, after, title, doSave });
    },
    [],
  );

  const confirm = useCallback(async () => {
    if (!pending) return;
    setIsConfirming(true);
    try {
      await pending.doSave();
    } finally {
      setIsConfirming(false);
      setPending(null);
    }
  }, [pending]);

  const cancel = useCallback(() => {
    setPending(null);
  }, []);

  return {
    isOpen: pending !== null,
    before: pending?.before ?? {},
    after: pending?.after ?? {},
    title: pending?.title,
    isConfirming,
    request,
    confirm,
    cancel,
  };
}
