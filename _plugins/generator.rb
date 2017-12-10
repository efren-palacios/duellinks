require 'fileutils'
require 'jekyll'

module Jekyll
  class DeckPage < Jekyll::Page
  end

  class DeckPageGenerator < Jekyll::Generator
    safe true

    def generate(site)

      top_decks = site.data["top-decks"]

      for year_key in top_decks.keys - ["pending"]
        year = top_decks[year_key]
        for month_key in year.keys
          month = year[month_key]
          monthName = Date::MONTHNAMES[month_key.to_i]
          for decktype_key in month.keys
            decktype = month[decktype_key]
            for deck_key in decktype.keys
              deck = decktype[deck_key]
              deck_name = deck['name']

              unless File.exist?('deck.html')
                deck_page = File.new('deck.html', 'w')
              end
              
              deck_page.puts("---")
              deck_page.puts("layout: blog")
              deck_page.puts("title: #{deck_name}")
              deck_page.puts("author: bot")
              deck_page.puts("comments: true")

              lower_name = deck_name.downcase
              lower_name.gsub! ' ', '-'
              updated_deck_name = lower_name   
              updated_deck_name = updated_deck_name.gsub("##", "")

              lower_author = deck['author'].downcase
              lower_author.gsub! ' ', '-'
              updated_author = lower_author

              deck_page.puts("permalink: /top-decks/#{monthName}-#{year_key}/#{decktype_key}/#{updated_deck_name}-by-#{updated_author}/")
              deck_page.puts("---")
              deck_page.puts("")
              deck_page.puts("{% assign deck = site.data.top-decks.#{year_key}.#{month_key}.#{decktype_key}.#{deck_key} %}")
              deck_page.puts("<div class='deck-page'>")
              deck_page.puts("  {% include deck.html deck=deck showHeader=true showStats=true %}")
              deck_page.puts("    <script>var playtest = {{deck | jsonify}}</script>") 
              deck_page.puts("    {% if deck.notes != null %}")
              deck_page.puts("      <h2>Notes from {{deck.author}}</h2>")
              deck_page.puts("      {% for note in deck.notes %}")
              deck_page.puts("        <div class='section deck-notes'>")
              deck_page.puts("          <h4>{{note.title}}</h4>")
              deck_page.puts("          <p>{{note.text}}</p>")
              deck_page.puts( "      </div>")
              deck_page.puts("    {% endfor %}")
              deck_page.puts("  {% endif %}")
              deck_page.puts("  <a style='margin: 1rem 0;' class='btn btn-primary' href='/top-decks/' role='button'><i class='fa fa-arrow-left' aria-hidden='true'></i> Back to Top Decks</a>")
              deck_page.puts("</div>")
              deck_page.close

              site.pages << DeckPage.new(site, site.source, '', 'deck.html')

              FileUtils.rm 'deck.html'
            end
          end
        end
      end

    end
  end
end