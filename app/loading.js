"use client";

import { useEffect, useState } from "react";
import { TriangleFX } from "../components/BackgroundFX";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const duration = 4000;

    const timer = setInterval(() => {
      const elapsed = Date.now() - started;
      const value = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(value);

      if (value >= 100) clearInterval(timer);
    }, 40);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="route-loader">
      <TriangleFX />

      <div className="loader-center">
        <div className="loader-pyramid">
          <span />
          <span />
          <span />
        </div>

        <div className="loader-brand">
          B<span>ID</span>
        </div>

        <div className="index-loader">
          <div className="index-label">
            <span>INDEX</span>
            <span>{progress}%</span>
          </div>

          <div className="index-track">
            <div
              className="index-progress"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="index-status">
            {progress < 100
              ? "INITIALIZING MARKETPLACE"
              : "SYSTEM READY"}
          </div>
        </div>
      </div>
    </main>
  );
}
