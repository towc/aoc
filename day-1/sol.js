// setup {{{
let aocInput;
{
  const fs = require('fs');
  aocInput = fs.readFileSync('input', 'utf-8');
}
// }}}

const processInput = input => input.trim().split('\n').map(Number);

const fuel = mass => Math.floor(mass / 3) - 2;
const fuel2 = mass => fuel(mass) + fuel2r(fuel(mass));
const fuel2r = m => (m > 6 ? fuel(m) + fuel2r(fuel(m)) : 0);

const sol = input => processInput(input).reduce((acc, m) => acc + fuel(m), 0);

const sol2 = (input) => processInput(input).reduce((acc, m) => acc + fuel2(m), 0);

const test = (fn) => {
  const samples = [
    [['12'], 2],
    [['14'], 2],
    [['1969'], 654],
    [['100756'], 33583],
  ];

  // {{{ test body
  for (const i in samples) {
    const [args, expectedResult] = samples[i];
    const actualResult = fn(...args);

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
  // }}}
};

const test2 = (fn) => {
  const samples = [
    [['12'], 2],
    [['14'], 2],
    [['1969'], 966],
    [['100756'], 50346],
  ];

  // {{{ test body
  for (const i in samples) {
    const [args, expectedResult] = samples[i];
    const actualResult = fn(...args);

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
  // }}}
};

// test(sol)


console.log(sol(aocInput));

//test2(sol2)

console.log(sol2(aocInput))
