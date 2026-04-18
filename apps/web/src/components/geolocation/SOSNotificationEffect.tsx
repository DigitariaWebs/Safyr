"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useSOSStore } from "@/lib/stores/sosStore";

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      sharedAudioCtx = new AudioContext();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

const scheduleBeeps = (ctx: AudioContext) => {
  const playBeep = (delay: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.3;
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.15);
  };
  playBeep(0);
  playBeep(0.25);
  playBeep(0.5);
};

const playSOSBeep = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") {
      ctx
        .resume()
        .then(() => scheduleBeeps(ctx))
        .catch(() => {});
    } else {
      scheduleBeeps(ctx);
    }
  } catch {
    /* Browser autoplay policy — silently fail */
  }
};

export function SOSNotificationEffect() {
  const hasNewSOS = useSOSStore((s) => s.hasNewSOS);
  const clearNewSOSFlag = useSOSStore((s) => s.clearNewSOSFlag);
  const prevHasNewSOS = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wasNew = !prevHasNewSOS.current && hasNewSOS;
    prevHasNewSOS.current = hasNewSOS;

    if (!wasNew) return;

    playSOSBeep();

    const timeout = setTimeout(() => {
      clearNewSOSFlag();
    }, 600);

    return () => clearTimeout(timeout);
  }, [hasNewSOS, clearNewSOSFlag]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence>
      {hasNewSOS && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 bg-red-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  );
}
