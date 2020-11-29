# setup {{{
aoc_input = File.read('input')

def test(fname, samples)
  f = method(fname)
  puts "TESTING #{fname}"
  samples.each_with_index do |sample, i|
    print " test #{i}: "
    res = sample.last
    r = f.call(*sample[0..-2])
    if r != res
      puts "FAIL "
      puts "   expected"
      puts "     #{res}"
      puts "   but got"
      puts "     #{r}"
    else
      puts "ok"
    end
  end
end
# }}}

def process_input(input)
  input.strip.split.map(&:strip) .map(&:to_i)
end

def fuel(n)
  (n / 3) - 2
end

def fuelr(n)
  f = fuel(n)
  f <= 0 ? 0 : f + fuelr(f)
end

def sol1(input)
  xs = process_input(input)
  xs.map {|n| fuel(n)} .sum
end

def sol2(input)
  xs = process_input(input)
  xs.map {|n| fuelr(n)} .sum
end

# def test(*_) return 'uncomment to disable tests'; end

test :fuel, [
  [12, 2],
  [1969, 654],
]
p sol1 aoc_input
test :fuelr, [
  [1969, 966],
  [100756, 50346],
]
p sol2 aoc_input
