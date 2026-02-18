# svg-path-gradient

Create beautiful, flowing stroke gradients that follow your SVG paths.
svg-path-gradient is an open-source library without dependency to create gradient paths in seconds.

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/svg-path-gradient)](https://npmx.dev/svg-path-gradient)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/graphieros/svg-path-gradient?tab=MIT-1-ov-file#readme)
[![GitHub issues](https://img.shields.io/github/issues/graphieros/svg-path-gradient)](https://github.com/graphieros/svg-path-gradient/issues)
[![GitHub Repo stars](https://img.shields.io/github/stars/graphieros/svg-path-gradient)](https://github.com/graphieros/svg-path-gradient)

## Installation

```bash
npm install svg-path-gradient
```

```bash
pnpm add svg-path-gradient
```

```bash
yarn add svg-path-gradient
```

```bash
bun add svg-path-gradient
```

```bash
deno add npm:svg-path-gradient
```

## Usage

```js
import { SvgPathGradient } from "svg-path-gradient";

const splinePath = "M 50 250 C 150 50, 350 50, 450 250 S 750 450, 850 250";

const gradientPath = SvgPathGradient(
  splinePath,
  ["#FF0000", "#00ff88", "#0066ff"],
  {
    segments: 48,
    attrs: {
      "stroke-width": "12",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    },
    groupAttrs: { id: "spline-path" },
  },
);

/*
 * gradientPath can now be injected inside a svg group element.
 * In vue, this would be for example:
 *
 *   <svg width="100%" viewBox="0 0 1000 1000">
 *       <g v-html="gradientPath"/>
 *   </svg>
 */
```

## API

### Function signature

| KEY      | TYPE                        | DEFAULT | DESCRIPTION                                                                                                              |
| -------- | --------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| pathData | `string`                    | -       | SVG path "d" string. Must be a non-empty string. Throws if empty or not a string.                                        |
| colors   | `string[]`                  | -       | Array of gradient stop colors, evenly distributed from 0 → 1. Any CSS color format supported by the browser is accepted. |
| options  | `GradientStrokePathOptions` | `{}`    | Configuration object controlling segmentation, sampling, interpolation, attributes, and return mode.                     |

### Options

| KEY                        | TYPE                     | DEFAULT             | DESCRIPTION                                                                                                                                                                   |
| -------------------------- | ------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| returnMode                 | `"string" or "dom"`      | `"string"`          | Output format: SVG markup string or DOM nodes you can append to an <svg>. DOM mode returns: { group, segments, startCap?, endCap? }.                                          |
| segments                   | `number`                 | (computed)          | Fixed number of segments to generate. If omitted, derived from maxSegmentLength. Go easy if you care about DOM nodes count                                                    |
| maxSegmentLength           | `number`                 | (heuristic)         | Maximum arc-length of each segment (user units). Used only if segments is not provided. Heuristic is based on stroke width, clamped, and never exceeds half the total length. |
| flattenTolerance           | `number`                 | `0.25`              | Sampling step (user units) when approximating each segment with a polyline. Lower values increase fidelity but increase CPU cost and output size.                             |
| samplePointLimitPerSegment | `number`                 | `250`               | Safety cap for maximum sampled points per segment. Must be > 10 to override.                                                                                                  |
| decimalPlaces              | `number`                 | `3`                 | Rounding precision for generated coordinates. Lower values reduce output size.                                                                                                |
| decimalPlaces              | `number`                 | `3`                 | Rounding precision for generated coordinates. Lower values reduce output size.                                                                                                |
| colorSpace                 | `"srgb" or "linearRGB"`  | `"linearRGB"`       | Color interpolation space used when sampling between stops. "linearRGB" gives smoother-looking gradients.                                                                     |
| overlap                    | `number`                 | `strokeWidth * 0.5` | Overlap (arc-length user units) applied at segment boundaries to reduce visible seams. Clamped to at most 45% of a base segment length.                                       |
| strokeWidth                | `number`                 | `1 (fallback)`      | Used only to compute defaults (overlap / maxSegmentLength) if not provided elsewhere. If attrs["stroke-width"] is present and valid, it can be used as a fallback.            |
| attrs                      | `Record<string, string>` | `{}`                | Attributes applied to each generated <path> segment. `stroke` is always overwritten per segment; `fill` defaults to "none" if not provided.                                   |
| groupAttrs                 | `Record<string, string>` | `{}`                | Attributes applied to the wrapping `<g> `element.                                                                                                                             |
| colorReferenceElement      | `Element or null`        | `undefined`         | Optional element used to resolve "currentColor" when converting colors to RGBA. Only relevant if your colors include currentColor.                                            |

### Return value

| KEY         | TYPE                                                                     | DESCRIPTION                                                                                     |
| ----------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| string mode | `string`                                                                 | Returns a <g data-svg-path-gradient="true">...</g> string containing many <path> segments.      |
| dom mode    | `{ group: SVGGElement; segments: SVGPathElement[]; startCap?; endCap? }` | Returns a group node containing the segment path nodes, ready to append into an existing <svg>. |
