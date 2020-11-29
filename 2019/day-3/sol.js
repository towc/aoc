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

const processInput = input => input.trim().split('\n').map(line => line.split(',').map((op) => {
  const [dir, ...count] = op.split('');

  const dirs = {
    R: [1, 0],
    U: [0, -1],
    L: [-1, 0],
    D: [0, 1],
  };

  return ({
    dir: dirs[dir],
    count: Number(count.join('')),
  });
}));

const getMat = (wire) => {
  const m = new Map()

  let x = 0;
  let y = 0;
  let c = 0;
  for (const { dir, count } of wire) {
    for (let i = 0; i < count; ++i) {
      x += dir[0];
      y += dir[1];
      ++c;

      const k = `${x},${y}`;
      if (!m.has(k)) {
        m.set(k, c);
      }
    }
  }

  return m;
};

const sol1 = (input) => {
  const ws = processInput(input);

  const [m1, m2] = ws.map(getMat);

  const intersections = [...m1.keys()].filter(p => m2.has(p));
  const dists = intersections.map((s) => {
    
    const [a, b] = s.split(',').map(Number);

    return Math.abs(a) + Math.abs(b);
  });

  return Math.min(...dists)
};

const sol2 = (input) => {
  const ws = processInput(input);

  const [m1, m2] = ws.map(getMat);

  const intersections = [...m1.keys()].filter(p => m2.has(p));
  const dists = intersections.map((s) => {
    return m1.get(s) + m2.get(s);
  });

  return Math.min(...dists)
};

const samples1 = [
  [
    `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`, 159],
  [
    `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`, 135],
];
const samples2 = [
  [
    `R75,D30,R83,U83,L12,D49,R71,U7,L72
U62,R66,U55,R34,D71,R55,D58,R83`, 610],
  [
    `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`, 410],
];

//test(sol1, samples1);
console.log(sol1(aocInput));

//test(sol2, samples2);
console.log(sol2(aocInput));
