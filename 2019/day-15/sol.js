// setup {{{
/* eslint-disable no-restricted-syntax, guard-for-in */
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

const processInput = (input) => {
  const arr = input.trim().split(',').map(Number);
  const obj = {};

  arr.forEach((v, i) => obj[i] = v);

  return obj;
};

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
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];
const dirToCard = [4, 1, 3, 2];
const cardToDir = {
  1: 1,
  2: 3,
  3: 2,
  4: 0,
};

const toS = c => `${c.x}:${c.y}`;
const cloneState = s => ({ ...s, ns: { ...s.ns } });

const getPath = (state) => {
  const tiles = new Map([['0:0', 4]]);

  let minx = 0;
  let maxx = 0;
  let miny = 0;
  let maxy = 0;

  const rob = { x: 0, y: 0 };
  let sec = 1000000;
  let res = { exited: false };
  const stack = [{ tile: toS(rob), dir: 0, state: cloneState(state) }];

  const getInput = () => {
    const { x, y } = rob;
    const neighs = dirs
      .map(dir => ({
        dir,
        val: tiles.get(toS({ x: x + dir.x, y: y + dir.y })),
      }))
      .filter(({ val }) => val === undefined);

    // if nothing left to explore, try to get to last point in stack
    if (neighs.length === 0) {
      return 'backtrack';
    }

    return dirs.indexOf(neighs[0].dir);
  };

  while (!res.exited && --sec) {
    let input = getInput();
    while (input === 'backtrack') {
      const last = stack.pop();
      state = last.state;
      const [x, y] = last.tile.split(':').map(Number);
      rob.x = x;
      rob.y = y;
      input = getInput();
    }
    res = runCode(state, [dirToCard[input]]);

    const id = res.lastOut;

    const dir = dirs[input];

    if (id > 0) {
      rob.x += dir.x;
      rob.y += dir.y;

      stack.push({ tile: toS(rob), dir: input, state: cloneState(state) });
    }

    let { x, y } = rob;

    if (id === 0) {
      x += dir.x;
      y += dir.y;
    }

    const s = toS({ x, y });
    if (!(x === 0 && y === 0)) {
      tiles.set(s, id);
    }

    minx = Math.min(minx, x);
    miny = Math.min(miny, y);
    maxx = Math.max(maxx, x);
    maxy = Math.max(maxy, y);

    if (id === 2) {
      break;
    }
  }

  // tiles.exited = res.exited;

  // debug
  const grid = Array(maxy - miny + 1).fill().map(() => Array(maxx - minx + 1).fill(3));

  for (const [tile, id] of tiles.entries()) {
    const [x, y] = tile.split(':').map(Number);

    grid[y - miny][x - minx] = id;
  }

  const tilemap = ['#', '.', 'o', ' ', '@'];
  //console.log(grid.map(r => r.map(c => tilemap[c]).join('')).join('\n'));

  return { stack, oxygen: rob, state };
};


const sol1 = (input) => {
  const state = { ns: processInput(input) };

  const path = getPath(state).stack;

  return path.length + 1;
};


const sol2 = (input) => {
  const { state } = getPath({ ns: processInput(input) });

  const tiles = new Map([['0:0', 4]]);

  let minx = 0;
  let maxx = 0;
  let miny = 0;
  let maxy = 0;

  let rounds = 0;
  let sec = 10000;
  const toExplore = new Map([['0:0', cloneState(state)]]);

  while (toExplore.size > 0 && --sec) {
    ++rounds;
    const prevExplore = new Map(toExplore);
    toExplore.clear();
    for (const [tile, state] of prevExplore.entries()) {
      const [x, y] = tile.split(':').map(Number);
      const neighs = dirs
        .map((dir) => {
          const tile = toS({ x: x + dir.x, y: y + dir.y });
          return {
            dir,
            diri: dirs.indexOf(dir),
            tile,
            val: tiles.get(tile),
          };
        })
        .filter(({ val }) => val === undefined);

      for (const { diri, dir, tile } of neighs) {
        const nstate = cloneState(state);
        const res = runCode(nstate, [dirToCard[diri]]);

        const id = res.lastOut;

        let [x, y] = tile.split(':').map(Number);

        if (id > 0) {
          toExplore.set(toS({x, y}), nstate);
        }

        const s = toS({ x, y });
        if (!(x === 0 && y === 0)) {
          tiles.set(s, id);
        }

        minx = Math.min(minx, x);
        miny = Math.min(miny, y);
        maxx = Math.max(maxx, x);
        maxy = Math.max(maxy, y);

      }
    }

    //const grid = Array(maxy - miny + 1).fill().map(() => Array(maxx - minx + 1).fill(3));

    //for (const [tile, id] of tiles.entries()) {
    //  const [x, y] = tile.split(':').map(Number);

    //  grid[y - miny][x - minx] = id;
    //}

    //const tilemap = ['#', '.', 'o', ' ', '@'];
    //console.log(grid.map(r => r.map(c => tilemap[c]).join('')).join('\n'));
  }

  // -1 needed because the last explored thing is probably a wall
  // but not necessarily. If this doesn't work, add 1
  return rounds - 1;
};


const samples1 = [
];
const samples2 = [
];

// test(sol1, samples1);
console.log(sol1(aocInput));


// test(sol2, samples2);
// 351 too high
console.log(sol2(aocInput));
