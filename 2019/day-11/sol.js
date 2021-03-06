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

const dirs = [
  {x: 1, y: 0},
  {x: 0, y: 1},
  {x: -1, y: 0},
  {x: 0, y: -1},
];

const toS = (c) => c.x + ':' + c.y;

const sol1 = (input) => {
  const state = { ns: processInput(input) };
  const whites = new Set();
  const allPainted = new Set();
  const robot = {x:0, y:0, dir: 3}

  let sec = 100000;
  while (--sec) {
    const space = toS(robot);
    const res = runCode(state, [Number(whites.has(space))]);

    const [color, turn] = res.out;

    allPainted.add(space);

    if (color) whites.add(space);
    else whites.delete(space);

    robot.dir += turn ? 1 : 3;
    robot.dir %= 4;

    robot.x += dirs[robot.dir].x;
    robot.y += dirs[robot.dir].y;

    if (res.exited) {
      break;
    }
  }

  return allPainted.size;
};

const sol2 = (input) => {
  const state = { ns: processInput(input) };
  const whites = new Set();
  const robot = {x:0, y:0, dir: 3}
  whites.add(toS(robot));

  let minx = 0;
  let maxx = 0;
  let miny = 0;
  let maxy = 0;

  let sec = 100000;
  while (--sec) {
    const space = toS(robot);
    const res = runCode(state, [Number(whites.has(space))]);

    const [color, turn] = res.out;

    if (color) whites.add(space);
    else whites.delete(space);

    minx = Math.min(minx, robot.x);
    miny = Math.min(miny, robot.y);
    maxx = Math.max(maxx, robot.x);
    maxy = Math.max(maxy, robot.y);

    robot.dir += turn ? 1 : 3;
    robot.dir %= 4;

    robot.x += dirs[robot.dir].x;
    robot.y += dirs[robot.dir].y;

    if (res.exited) {
      break;
    }
  }

  const tiles = Array(maxy - miny + 1).fill().map(() => Array(maxx - minx + 1).fill(0));

  for(const tile of whites) {
    const [x, y] = tile.split(':').map(Number);

    tiles[y - miny][x - minx] = 1;
  }

  return tiles.map((r) => r.map(c => c ? '#' : ' ').join('')).join('\n');
};

const samples1 = [
];
const samples2 = [
];

// 9931 too high
//test(sol1, samples1);
console.log(sol1(aocInput));


//test(sol2, samples2);
console.log(sol2(aocInput));
