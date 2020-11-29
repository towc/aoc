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

const processInput = input => input.trim().split('\n').map(l => l.trim().split('').map(c => c === '#'));

const getAsteroids = grid => {
  const asts = [];
  for(let y = 0; y < grid.length; ++y) {
    const row = grid[y];
    for(let x = 0; x < row.length; ++x) {
      if (row[x]) asts.push({ x, y, canSee: [] });
    }
  }

  return asts;
}

const intIfClose = x => (x % 1 < .001 || x % 1 > .999) ? Math.round(x) : x;

const canSee = (a, b, grid) => {
  if (a.x === b.x) {
    [a, b] = a.y < b.y ? [a, b] : [b, a];

    for(let y = a.y + 1; y < b.y; ++y) {
      if (grid[y][a.x]) {
        return false;
      }
    }

    return true;
  }

  [a, b] = a.x < b.x ? [a, b] : [b, a];

  const dx = b.x - a.x;
  const grad = (b.y - a.y) / dx;

  for(let x = 1; x < dx; ++x) {
    const y = a.y + x * grad;

    const rmy = y % 1;

    if (rmy < .0000001 || rmy > .9999999) {
      const ry = Math.round(y);

      if (grid[ry] && grid[ry][a.x + x]) {
        return false;
      }
    }
  }

  return true;
}

const getBestAsteroid = (grid, asts=getAsteroids(grid)) => {
  for(let i = 0; i < asts.length - 1; ++i) {
    const base = asts[i];
    for(let j = i + 1; j < asts.length; ++j) {
      const target = asts[j];
      if (canSee(base, target, grid)) {
        base.canSee.push(target);
        target.canSee.push(base);
      }
    }
  }

  let maxA = {canSee: []}
  for(const a of asts) {
    if (a.canSee.length < new Set(a.canSee).size) {
      console.log('duplicates in canSee')
    }
    //console.log(a.x + ':' + a.y + ' = (' + a.canSee.length + ') ' + a.canSee.map(b => b.x + ':' + b.y).join(', '))
    if(a.canSee.length > maxA.canSee.length) {
      maxA = a;
    }
  }

  return maxA;
}

const sol1 = (input) => {
  const grid = processInput(input);

  return getBestAsteroid(grid).canSee.length;
};

const sol2 = (input) => {
  const grid = processInput(input);
  const asts = getAsteroids(grid);

  const b = getBestAsteroid(grid, asts);

  const others = asts.filter(a => a !== b);

  const byRad = {};

  others.forEach(o => {
    const dx = o.x - b.x;
    const dy = o.y - b.y;

    o.rad = Math.atan(dy/dx) + Math.PI;

    if (dx < 0) o.rad += Math.PI;

    // chunkify, for equality comparison
    o.rad = Number(o.rad.toFixed(6));

    o.distSq = dx**2 + dy**2;

    if (!byRad[o.rad]) {
      byRad[o.rad] = [];
    }

    let i = 0;
    for(; i < byRad[o.rad].length; ++i) {
      const c = byRad[o.rad][i];

      if (o.distSq < c.distSq) {
        break;
      }
    }
    byRad[o.rad].splice(i, 0, o);
  });

  const rads = Object.keys(byRad).sort();
  for(let j = 0; j < rads.length; ++j) {
    const rad = rads[j];
    for(let i = 0; i < byRad[rad].length; ++i) {
      const o = byRad[rad][i]; 

      o.score = i * rads.length + j;
    }
  }

  const found = others.sort((a, b) => a.score - b.score)[199];

  return found.x * 100 + found.y;
};

const samples1 = [
  [`
.#..#
.....
#####
....#
...##`, 8],
    [`
  ......#.#.
  #..#.#....
  ..#######.
  .#.#.###..
  .#..#.....
  ..#....#.#
  #..#....#.
  .##.#..###
  ##...#..#.
  .#....####`, 33],
    [`
  #.#...#.#.
  .###....#.
  .#....#...
  ##.#.#.#.#
  ....#.#.#.
  .##..###.#
  ..#...##..
  ..##....##
  ......#...
  .####.###.`, 35],
    [`
  .#..#..###
  ####.###.#
  ....###.#.
  ..###.##.#
  ##.##.#.#.
  ....###..#
  ..#.#..#.#
  #..#.#.###
  .##...##.#
  .....#.#..`, 41],
    [`
  .#..##.###...#######
  ##.############..##.
  .#.######.########.#
  .###.#######.####.#.
  #####.##.#.##.###.##
  ..#####..#.#########
  ####################
  #.####....###.#.#.##
  ##.#################
  #####.##.###..####..
  ..######..##.#######
  ####.##.####...##..#
  .#####..#.######.###
  ##...#.##########...
  #.##########.#######
  .####.#.###.###.#.##
  ....##.##.###..#####
  .#.#.###########.###
  #.#.#.#####.####.###
  ###.##.####.##.#..##`, 210],
];
const samples2 = [
    [`
  .#..##.###...#######
  ##.############..##.
  .#.######.########.#
  .###.#######.####.#.
  #####.##.#.##.###.##
  ..#####..#.#########
  ####################
  #.####....###.#.#.##
  ##.#################
  #####.##.###..####..
  ..######..##.#######
  ####.##.####...##..#
  .#####..#.######.###
  ##...#.##########...
  #.##########.#######
  .####.#.###.###.#.##
  ....##.##.###..#####
  .#.#.###########.###
  #.#.#.#####.####.###
  ###.##.####.##.#..##`, 802],
];

//test(sol1, samples1);
console.log(sol1(aocInput));

//test(sol2, samples2);
console.log(sol2(aocInput));
