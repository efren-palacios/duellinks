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

          generateTopDecks(site, year_key, month_key, month)

          for decktype_key in month.keys
            decktype = month[decktype_key]
            
            #generate top-decks seasonal decktype pages

            for deck_key in decktype.keys
              deck = decktype[deck_key]
              deck_name = deck['name']

              if File.exist?('deck.html')
                FileUtils.rm 'deck.html'
              end

              deck_page = File.new('deck.html', 'w')
              
              deck_page.puts("---")
              deck_page.puts("layout: blog")
              deck_page.puts("author: bot")
              deck_page.puts("comments: true")
              deck_page.puts("permalink: #{deck['url']}")
              deck_page.puts("---")
              
              deck_page.puts("")
              deck_page.puts("{% assign deck = site.data.top-decks.#{year_key}.#{month_key}.#{decktype_key}.#{deck_key} %}")
              deck_page.puts("<div class='deck-page'>")
              deck_page.puts("  {% include deck.html deck=deck showHeader=true showStats=true %}")
              deck_page.puts("    <script>var playtest = {{deck | jsonify}}</script>") 
              deck_page.puts("    {% if deck.notes != null and deck.notes.size > 0  and deck.notes[0].text != '' %}")
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

    def generateTopDecks(site, year, month, decktypes)
      
      cur_year = Date.today.year.to_s
      cur_month = Date.today.month.to_s.rjust(2, "0")

      unless year == cur_year && month == cur_month
        generateTopDecksPageFiles(site, year, month, decktypes)
      end

      generateTopDecksDataFiles(site, year, month, decktypes)

    end

    def generateTopDecksPageFiles(site, year, month, decktypes)
      
      monthName = Date::MONTHNAMES[month.to_i].downcase
      
      unless File.exist?('season-page.html')
        season_page = File.new('season-page.html', 'w')
      end
      
      season_page.puts("---")
      season_page.puts("layout: blog")
      season_page.puts("author: bot")
      season_page.puts("permalink: /top-decks/#{monthName}-#{year}/")
      season_page.puts("scripts: topdecks.js")
      season_page.puts("---")
      season_page.puts("")
      season_page.puts("{% include top-decks.html season='#{year}-#{month}' %}")
      season_page.close

      site.pages << DeckPage.new(site, site.source, '', 'season-page.html')

      FileUtils.rm 'season-page.html'

    end

    def generateTopDecksDataFiles(site, year, month, decktypes)

      file_path = site.source + "/data/top-decks/" + year + "-" + month + ".json"
      
      if File.exist?(file_path)
        FileUtils.rm file_path
      end

      new_file = File.new(file_path, "w")
      
      top_decks = []

      for decktype_key in decktypes.keys
        decktype = decktypes[decktype_key]

        tierlistFile = File.read('_data/tierlist.json')
        tierlist = JSON.parse(tierlistFile)

        tiertype = { "display" => "", "card" => "" }

        for tier in tierlist
          for type in tier["types"]
            if type["id"] == decktype_key
              tiertype = type
            end
          end
        end

        if tiertype
          display = tiertype["display"]
          card = tiertype["card"]
        end

        decks = []

        for deck_key in decktype.keys
          deck = decktype[deck_key]

          if deck["name"].start_with?("##")
            deckName = deck["author"] + "'s " + tiertype["display"].gsub(" Decks", "") + " Deck"
          else
            deckName = deck["name"]
          end

          decks.push(
          {
            "author" => deck["author"].gsub(/\\/, '\\\\'),
            "name" => deckName.gsub(/\\/, '\\\\'),
            "url" => deck["url"],
            "created" => deck["created"],
            "front" => tiertype["card"],
            "skill" => deck["skill"]
          })

        end

        top_decks.push(
        {
          "id" => decktype_key,
          "display" => display,
          "card" => card,
          "count" => decktype.length,
          "decks" => decks
        })
      end

      new_file.puts(top_decks.to_json)
      new_file.close
      
    end
  end
end