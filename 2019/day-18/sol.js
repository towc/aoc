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

const fromEntries = (entries=[]) => {
  const obj = {};
  entries.forEach(([k, v]) => obj[k] = v);
  return obj;
}

const processInput = (input) => {
  const keys = {};
  const doors = {};
  const bot = {};
  const grid = input.trim().split('\n').map((l, y) => l.trim().split('').map((c, x) => {
    if (c === '#') { return { passable: false, c }; }
    if (c === '.') { return { passable: true, c }; }
    if (c === '@') {
      bot.x = x;
      bot.y = y;
      return { passable: true, c };
    }

    if (c === c.toLowerCase()) {
      keys[c] = {x, y, c};
      return { passable: true, isKey: true, c };
    }

    if (c === c.toUpperCase()) {
      doors[c] = {x, y, c}
      return { passable: false, isDoor: true, c };
    }
  }));

  return {
    keys, doors, bot, grid,
  };
};
const cloneState = (state) => {
  return {
    keys: fromEntries(Object.entries(state.keys).map(([k,v]) => [k, {...v}])),
    doors: fromEntries(Object.entries(state.doors).map(([k,v]) => [k, {...v}])),
    grid: state.grid.map(l => l.map(c => ({...c}))),
    bot: {...state.bot}
  };
}

const exploreAvailable = (state) => {
  
}

const sol1 = (input) => {
  const state = processInput(input);
};

const sol2 = (input) => {

};

const samples1 = [
  [`
#########
#b.A.@.a#
#########`, 8],
  [`
########################
#f.D.E.e.C.b.A.@.a.B.c.#
######################.#
#d.....................#
########################`, 86],
  [`
########################
#...............b.C.D.f#
#.######################
#.....@.a.B.c.d.A.e.F.g#
########################`, 132],
  [`
#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`, 136],
  [`
########################
#@..............ac.GI.b#
###d#e#f################
###A#B#C################
###g#h#i################
########################`, 81],
];
const samples2 = [
  [''],
];

test(sol1, samples1);
console.log(sol1(aocInput));

// test(sol2, samples2);
// console.log(sol2(aocInput));
