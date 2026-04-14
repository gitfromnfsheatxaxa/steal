"use client";

import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";
import { Timer, X, Plus, Minus } from "lucide-react";

interface RestTimerProps {
  secondsLeft: number;
  isRunning: boolean;
  onStart: (seconds: number) => void;
  onStop: () => void;
  defaultSeconds: number;
}

export function RestTimer({
  secondsLeft,
  isRunning,
  onStart,
  onStop,
  defaultSeconds,
}: RestTimerProps) {
  if (!isRunning && secondsLeft === 0) return null;

  const progress = isRunning
    ? ((defaultSeconds - secondsLeft) / defaultSeconds) * 100
    : 100;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 md:bottom-0">
      <div className="mx-auto max-w-md px-4 pb-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
          {/* Progress bar */}
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold tabular-nums">
                {formatDuration(secondsLeft)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {isRunning && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onStart(secondsLeft - 15)}
                    disabled={secondsLeft <= 15}
                    aria-label="Subtract 15 seconds"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onStart(secondsLeft + 15)}
                    aria-label="Add 15 seconds"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onStop}
                aria-label="Skip rest"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {secondsLeft === 0 && (
            <p className="mt-2 text-center text-sm font-medium text-success">
              Rest complete — you&apos;re ready for the next set
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
