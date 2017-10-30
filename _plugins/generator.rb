require 'fileutils'
require 'jekyll'

module Jekyll
  class DeckPage < Jekyll::Page
  end

  class DeckPageGenerator < Jekyll::Generator
    safe true

    def generate(site)
      site_data = site.data
      top_decks = site_data["top-decks"]

      for year_key in top_decks.keys
        year = top_decks[year_key]
        for month_key in year.keys
          month = year[month_key]
          monthName = Date::MONTHNAMES[month_key.to_i]
          for decktype_key in month.keys
            decktype = month[decktype_key]
            for deck_key in decktype.keys
              deck = decktype[deck_key]
              deck_name = deck['name']

              deck_file = File.new('deck.html', 'w')

              deck_file.puts("---")
              deck_file.puts("layout: blog")
              deck_file.puts("title: #{deck_name}")
              deck_file.puts("author: bot")
              deck_file.puts("comments: true")

              lower_name = deck_name.downcase
              lower_name.gsub! ' ', '-'
              updated_deck_name = lower_name   

              deck_file.puts("permalink: /top-decks/#{monthName}-#{year_key}/#{decktype_key}/#{updated_deck_name}/")
              deck_file.puts("---")
              deck_file.puts("")
              deck_file.puts("{% assign deck = site.data.top-decks.#{year_key}.#{month_key}.#{decktype_key}.#{deck_key} %}")
              deck_file.puts("{% include deck.html deck=deck showStats=true %}")
              deck_file.puts("{% if deck.notes != null %}")
              deck_file.puts("    <h2>Notes from {{deck.author}}</h2>")
              deck_file.puts("    {% for note in deck.notes %}")
              deck_file.puts("        <div class='section deck-notes'>")
              deck_file.puts("            <h4>{{note.title}}</h4>")
              deck_file.puts("            <p>{{note.text}}</p>")
              deck_file.puts("        </div>")
              deck_file.puts("    {% endfor %}")
              deck_file.puts("{% endif %}")
              deck_file.close

              site.pages << DeckPage.new(site, site.source, '', 'deck.html')

              FileUtils.rm 'deck.html'
            end
          end
        end
      end
    end
  end
end