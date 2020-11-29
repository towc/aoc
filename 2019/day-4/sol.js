/* eslint-disable no-labels, no-restricted-syntax, no-plusplus, no-continue */
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
};
// }}}


const processInput = input => input.trim().split('-').map(Number);

const sol1 = (input) => {
  const [min, max] = processInput(input);

  let count = 0;

  let i = min;
  let sec = 1000000;
  passes: while (i < max && --sec) {
    const s = i.toString();

    let hasDouble = false;
    let prev = s[0];

    for (let j = 1; j < 6; ++j) {
      const cur = s[j];

      if (cur < prev) {
        i += 10 ** (6 - j - 1);
        continue passes;
      }

      if (cur === prev) hasDouble = true;

      prev = cur;
    }

    if (hasDouble) ++count;
    ++i;
  }

  return count;
};

const sol2 = (input) => {
  const [min, max] = processInput(input);

  let count = 0;

  let i = min;
  let sec = 1000000;
  passes: while (i < max && --sec) {
    const s = i.toString();

    let hadDouble = false;
    let hasDouble = false;
    let preprev = null;
    let prev = s[0];

    for (let j = 1; j < 6; ++j) {
      const cur = s[j];

      if (cur < prev) {
        i += 10 ** (6 - j - 1);
        continue passes;
      }

      if (cur === prev) {
        hasDouble = true;
        if (prev === preprev) {
          hasDouble = false;
        }
      }

      if ((cur !== prev || j === 5) && hasDouble) {
        hadDouble = true;
      }

      preprev = prev;
      prev = cur;
    }

    if (hadDouble) ++count;
    ++i;
  }

  return count;
};

const samples1 = [
  [''],
];
const samples2 = [
  [''],
];

// test(sol1, samples1);
// console.log(sol1(aocInput));

// test (sol2, samples2);
console.log(sol2(aocInput));
