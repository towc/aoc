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

const processInput = input => input.trim().split('\n').map(l => l.trim()).map(l => {
  l = l.split('');

  // get rid of <>
  l.shift();
  l.pop()

  l = l.join('');

  const res = { vx: 0, vy: 0, vz: 0 };
  l.split(',').map(vs => vs.trim().split('=').map(p => p.trim())).forEach(([key, val]) => res[key] = Number(val));

  return res;
})

const step = ms => {
  for(let i = 0; i < ms.length - 1; ++i) {
    const am = ms[i];

    for(let j = i + 1; j < ms.length; ++j) {
      const bm = ms[j];

      const x = am.x < bm.x ? 1 : -1;
      const y = am.y < bm.y ? 1 : -1;
      const z = am.z < bm.z ? 1 : -1;

      if (am.x !== bm.x) {
        am.vx += x;
        bm.vx -= x;
      }

      if (am.y !== bm.y) {
        am.vy += y;
        bm.vy -= y;
      }

      if (am.z !== bm.z) {
        am.vz += z;
        bm.vz -= z;
      }
    }
  }

  for(const m of ms) {
    m.x += m.vx;
    m.y += m.vy;
    m.z += m.vz;
  }

  return ms;
}

const energy = ms => {
  let total = 0;
  for(const m of ms) {
    const pot = Math.abs(m.x) + Math.abs(m.y) + Math.abs(m.z);
    const kin = Math.abs(m.vx) + Math.abs(m.vy) + Math.abs(m.vz);

    total += pot * kin;
  }

  return total;
}

const sol1 = (input, steps) => {
  const ms = processInput(input);

  for(let i = 0; i < steps; ++i) {
    step(ms);
  }

  return energy(ms);
};

const repeated = ms => {
  for(const m of ms) {
    if (m.vx !== 0 || m.vy !== 0 || m.vz !== 0) {
      return false;
    }
  }

  return true;
}

const log = (i, ms) => {
  let res = [];
  for(const {x,y,z,vx,vy,vz} of ms) {
    const p = [x, y, z].map(n => n.toString().padStart(3, ' '));
    const v = [vx, vy, vz].map(n => n.toString().padStart(3, ' '));
    res.push(p.join(' :') + '  @' + v.join(' :'));
  }
  console.log(i, res.join(' ||| '));
}

const sol2 = (input) => {
  const ms = processInput(input);
  const caches = ms.map(() => new Map());

  let steps = 0;
  
  do {
    ms.forEach((m, i) => {
      const c = caches[i];
      const s = [m.x, m.y, m.z, m.vx, m.vy, m.vz].map(n => (Math.sign(n) > 0 ? '+' : '-') + Math.abs(n)).join('')

      if (c.has(s)) {
        console.log(steps, 'from ' + c.get(s) + ' already found state ' + s + ' at index ' + i);
      } else {
        c.set(s, steps);
      }
    })

    step(ms);
    ++steps;

    //log(steps, ms);

    //if (steps % 1000000 === 0) {
    //  console.log(steps)
    //}
    //} while(!repeated(ms));
  } while (steps <= 27000072)

  return steps * 2;
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
  //  [`
  //<x=-1, y=0, z=2>  
  //<x=2, y=-10, z=-7>
  //<x=4, y=-8, z=8>  
  //<x=3, y=5, z=-1>  `, 2772],
  [`
<x=-8, y=-10, z=0>
<x=5, y=5, z=10>  
<x=2, y=-7, z=3>  
<x=9, y=-8, z=-3> `, 4686774924],
];

//test(sol1, samples1);
//console.log(sol1(aocInput, 1000));

test(sol2, samples2);
//console.log(sol2(aocInput))
