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

const runCode = (ns, minputs) => {
  ns = [...ns];

  let minputCounter = 0;

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
      ns[res] = minputs[minputCounter];
      ++minputCounter;
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

const combs = (max = 5) => {
  const acc = [];
  combsr(acc, [], new Set(Array(max).fill().map((_, i) => i)));
  return acc;
};
const combsr = (acc, path, canPick) => {
  if (canPick.size === 1) {
    acc.push([...path, canPick.values().next().value]);
  }

  for (const d of canPick) {
    const s = new Set(canPick);
    s.delete(d);
    combsr(acc, [...path, d], s);
  }
};

const sol1 = (input) => {
  const ns = processInput(input);

  let max = -Infinity;
  for (const comb of combs(5)) {
    let out = 0;
    out = runCode(ns, [comb[0], out]);
    out = runCode(ns, [comb[1], out]);
    out = runCode(ns, [comb[2], out]);
    out = runCode(ns, [comb[3], out]);
    out = runCode(ns, [comb[4], out]);

    if (out > max) {
      max = out;
    }
  }

  return max;
};

const sol2 = input => sol1(input, 5);

const samples1 = [
  ['3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', 43210],
  ['3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0', 54321],
  ['3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0', 65210],
];
const samples2 = [
];

//test(sol1, samples1);
console.log(sol1(aocInput));

// test(sol2, samples2);
// console.log(sol2(aocInput));
