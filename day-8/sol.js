// setup {{{
let aocInput;
{
  const fs = require('fs');
  aocInput = fs.readFileSync('input', 'utf-8');
}
const test = (fn, samples) => {
  for (const i in samples) {
    const [arg, expectedResult] = samples[i];
    const actualResult = fn(arg, false);

    const strExpected = JSON.stringify(expectedResult);
    const strActual = JSON.stringify(actualResult);

    if (strExpected === strActual) {
      console.log(`test ${i}: ok (${strActual})`);
    } else {
      console.log(`test ${i}: FAILED : expected v`);
      console.group();
      console.group();
      console.log(expectedResult);
      console.groupEnd();
      console.log('instead got v');
      console.group();
      console.log(actualResult);
      console.groupEnd();
      console.groupEnd();
    }
  }
}
// }}}

const w = 25;
const h = 6;

const processInput = input => {
  input = input.trim();

  const layers = input.length / (w*h);
  const layersize = input.length / layers;

  const res = [];

  for(let i = 0; i < layers; ++i) {
    const layer = [];

    for(let j = 0; j < h; ++j) {
      const row = [];

      for(let k = 0; k < w; ++k) {
        row.push(Number(input[i * layersize + j * w + k]));
      }

      layer.push(row);
    }

    res.push(layer)
  }

  return res;
}

const flattenLayer = (layer) => {
  return [].concat(...([].concat(...layer)));
}

const sol1 = (input) => {
  const layers = processInput(input)
  const flat = layers.map(flattenLayer);

  let min0 = Infinity;
  let min0i = -1;

  for(const i in flat) {
    const layer = flat[i];

    const c0 = layer.filter(c => c === 0).length;

    if (c0 < min0) {
      min0 = c0;
      min0i = i;
    }
  }

  const layer = flat[min0i];
  const c1 = layer.filter(c => c === 1).length;
  const c2 = layer.filter(c => c === 2).length;

  return c1 * c2;
}

const sol2 = (input) => {
  const layers = processInput(input);

  const res = layers[0];
  for(let i = 1; i < layers.length; ++i) {
    const layer = layers[i];

    for(let y = 0; y < h; ++y) {
      for(let x = 0; x < w; ++x) {
        const pv = res[y][x];

        if (pv === 2) {
          res[y][x] = layer[y][x];
        }
      }
    }
  }
  
  return res.map(l => l.map(c => [' ', 'X', '?'][c]).join('')).join('\n');
}

const samples1 = [
  ['', ]
];
const samples2 = [
  ['', ]
];

//test(sol1, samples1);
console.log(sol1(aocInput));

//test(sol2, samples2);
console.log(sol2(aocInput));
