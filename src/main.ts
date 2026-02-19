import { SvgPathGradient } from '../dist/svg-path-gradient';

const spline = `
  M 50 250
  C 150 50, 350 50, 450 250
  S 750 450, 850 250
`;

const path = `
M 50 250
L 120 200
L 200 230
L 300 140
L 380 260
L 470 110
L 560 190
L 650 150
L 740 240
L 850 130
`;

// String mode

const splineGradientPath = SvgPathGradient(
  spline,
  ['#FF0000', '#00ff88', '#0066ff'],
  {
    strokeWidth: 1,
    segments: 12,
    attrs: {
      'stroke-width': '12',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    },
    groupAttrs: { id: 'spline' }
  }
);

const straightGradientPath = SvgPathGradient(
  path,
  ['#ff0000', '#00ff88', '#0066ff'],
  {
    strokeWidth: 1,
    attrs: {
      'stroke-width': '12',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    },
    groupAttrs: { id: 'straight' }
  }
);

// DOM mode
// @ts-ignore
const splineDom = SvgPathGradient(
  spline,
  ['#FF000080', '#00ff88', '#0066ff'],
  {
    returnMode: 'dom',
    strokeWidth: 1,
    segments: 12,
    attrs: {
      'stroke-width': '12',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    },
    groupAttrs: { id: 'spline-dom' }
  }
) as { group: SVGGElement };

// @ts-ignore
const straightDom = SvgPathGradient(
  path,
  ['#ff0000', '#00ff88', '#0066ff'],
  {
    returnMode: 'dom',
    strokeWidth: 1,
    attrs: {
      'stroke-width': '12',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    },
    groupAttrs: { id: 'straight-dom' }
  }
) as { group: SVGGElement };

const splineTemperatureVertical = SvgPathGradient(
  path,
  null,
  {
    strokeWidth: 1,
    // segments: 24,
    temperatureMode: 'vertical',
    temperatureColors: ['#00ff00', '#ff0000'],
    attrs: {
      'stroke-width': '12',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    },
    groupAttrs: { id: 'spline-temperature-vertical' }
  }
);

const straightTemperatureHorizontal = SvgPathGradient(
  path,
  null,
  {
    strokeWidth: 1,
    // segments: 24,
    temperatureMode: 'horizontal',
    temperatureColors: ['#00ff00', '#ff0000'],
    attrs: {
      'stroke-width': '12',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    },
    groupAttrs: { id: 'straight-temperature-horizontal' }
  }
);


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="container">
  <svg
    id="svg-string"
    width="100%"
    viewBox="0 0 900 500"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${splineGradientPath}
  </svg>

  <svg
    id="svg-string-2"
    width="100%"
    viewBox="0 0 900 500"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${straightGradientPath}
  </svg>


    <svg
    id="svg-string-3"
    width="100%"
    viewBox="0 0 900 500"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${splineTemperatureVertical}
  </svg>

  <svg
    id="svg-string-4"
    width="100%"
    viewBox="0 0 900 500"
    xmlns="http://www.w3.org/2000/svg"
  >
    ${straightTemperatureHorizontal}
  </svg>

    <svg
    id="svg-dom-3"
    width="100%"
    viewBox="0 0 900 500"
    xmlns="http://www.w3.org/2000/svg"
  ></svg>

  <svg
    id="svg-dom-4"
    width="100%"
    viewBox="0 0 900 500"
    xmlns="http://www.w3.org/2000/svg"
  ></svg>


</div>
`;

/* Append DOM-based groups safely (no innerHTML parsing) */

// setTimeout(() => {
//   document.getElementById('svg-dom')!.appendChild(splineDom.group);
//   document.getElementById('svg-dom-2')!.appendChild(straightDom.group);
// })