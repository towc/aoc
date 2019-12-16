// setup {{{
let aocInput;
{
  const fs = require('fs');
  aocInput = fs.readFileSync('input', 'utf-8');
}
const test = (fn, samples) => {
  for (const i in samples) {
    const expectedResult = samples[i].pop();
    const args = samples[i];
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
};
// }}}

const processInput = input => input.trim().split('').map(Number);

const runPhases = (input, times) => {
  const pattern = [0, 1, 0, -1];

  const orig = [...input];

  let zerosSkipped = 0;

  for(let i = 0; i < times; ++i) {
    const n = [...input];
    let nonZero = false;
    input = [];

    let pZerosSkipped = zerosSkipped;
    for(let j = zerosSkipped; j < orig.length; ++j) {

      let res = 0;
      for(let k = pZerosSkipped; k < orig.length; ++k) {
        const coeff = pattern[Math.floor((k+1)/(j+1)) % pattern.length];
        const num = n[k - pZerosSkipped];

        res += coeff * num;
      }

      const out = Math.abs(res) % 10;
      //console.log({ i, j, zerosSkipped, out })

      if (out === 0 && !nonZero) {
        console.log({ i, j, res, nonZero, pZerosSkipped, l: orig.length })
        zerosSkipped++;
        continue;
      }

      nonZero = true;
      input.push(out);
    }
  }

  return '0'.repeat(zerosSkipped) + input.join('');
}

const sol1 = (input) => {
  return runPhases(processInput(input), 100)//.substring(0,8);
}

const sol2 = (input) => {
  
}

const samples1 = [
  ['80871224585914546619083218645595', '24176176'],
  ['19617804207202209144916044189917', '73745418'],
  ['69317163492948606335995924319873', '52432133'],
];
const samples2 = [
]

test(runPhases, [['12345678', 4, '01029498']])

test(sol1, samples1);
//console.log(sol1(aocInput));

//test(sol2, samples2);
//console.log(sol2(aocInput));
