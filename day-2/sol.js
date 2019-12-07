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
      console.log();
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
};
// }}}

const processInput = input => input.trim().split(',').map(Number);

const sol1 = (input, real=true, d1=12, d2=2) => {
  const ds = processInput(input);

  if (real) {
    ds[1] = d1;
    ds[2] = d2;
  }

  let sec = 10000;
  let i = 0;
  while (--sec > 0) {
    const v = ds[i];

    if (v === 1) {
      const [a, b, res] = [ds[i + 1], ds[i + 2], ds[i + 3]];
      ds[res] = ds[a] + ds[b];
      i += 4;
    } else if (v === 2) {
      const [a, b, res] = [ds[i + 1], ds[i + 2], ds[i + 3]];
      ds[res] = ds[a] * ds[b];
      i += 4;
    } else if (v === 99) {
      break;
    }
  }

  return ds[0];
};

const sol2 = (input) => {
  for(let i = 0; i < 99; ++i) {
    for(let j = 0; j < 99; ++j) {
      if(sol1(input, true, i, j) === 19690720) {
        return i * 100 + j;
      }
    }
  }
};

const samples1 = [
  ['1,9,10,3,2,3,11,0,99,30,40,50', 3500],
  ['1,0,0,0,99', 2],
  ['2,3,0,3,99', 2],
  ['2,4,4,5,99,0', 2],
  ['1,1,1,4,99,5,6,0,99', 30],
];
const samples2 = [
  [],
];

//test(sol1, samples1);
console.log(sol1(aocInput));

// test (sol2, samples2);
console.log(sol2(aocInput));
