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
}
// }}}

const processInput = input => input.trim().split('\n').map(l => l.trim()).map((l => l.split(')')));

const genMap = (pairs) => {
  const map = {};

  for(const [a, b] of pairs) {
    if (!map[a]) map[a] = [];

    map[a].push(b);
  }

  return map;
}

const getCount = (map, start, depth=0) => {
  let count = depth;

  if (map[start]) {
    for(const b of map[start]) {
      count += getCount(map, b, depth+1);
    }
  }

  return count;
}

const getPath = (pairs, start, path=[]) => {
  const prev = pairs.find(([a, b]) => b === start)[0];

  if (prev === 'COM') return path;

  return getPath(pairs, prev, [prev, ...path]);
}

const sol1 = (input) => {
  const map = genMap(processInput(input));

  return getCount(map, 'COM');
}

const sol2 = (input) => {
  const pairs = processInput(input);

  const ypath = getPath(pairs, 'YOU');
  const spath = getPath(pairs, 'SAN');

  while(ypath[0] === spath[0]) {
    ypath.shift();
    spath.shift();
  }

  return ypath.length + spath.length;
}

const samples1 = [
  [`
COM)B
B)C  
C)D  
D)E  
E)F  
B)G  
G)H  
D)I  
E)J  
J)K  
K)L  
    `, 42]
];
const samples2 = [
  [`
COM)B
B)C  
C)D  
D)E  
E)F  
B)G  
G)H  
D)I  
E)J  
J)K  
K)L  
K)YOU
I)SAN    
    `, 4]
];

//test(sol1, samples1);
console.log(sol1(aocInput));

//test(sol2, samples2);
console.log(sol2(aocInput));
