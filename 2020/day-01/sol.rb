# frozen_string_literal: true

def transform_input(inp)
  inp.split.map(&:to_i)
end

inp = transform_input(`cat input`)

def s1(inp)
end

def s2(inp)
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

test :s1, [
  [%q(

), ],
]

# test :s2, [
#   [%q(), ],
# ]

# p s1(inp)
# p s2(inp)
