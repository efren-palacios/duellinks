module Jekyll
  module DateFilter
    require 'date'
    def sort_decks(collection)
      collection.sort_by{|deck| Date.parse(deck[1]["created"], '%Y-%m-%d')}.reverse
    end
  end
  module StringFilter
    def strip_tabs(input)
      input.gsub(/\t/, ' ')
    end
    def escape_backslashes(input)
      input.gsub(/\\/, '\\\\\\\\')
    end
  end
end
Liquid::Template.register_filter(Jekyll::DateFilter)
Liquid::Template.register_filter(Jekyll::StringFilter)