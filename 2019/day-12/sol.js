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

const processInput = input => input.trim().split('\n').map(l => l.trim()).map((l) => {
  l = l.split('');

  // get rid of <>
  l.shift();
  l.pop();

  l = l.join('');

  const res = { vx: 0, vy: 0, vz: 0 };
  l.split(',').map(vs => vs.trim().split('=').map(p => p.trim())).forEach(([key, val]) => res[key] = Number(val));

  return res;
});

const stepAxis = (ms, axis) => {
  for (let i = 0; i < ms.length - 1; ++i) {
    const am = ms[i];

    for (let j = i + 1; j < ms.length; ++j) {
      const bm = ms[j];

      const v = am[axis] < bm[axis] ? 1 : -1;

      if (am[axis] !== bm[axis]) {
        am[`v${axis}`] += v;
        bm[`v${axis}`] -= v;
      }
    }
  }

  for (const m of ms) {
    m[axis] += m[`v${axis}`];
  }

  return ms;
};

const step = (ms) => {
  stepAxis(ms, 'x');
  stepAxis(ms, 'y');
  stepAxis(ms, 'z');

  return ms;
};

const energy = (ms) => {
  let total = 0;
  for (const m of ms) {
    const pot = Math.abs(m.x) + Math.abs(m.y) + Math.abs(m.z);
    const kin = Math.abs(m.vx) + Math.abs(m.vy) + Math.abs(m.vz);

    total += pot * kin;
  }

  return total;
};

const sol1 = (input, steps) => {
  const ms = processInput(input);

  for (let i = 0; i < steps; ++i) {
    step(ms);
  }

  return energy(ms);
};

const getPeriod = (ms, axis) => {
  let count = 0;
  const xs = ms.map(m => m[axis]);
  const ixs = [...xs];

  const vxs = ms.map(() => 0);

  do {
    ++count;
    for(let i = 0; i < xs.length - 1; ++i) {
      const ax = xs[i];
      for(let j = i + 1; j < xs.length; ++j) {
        const bx = xs[j];

        const vx = ax < bx ? 1 : -1;

        if (ax !== bx) {
          vxs[i] += vx;
          vxs[j] -= vx;
        }
      }
    }

    for(let i = 0; i < xs.length; ++i) {
      xs[i] += vxs[i];
    }
  } while(xs.some((x, i) => ixs[i] !== x) || vxs.some(vx => vx !== 0));

  return count;
}

// simple lcm implementation, can take a few minutes
const lcm = (...args) => {
  const max = Math.max(...args);
  args.splice(args.indexOf(max), 1);

  let res = max;
  while(args.some(x => (res % x) !== 0)) {
    res += max;
  }

  return res;
}

const sol2 = (input) => {
  const ms = processInput(input);

  const periods = {
    x: getPeriod(ms, 'x'),
    y: getPeriod(ms, 'y'),
    z: getPeriod(ms, 'z'),
  };

  return lcm(periods.x, periods.y, periods.z);
};

const samples1 = [
  [`
<x=-1, y=0, z=2>  
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>  
<x=3, y=5, z=-1>  `, 10, 179],
  [`
<x=-8, y=-10, z=0>
<x=5, y=5, z=10>  
<x=2, y=-7, z=3>  
<x=9, y=-8, z=-3> `, 100, 1940],

];
const samples2 = [
  [`
<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>  `, 2772],
  [`
<x=-8, y=-10, z=0>
<x=5, y=5, z=10>  
<x=2, y=-7, z=3>  
<x=9, y=-8, z=-3> `, 4686774924],
];

// test(sol1, samples1);
console.log(sol1(aocInput, 1000));

//test(sol2, samples2);
console.log(sol2(aocInput))
