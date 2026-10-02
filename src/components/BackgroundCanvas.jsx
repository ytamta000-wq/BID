"use client";
import { useEffect, useRef } from "react";
export default function BackgroundCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const dots = Array.from({ length: 400 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      size: Math.random() * 0.4 + 0.1, alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005, growing: Math.random() > 0.5
    }));
    const render = () => {
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);
      dots.forEach(d => {
        d.alpha += d.growing ? d.speed : -d.speed;
        if (d.alpha >= 0.8) d.growing = false;
        if (d.alpha <= 0.05) d.growing = true;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${d.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}