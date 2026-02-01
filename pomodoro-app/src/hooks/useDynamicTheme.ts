import { useMemo } from 'react';
import type { ThemeColors } from '../constants/theme';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Color adjustments for different times of day
const timeAdjustments: Record<TimeOfDay, { hueShift: number; saturation: number; brightness: number }> = {
    morning: { hueShift: 20, saturation: 1.1, brightness: 1.05 },      // Warm orange tint
    afternoon: { hueShift: 0, saturation: 1, brightness: 1 },          // Neutral
    evening: { hueShift: -20, saturation: 0.95, brightness: 0.95 },    // Cool blue tint
    night: { hueShift: -10, saturation: 0.85, brightness: 0.85 },      // Deeper dark
};

function getTimeOfDay(hour: number): TimeOfDay {
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
}

function hexToHsl(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustColor(hex: string, adjustment: typeof timeAdjustments['morning']): string {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(
        h + adjustment.hueShift,
        s * adjustment.saturation,
        l * adjustment.brightness
    );
}

export function useDynamicTheme(baseColors: ThemeColors, enabled: boolean = true): ThemeColors {
    return useMemo(() => {
        if (!enabled) return baseColors;

        const hour = new Date().getHours();
        const timeOfDay = getTimeOfDay(hour);
        const adjustment = timeAdjustments[timeOfDay];

        // Only adjust certain colors for visual effect
        return {
            ...baseColors,
            background: adjustColor(baseColors.background, adjustment),
            surface: adjustColor(baseColors.surface, adjustment),
            surfaceLight: adjustColor(baseColors.surfaceLight, adjustment),
            focus: adjustColor(baseColors.focus, adjustment),
            shortBreak: adjustColor(baseColors.shortBreak, adjustment),
            longBreak: adjustColor(baseColors.longBreak, adjustment),
        };
    }, [baseColors, enabled]);
}

export function getTimeOfDayLabel(): string {
    const hour = new Date().getHours();
    const timeOfDay = getTimeOfDay(hour);

    switch (timeOfDay) {
        case 'morning': return '🌅 Good morning';
        case 'afternoon': return '☀️ Good afternoon';
        case 'evening': return '🌆 Good evening';
        case 'night': return '🌙 Good night';
    }
}
