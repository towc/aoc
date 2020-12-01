# frozen_string_literal: true

def transform_input(inp)
  inp.split.map(&:to_i)
end

inp = transform_input(`cat input`)

def s1(inp)
  a = 0
  b = 0
  inp.each.with_index do |x, i|
    inp[i..-1].each do |y|
      a, b = x, y if x + y == 2020
    end
  end
  a * b
end

def s2(inp)
  a = 0
  b = 0
  c = 0
  inp.each.with_index do |x, i|
    inp[i..-2].each.with_index do |y, j|
      inp[j..-1].each.with_index do |z, k|
        a, b, c = x, y, z if x + y + z == 2020
      end
    end
  end
  a * b * c
end


# {{{ test definition
def test(fname, samples)
  f = method(fname)
  puts "TESTING #{fname}"
  samples.each_with_index do |sample, i|
    print " test #{i}: "
    res = sample.last
    r = f.call(transform_input(sample.first))
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
def test(*_) return 'uncomment to disable tests'; end

test :s1, [
  [%q(
1721
979
366
299
675
1456
    ), 514579],
]

test :s2, [
  [%q(
1721
979
366
299
675
1456
    ), 241861950],
]

p s1(inp)
p s2(inp)
