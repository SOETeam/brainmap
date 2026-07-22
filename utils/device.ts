'use client';

import { useState, useEffect } from 'react';

// Synchronous one-time check (call once at module load or first render)
let _isMobile: boolean | null = null;
let _isLowEnd: boolean | null = null;

export function getIsMobile(): boolean {
  if (_isMobile !== null) return _isMobile;
  if (typeof window === 'undefined') return false;
  _isMobile = window.innerWidth < 768;
  return _isMobile;
}

/**
 * Detect low-end devices: mobile OR low GPU memory OR reduced motion preference.
 * Conservative — only flag devices that will clearly struggle with particle effects.
 */
export function getIsLowEnd(): boolean {
  if (_isLowEnd !== null) return _isLowEnd;
  if (typeof window === 'undefined') return false;

  const mobile = getIsMobile();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Check for low GPU memory (Chromium only)
  let lowGpu = false;
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        // Common low-end GPU indicators
        lowGpu = /intel|mesa|swiftshader|llvmpipe|softpipe|apple gpu/.test(renderer);
      }
    }
  } catch {
    // ignore
  }

  _isLowEnd = mobile || reducedMotion || lowGpu;
  return _isLowEnd;
}

/**
 * React hook version — use when you need reactivity on resize.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      _isMobile = mobile;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

/**
 * Responsive particle counts. Pass desktop count, get device-appropriate count.
 */
export function deviceParticleCount(desktop: number): number {
  if (getIsLowEnd()) return Math.floor(desktop * 0.35);  // 65% reduction
  if (getIsMobile()) return Math.floor(desktop * 0.5);   // 50% reduction
  return desktop;
}
