require 'fileutils'
require 'jekyll'

module Jekyll
  class SeasonPage < Jekyll::Page
  end

  class DeckPage < Jekyll::Page
    def initialize(site, base, dir, keys)            
        @site = site
        @base = base
        @dir = dir
        @name = 'index.html'
        
        self.process(@name)
        self.read_yaml(File.join(base, '_layouts'), 'deck.html')

        self.data['comments'] = true
        self.data['deck'] = site.data["top-decks"][keys[0]][keys[1]][keys[2]][keys[3]]
    end    
  end

  class DeckPageGenerator < Jekyll::Generator
    safe true

    def generate(site)

      top_decks = site.data["top-decks"]

      for year_key in top_decks.keys - ["pending"]
        year = top_decks[year_key]

        for month_key in year.keys
          month = year[month_key]

          generateTopDecksSeasons(site, year_key, month_key, month)

          for decktype_key in month.keys
            decktype = month[decktype_key]
            
            #generate top-decks seasonal decktype pages

            for deck_key in decktype.keys     
              dateString = Time.new(year_key,month_key,'1').strftime("%B").downcase + '-' + year_key.to_s
              deck = decktype[deck_key]
              pageTitle = deck['url'].split('/').last
              dir = File.join("top-decks", dateString, decktype_key.to_s, pageTitle)

              keys = [year_key, month_key, decktype_key, deck_key]
              site.pages << DeckPage.new(site, site.source, dir, keys)
            end
          end
        end
      end
    end

    def generateTopDecksSeasons(site, year, month, decktypes)
      
      cur_year = Date.today.year.to_s
      cur_month = Date.today.month.to_s.rjust(2, "0")

      unless year == cur_year && month == cur_month
        generateTopDecksSsnPageFiles(site, year, month, decktypes)
      end

      generateTopDecksSsnDataFiles(site, year, month, decktypes)

    end

    def generateTopDecksSsnPageFiles(site, year, month, decktypes)
      
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

      site.pages << SeasonPage.new(site, site.source, '', 'season-page.html')

      FileUtils.rm 'season-page.html'

    end

    def generateTopDecksSsnDataFiles(site, year, month, decktypes)
      
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
            "top-player-council" => deck["top-player-council"] ? true : false,
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