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

const processInput = (input) => {
  const map = {};

  input.trim().split('\n').map(l => l.trim()).forEach((line) => {
    const [l, [[rn, rt]]] = line.split(' => ').map(s => s.split(', ').map(c => c.split(' ')).map(([n, t]) => [Number(n), t]));

    map[rt] = { amount: rn, chems: l.map(([n, t]) => ({ amount: n, type: t })) };
  });

  map.ORE = { depth: 1 };

  const setDepth = ([type]) => {
    const recipe = map[type];

    if (recipe.depth) {
      return recipe.depth;
    }

    let max = 0;
    for (const { type: ct } of recipe.chems) {
      const d = setDepth([ct]);

      if (d > max) {
        max = d;
      }
    }

    map[type].depth = max + 1;

    return map[type].depth;
  };

  Object.entries(map).forEach(setDepth);

  return map;
};

const sol1 = (input) => {
  const recipes = processInput(input);

  const needs = [{ amount: 1, type: 'FUEL' }];
  const addneed = ({ amount, type }) => {
    const r = needs.find(n => n.type === type);

    if (r) {
      r.amount += amount;
    } else if (amount > 0) {
      needs.push(({ amount, type }));
    }
  };
  do {
    const reaction = needs.shift();

    const recipe = recipes[reaction.type];

    const count = Math.ceil(reaction.amount / recipe.amount);

    for (const chem of recipe.chems) {
      const camount = chem.amount * count;
      addneed({ type: chem.type, amount: camount });
    }

    needs.sort((a, b) => recipes[b.type].depth - recipes[a.type].depth);
  } while (needs.length > 1);

  return needs[0].amount;
};

const sol2 = (input) => {
  const orePerFuel = sol1(input);
  let ore = 1000000000000;
  let fuelProduced = 0;

  const recipes = processInput(input);

  const extras = [];
  const addextra = ({ amount, type }) => {
    const r = extras.find(n => n.type === type);

    if (r) {
      r.amount += amount;
    } else if (amount > 0) {
      extras.push(({ amount, type }));
    }
  };
  const remextra = ({ amount, type }) => {
    const r = extras.find(n => n.type === type);

    if (r) {
      r.amount -= amount;
      if (r.amount <= 0) {
        extras.splice(extras.indexOf(r), 1);
      }
    }
  };
  const getextra = (type) => {
    const r = extras.find(n => n.type === type);
    return r ? r.amount : 0;
  };
  const delextra = ({ type }) => extras.filter(n => n.type !== type);

  let step = 0;

  const useAmount = (famount) => {
    const needs = [{ amount: famount, type: 'FUEL' }];

    const addneed = ({ amount, type }) => {
      const r = needs.find(n => n.type === type);

      if (r) {
        r.amount += amount;
      } else if (amount > 0) {
        needs.push(({ amount, type }));
      }
    };
    do {
      const reaction = needs.shift();

      const recipe = recipes[reaction.type];

      const extra = getextra(reaction.type);

      if (extra >= reaction.amount) {
        remextra(reaction);
        continue;
      }

      const count = Math.ceil((reaction.amount - extra) / recipe.amount);
      delextra(reaction.type);

      const amountMade = recipe.amount * count;
      if (amountMade > reaction.amount) {
        addextra({ type: reaction.type, amount: amountMade - reaction.amount });
      }

      for (const chem of recipe.chems) {
        const camount = chem.amount * count;
        addneed({ type: chem.type, amount: camount });
      }

      needs.sort((a, b) => recipes[b.type].depth - recipes[a.type].depth);
    } while (needs.length > 1);

    fuelProduced += famount;

    return needs[0].amount;
  };


  while (ore >= orePerFuel) {
    ++step;
    const famount = Math.floor(ore / orePerFuel);

    const oreUsed = useAmount(famount);

    ore -= oreUsed;
  }

  return fuelProduced;
};

const samples1 = [
  [`
9 ORE => 2 A              
8 ORE => 3 B              
7 ORE => 5 C              
3 A, 4 B => 1 AB          
5 B, 7 C => 1 BC          
4 C, 1 A => 1 CA          
2 AB, 3 BC, 4 CA => 1 FUEL
`, 165],
  [`
157 ORE => 5 NZVS                                              
165 ORE => 6 DCFZ                                              
44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL
12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ                            
179 ORE => 7 PSHF                                              
177 ORE => 5 HKGWZ                                             
7 DCFZ, 7 PSHF => 2 XJWVT                                      
165 ORE => 2 GPVTF                                             
3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT`, 13312],
  [`
2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG                   
17 NVRVD, 3 JNWZP => 8 VPVL                                     
53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL
22 VJHF, 37 MNCFX => 5 FWMGM                                    
139 ORE => 4 NVRVD                                              
144 ORE => 7 JNWZP                                              
5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC           
5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV                     
145 ORE => 6 MNCFX                                              
1 NVRVD => 8 CXFTF                                              
1 VJHF, 6 MNCFX => 4 RFSQX                                      
176 ORE => 6 VJHF`, 180697],
  [`
171 ORE => 8 CNZTR                                                   
7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL
114 ORE => 4 BHXH                                                    
14 VRPVC => 6 BMBT                                                   
6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL      
6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT
15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW                                  
13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW        
5 BMBT => 4 WPTQ                                                     
189 ORE => 9 KTJDG                                                   
1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP                                 
12 VRPVC, 27 CNZTR => 2 XDBXC                                        
15 KTJDG, 12 BHXH => 5 XCVML                                         
3 BHXH, 2 VRPVC => 7 MZWV                                            
121 ORE => 7 VRPVC                                                   
7 XCVML => 6 RJRHP                                                   
5 BHXH, 4 VRPVC => 5 LTCX`, 2210736],
];
const samples2 = [
  [samples1[1][0], 82892753],
  [samples1[2][0], 5586022],
  [samples1[3][0], 460664],
];

//test(sol1, samples1);
console.log(sol1(aocInput));

//test(sol2, samples2);
console.log(sol2(aocInput));
