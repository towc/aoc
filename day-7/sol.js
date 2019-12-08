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

const runCode = (state, minputs) => {
  let { ns, i } = state;

  const out = [];

  let exited = false;

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
      if (minputs.length === 0) {
        break;
      }
      const [res] = params;
      ns[res] = minputs.shift();
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
      exited = true;
      break;
    } else {
      throw `unknown code ${code}`;
    }

    i += paramNum + 1;
  }

  state.i = i;

  return { exited, lastOut: out[out.length - 1] };
};

const combs = (max = 5, base = 0) => {
  const acc = [];
  combsr(acc, [], new Set(Array(max).fill().map((_, i) => i + base)));
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
  const accs = 5;

  let max = -Infinity;
  for (const comb of combs(accs)) {
    const nss = Array(accs).fill().map(() => ({ ns: processInput(input), i: 0 }));

    let out = 0;

    for (let i = 0; i < accs; ++i) {
      out = runCode(nss[i], [comb[i], out]).lastOut;
    }

    if (out > max) {
      max = out;
    }
  }

  return max;
};

const sol2 = (input) => {
  const accs = 5;

  let max = -Infinity;
  for (const comb of combs(accs, accs)) {
    const nss = Array(accs).fill().map(() => ({ ns: processInput(input), i: 0 }));

    let out = 0;

    for (let i = 0; i < accs; ++i) {
      out = runCode(nss[i], [comb[i], out]).lastOut;
    }

    let sec = 1000;
    wireloop: while (--sec > 0) {
      for (let i = 0; i < accs; ++i) {
        const res = runCode(nss[i], [out])
        out = res.lastOut;

        if (res.exited && i === accs - 1) {
          break wireloop;
        }
      }
    }

    if (out > max) {
      max = out;
    }
  }

  return max;
};

const samples1 = [
  ['3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', 43210],
  ['3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0', 54321],
  ['3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0', 65210],
];
const samples2 = [
  ['3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5', 139629729],
  ['3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10', 18216],
];

// test(sol1, samples1);
console.log(sol1(aocInput));

//test(sol2, samples2);
console.log(sol2(aocInput));
