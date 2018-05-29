def regex(input, regex, replacement = '')
  input.to_s.gsub(Regexp.new(regex), replacement.to_s)
end