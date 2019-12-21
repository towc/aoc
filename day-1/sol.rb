aoc_input = File.read('input')

def fuel(n)
  (n / 3) - 2
end

def fuelr(n)
  f = fuel(n)
  if f <= 0
    0
  else
    f + fuelr(f)
  end
end

def sol1(input)
  input.split.map(&:to_i).map {|n| fuel(n)} .sum
end

def sol2(input)
  input.split.map(&:to_i).map {|n| fuelr(n)} .sum
end


puts sol1 aoc_input
puts sol2 aoc_input
