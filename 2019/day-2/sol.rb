# frozen_string_literal: true

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
      puts 'FAIL '
      puts '   expected'
      puts "     #{res}"
      puts '   but got'
      puts "     #{r}"
    else
      puts 'ok'
    end
  end
end
# }}}

def process_input(input)
  input.strip.split(',').map(&:to_i)
end

def run_intcode(ns)
  i = 0

  while i < ns.size
    op, a, b, res = ns[i..i + 3]

    break if op == 99

    ns[res] = op == 1 ? ns[a] + ns[b] : ns[a] * ns[b]

    i += 4
  end

  ns
end

def sol1(input)
  xs = process_input(input)
  xs[1] = 12
  run_intcode(xs)
  xs[0]
end

def sol2(input)
  xs = process_input(input)
  (0..99).each do |a|
    (0..99).each do |b|
      ns = xs.clone
      ns[1..2] = a, b
      return a * 100 + b if run_intcode(ns)[0] == 19_690_720
    end
  end
end

def test(*_) 'uncomment to disable tests'; end # rubocop:disable SingleLineMethods

test :sol1, [
  []
]
p sol1 aoc_input
test :sol2, [
  []
]
p sol2 aoc_input
