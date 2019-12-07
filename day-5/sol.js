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

const processInput = input => input.trim().split(',').map(Number);

const codeToArgNum = {
  1: 3,
  2: 3,
  3: 1,
  4: 1,

  5: 2,
  6: 2,
  7: 3,
  8: 3,

  99: 0,
};

const sol1 = (input, minput = 1) => {
  const ns = [...processInput(input)];

  const out = [];

  let i = 0;
  let sec = 10000;
  while (--sec > 0) {
    const s = ns[i].toString().split('');

    const code = Number(s.splice(-2).join(''));
    const paramNum = codeToArgNum[code];

    while (s.length < paramNum) {
      s.unshift(0);
    }

    const modeNums = s.map(Number);
    if (modeNums.some(x => ![0, 1].includes(x))) {
      console.log({ i, s, code });
      throw 'bad mode';
    }
    const modes = modeNums.map(Boolean).reverse();

    const codeparams = modes.map((_, o) => ns[i + o + 1]);

    const params = modes.map((immediate, offset) => {
      const v = codeparams[offset];

      if (offset === modes.length - 1 && ![5, 6].includes(code)) {
        return v;
      }

      return immediate ? v : ns[v];
    });

    if (code === 1) {
      const [a, b, res] = params;
      ns[res] = a + b;
    } else if (code === 2) {
      const [a, b, res] = params;
      ns[res] = a * b;
    } else if (code === 3) {
      const [res] = params;
      ns[res] = minput;
    } else if (code === 4) {
      const [res] = params;
      out.push(modes[0] ? res : ns[res]);
    } else if (code === 5) {
      const [cond, res] = params;
      if (cond) {
        i = res;
        continue;
      }
    } else if (code === 6) {
      const [cond, res] = params;
      if (!cond) {
        i = res;
        continue;
      }
    } else if (code === 7) {
      const [a, b, res] = params;
      ns[res] = a < b ? 1 : 0;
    } else if (code === 8) {
      const [a, b, res] = params;
      ns[res] = a === b ? 1 : 0;
    } else if (code === 99) {
      break;
    } else {
      throw `unknown code ${code}`;
    }

    i += paramNum + 1;
  }

  return out[out.length - 1];
};

const sol2 = input => sol1(input, 5);

const samples1 = [
  ['3,0,4,0,99', [1]],
];
const samples2 = [
  ['3,9,8,9,10,9,4,9,99,-1,8', [0]],
  ['3,9,8,9,10,9,4,9,99,-1,5', [1]],
  ['3,9,7,9,10,9,4,9,99,-1,8', [1]],
  ['3,9,7,9,10,9,4,9,99,-1,3', [0]],
  ['3,3,1108,-1,8,3,4,3,99', [0]],
  ['3,3,1108,-1,5,3,4,3,99', [1]],
  ['3,3,1107,-1,8,3,4,3,99', [1]],
  ['3,3,1107,-1,5,3,4,3,99', [0]],

  ['3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9 ', [1]],
  ['3,3,1105,-1,9,1101,0,0,12,4,12,99,1', [1]],
  ['3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99', [999]],
];

// test(sol1, samples1);
console.log(sol1(aocInput));

//test(sol2, samples2);
console.log(sol2(aocInput));
