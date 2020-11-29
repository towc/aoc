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

const processInput = input => {
  const arr = input.trim().split(',').map(Number)
  const obj = {};

  arr.forEach((v, i) => obj[i] = v);

  return obj;
}

const codeToArgNum = {
  1: 3,
  2: 3,
  3: 1,
  4: 1,

  5: 2,
  6: 2,
  7: 3,
  8: 3,

  9: 1,

  99: 0,
};

const runCode = (state, minputs) => {
  let { ns, i = 0, relativeBase = 0 } = state;

  const out = [];

  let exited = false;

  let sec = 1000000000;
  while (--sec > 0) {
    const s = ns[i].toString().split('');

    const code = Number(s.splice(-2).join(''));
    const paramNum = codeToArgNum[code];

    while (s.length < paramNum) {
      s.unshift(0);
    }

    const modeNums = s.map(Number);
    const modes = modeNums.map(Number).reverse();

    const codeparams = modes.map((_, o) => ns[i + o + 1]);

    const params = modes.map((mode, offset) => {
      const v = codeparams[offset];

      if (offset === modes.length - 1 && ![5, 6, 9].includes(code)) {
        return mode === 2 ? relativeBase + v : v;
      }

      return mode === 0 ? ns[v]
        : mode === 1 ? v
          : mode === 2 && ns[relativeBase + v];
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
      const v = modes[0] === 0 ? ns[res]
            : modes[0] === 1 ? res
            : ns[res];
      out.push(v);
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
    } else if (code === 9) {
      const [a] = params;
      relativeBase += a;
    } else if (code === 99) {
      exited = true;
      break;
    } else {
      throw `unknown code ${code}`;
    }

    i += paramNum + 1;
  }

  state.i = i;
  state.relativeBase = relativeBase;

  return { exited, out, lastOut: out[out.length - 1] };
};

const sol1 = (input) => {
  return runCode({ ns: processInput(input)}, [1]).lastOut;
};

const sol2 = (input) => {
  return runCode({ ns: processInput(input) }, [2]).lastOut;
};

const samples1 = [
  //['109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99', 'huh'], this never ends
  ['1102,34915192,34915192,7,4,7,99,0', '16-digit num'],
  ['104,1125899906842624,99', 1125899906842624],
];
const samples2 = [
];

//test(sol1, samples1);
console.log(sol1(aocInput));

//test(sol2, samples2);
console.log(sol2(aocInput));
