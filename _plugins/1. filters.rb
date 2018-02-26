module Jekyll
  module ArrayFilter
    def filter_posts(posts)
      posts.find_all { |post| (post['category'] == 'guide' or post['category'] == 'tournament') and (post['hide'] == false or post['hide'] == nil) }
    end
  end
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
    def capitalize_all(words)
      return words.split(' ').map(&:capitalize).join(' ')
    end
  end
  module ApiFilter
    def name(input, name)
      input.gsub('[name]', name.gsub(' ', '_').gsub('-', '_').gsub(':', '_').gsub('#', '_').gsub('"', '_').gsub('/', '_'))
    end
  end
  module YoutubeFilter
    def getYoutubeId(url)
      id = ''
      url = url.gsub(/(>|<)/i,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
      if url[2] != nil
        id = url[2].split(/[^0-9a-z_\-]/i)
        id = id[0];
      else
        id = url;
      end
      id
    end
  end
end
Liquid::Template.register_filter(Jekyll::DateFilter)
Liquid::Template.register_filter(Jekyll::StringFilter)
Liquid::Template.register_filter(Jekyll::ApiFilter)
Liquid::Template.register_filter(Jekyll::YoutubeFilter)
Liquid::Template.register_filter(Jekyll::ArrayFilter)