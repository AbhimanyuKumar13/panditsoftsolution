import { useEffect, useRef } from "react";

const updateEvent = "pss:live-content-updated";
const storageKey = "pss:live-content-update";

export const notifyLiveContentUpdated = (contentType) => {
  const update = { contentType, updatedAt: Date.now() };
  window.dispatchEvent(new CustomEvent(updateEvent, { detail: update }));

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(update));
  } catch (error) {
    console.warn("Live update could not be broadcast to other tabs:", error);
  }
};

export const useLiveContentRefresh = (
  contentType,
  refresh,
  intervalMs = 5000,
) => {
  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    let refreshing = false;

    const runRefresh = () => {
      if (document.visibilityState === "hidden" || refreshing) return;
      refreshing = true;
      Promise.resolve(refreshRef.current())
        .catch((error) => {
          console.error(`Unable to refresh ${contentType}:`, error);
        })
        .finally(() => {
          refreshing = false;
        });
    };

    const handleCustomUpdate = (event) => {
      if (event.detail?.contentType === contentType) runRefresh();
    };
    const handleStorageUpdate = (event) => {
      if (event.key !== storageKey || !event.newValue) return;
      try {
        const update = JSON.parse(event.newValue);
        if (update.contentType === contentType) runRefresh();
      } catch (error) {
        console.error("Unable to process a live content update:", error);
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") runRefresh();
    };

    const intervalId = window.setInterval(runRefresh, intervalMs);
    window.addEventListener(updateEvent, handleCustomUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", runRefresh);
    runRefresh();

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(updateEvent, handleCustomUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", runRefresh);
    };
  }, [contentType, intervalMs]);
};
