import { useCallback, useEffect, useRef, useState } from 'react';

type TriggerOptions = {
  visibleMs?: number;
  afterMs?: number;
};

const DEFAULT_VISIBLE_MS = 900;
const DEFAULT_AFTER_MS = 200;

export function useCorrectFeedback() {
  const [showStarPopup, setShowStarPopup] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const afterTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (afterTimerRef.current !== null) {
      window.clearTimeout(afterTimerRef.current);
      afterTimerRef.current = null;
    }
  }, []);

  const resetCorrectFeedback = useCallback(() => {
    clearTimers();
    setShowStarPopup(false);
  }, [clearTimers]);

  const triggerCorrectFeedback = useCallback(
    (after?: () => void, options?: TriggerOptions) => {
      const visibleMs = options?.visibleMs ?? DEFAULT_VISIBLE_MS;
      const afterMs = options?.afterMs ?? DEFAULT_AFTER_MS;

      clearTimers();
      setShowStarPopup(true);

      hideTimerRef.current = window.setTimeout(() => {
        setShowStarPopup(false);
        if (after) {
          afterTimerRef.current = window.setTimeout(after, afterMs);
        }
      }, visibleMs);
    },
    [clearTimers],
  );

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    showStarPopup,
    triggerCorrectFeedback,
    resetCorrectFeedback,
  };
}
