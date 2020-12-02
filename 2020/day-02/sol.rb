# frozen_string_literal: true

def transform_input(inp)
  inp.split("\n").map do |l|
    range, charsep, pwd = l.split(' ')
    low, high = range.split('-').map &:to_i
    char = charsep[0]
    [low, high, char, pwd]
  end
end

inp = transform_input(`cat input`)

def s1(inp)
  inp.select do |l|
    low, high, char, pwd = l

    pwd.count(char) >= low && pwd.count(char) <= high
  end .size
end

def s2(inp)
  inp.select do |l|
    x, y, char, pwd = l

    x = x-1
    y = y-1

    (pwd[x] == char && pwd[y] != char) || 
      (pwd[x] != char && pwd[y] == char)
  end .size
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
# def test(*_) return 'uncomment to disable tests'; end

# test :s1, [
#   [%q(1-3 a: abcde
# 1-3 b: cdefg
# 2-9 c: ccccccccc), 2],
# ]

# test :s2, [
#   [%q(1-3 a: abcde
# 1-3 b: cdefg
# 2-9 c: ccccccccc), 1],
# ]

p s1(inp)
p s2(inp)
