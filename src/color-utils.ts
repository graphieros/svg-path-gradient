// color-utils.ts
// Browser-only utilities: accept (almost) any CSS color format and return RGBA.

export type RgbaColor = {
    red: number;
    green: number;
    blue: number;
    alpha: number;
};

const SharedCanvas = {
    canvas: null as HTMLCanvasElement | null,
    ctx: null as CanvasRenderingContext2D | null,
};

function getShared2dContext(): CanvasRenderingContext2D {
    if (typeof document === "undefined") {
        throw new Error("color-utils: document is not available (browser-only).");
    }

    if (!SharedCanvas.canvas) {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("color-utils: unable to get 2D canvas context.");
        }

        SharedCanvas.canvas = canvas;
        SharedCanvas.ctx = ctx;
    }

    return SharedCanvas.ctx!;
}

function clampByte(value: number): number {
    if (value < 0) return 0;
    if (value > 255) return 255;
    return Math.round(value);
}

function clampUnit(value: number): number {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
}

/**
 * Convert any CSS color string to RGBA using the browser color parser.
 */
export function colorToRgba(inputColor: string, referenceElement?: Element | null): RgbaColor {
    if (typeof inputColor !== "string" || inputColor.trim().length === 0) {
        throw new Error("colorToRgba: inputColor must be a non-empty string.");
    }

    const trimmed = inputColor.trim();

    if (trimmed.toLowerCase() === "transparent") {
        return { red: 0, green: 0, blue: 0, alpha: 0 };
    }

    const resolvedColor = resolveCurrentColorIfNeeded(trimmed, referenceElement);

    const ctx = getShared2dContext();

    ctx.clearRect(0, 0, 1, 1);

    ctx.fillStyle = "#000";
    const before = ctx.fillStyle;

    ctx.fillStyle = resolvedColor;
    const after = ctx.fillStyle;

    if (after === before && !isColorLikelyBlack(resolvedColor)) {
        throw new Error(`colorToRgba: unsupported or invalid color "${inputColor}".`);
    }

    ctx.fillRect(0, 0, 1, 1);
    const pixel = ctx.getImageData(0, 0, 1, 1).data;

    return {
        red: pixel[0],
        green: pixel[1],
        blue: pixel[2],
        alpha: pixel[3] / 255,
    };
}

export function colorsToRgba(colors: string[], referenceElement?: Element | null): RgbaColor[] {
    if (!Array.isArray(colors) || colors.length === 0) {
        throw new Error("colorsToRgba: colors must be a non-empty array.");
    }

    const output: RgbaColor[] = new Array(colors.length);
    for (let i = 0; i < colors.length; i += 1) {
        output[i] = colorToRgba(colors[i], referenceElement);
    }
    return output;
}

export function rgbaToCssRgba(color: RgbaColor, alphaDecimals = 4): string {
    const alpha =
        Math.round(clampUnit(color.alpha) * Math.pow(10, alphaDecimals)) /
        Math.pow(10, alphaDecimals);

    return `rgba(${clampByte(color.red)}, ${clampByte(color.green)}, ${clampByte(color.blue)}, ${alpha})`;
}

export function rgbaToCss(color: RgbaColor, alphaDecimals = 4): string {
    if (color.alpha >= 1) {
        return `#${toTwoDigitHex(clampByte(color.red))}${toTwoDigitHex(clampByte(color.green))}${toTwoDigitHex(clampByte(color.blue))}`;
    }
    return rgbaToCssRgba(color, alphaDecimals);
}

function toTwoDigitHex(value: number): string {
    const hex = clampByte(value).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function resolveCurrentColorIfNeeded(inputColor: string, referenceElement?: Element | null): string {
    if (inputColor !== "currentColor") return inputColor;

    if (typeof window === "undefined" || !referenceElement) return inputColor;

    const computed = window.getComputedStyle(referenceElement);
    return computed.color || inputColor;
}

function isColorLikelyBlack(colorString: string): boolean {
    const c = colorString.trim().toLowerCase();
    return (
        c === "black" ||
        c === "#000" ||
        c === "#000000" ||
        c === "rgb(0, 0, 0)" ||
        c === "rgba(0, 0, 0, 1)" ||
        c === "rgba(0, 0, 0, 0)"
    );
}
