"use client";

import { useRef } from "react";
import { asset } from "@/lib/site";

/**
 * Mouse-reactive 3D tilt for the home-hero logo.
 * The mark tilts toward the cursor with a perspective transform, and the
 * accent glow behind it parallaxes the opposite way for depth. Snaps back
 * when the pointer leaves. Disabled for reduced-motion / touch devices,
 * where it renders as the plain static logo.
 */
export default function LogoTilt({ alt }: { alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Max tilt in degrees at the corners.
  const MAX = 10;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const glow = glowRef.current;
    if (!wrap || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = wrap.getBoundingClientRect();
    // -0.5 .. 0.5 relative to center
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    const rotY = px * MAX * 2; // left/right
    const rotX = -py * MAX * 2; // up/down

    img.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    if (glow) {
      // Parallax the glow opposite the tilt for depth.
      glow.style.transform = `translate(${-px * 24}px, ${-py * 24}px)`;
      glow.style.opacity = "0.32";
    }
  }

  function reset() {
    const img = imgRef.current;
    const glow = glowRef.current;
    if (img) img.style.transform = "";
    if (glow) {
      glow.style.transform = "";
      glow.style.opacity = "";
    }
  }

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="logo-tilt relative mx-auto hidden [perspective:800px] md:block"
    >
      <div
        ref={glowRef}
        className="logo-tilt-glow absolute inset-0 -z-10 rounded-full blur-3xl transition-[transform,opacity] duration-300 ease-out"
        style={{ background: "var(--glow)" }}
        aria-hidden="true"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={asset("/serbres-logo.svg")}
        alt={alt}
        className="logo-themed logo-tilt-img mx-auto w-56 transition-transform duration-300 ease-out [will-change:transform] lg:w-64"
        width={256}
        height={256}
      />
    </div>
  );
}
