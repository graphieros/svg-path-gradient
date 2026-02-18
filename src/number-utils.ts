export function clampNumber(value: number, minimum: number, maximum: number): number {
    let clamped = value;
    if (clamped < minimum) clamped = minimum;
    if (clamped > maximum) clamped = maximum;
    return clamped;
}

export function roundNumber(value: number, decimalPlaces: number): number {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(value * multiplier) / multiplier;
}

export function formatNumber(value: number): string {
    return Number.isFinite(value) ? value.toString() : "0";
}

export function toTwoDigitHex(value: number): string {
    const clamped = clampNumber(value, 0, 255);
    const hex = clamped.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export function parseOptionalNumber(value: string | undefined): number | undefined {
    if (typeof value !== "string") return undefined;
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}