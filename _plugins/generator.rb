require 'fileutils'
require 'jekyll'

module Jekyll
  class DeckPage < Jekyll::Page
  end

  class DeckPageGenerator < Jekyll::Generator
    safe true

    def generate(site)
      site_data = site.data
      decklists = site_data["decklists"]

      for year_key in decklists.keys
        year = decklists[year_key]
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

              deck_file.puts("permalink: /topdecks/#{monthName}-#{year_key}/#{decktype_key}/#{updated_deck_name}/")
              deck_file.puts("---")
              deck_file.puts("")
              deck_file.puts("{% assign deck = site.data.decklists.#{year_key}.#{month_key}.#{decktype_key}.#{deck_key} %}")
              deck_file.puts("<div class=\"flex-container\">")
              deck_file.puts("<div class=\"deck-container\">")
              deck_file.puts("")
              deck_file.puts("<div id=\"label\"><b>{{deck.name}}</b> by {{deck.author}} <br> <i>Added {{deck.created}}</i>")
              deck_file.puts("</div>")
              deck_file.puts("")
              deck_file.puts("<div id=\"deck\">")
              deck_file.puts("<div id=\"cards\">")
              deck_file.puts("    {% for item in deck.main %}")
              deck_file.puts("        {% include deckbuild.html card=item %}")
              deck_file.puts("    {% endfor %}")
              deck_file.puts("    {% assign extra = deck.extra %}")
              deck_file.puts("    {% if extra != null %}")
              deck_file.puts("        {% for item in extra %}")
              deck_file.puts("            {% include deckbuild.html card=item %}")
              deck_file.puts("        {% endfor %}")
              deck_file.puts("    {% endif %}")
              deck_file.puts("</div>")
              deck_file.puts("</div>")
              deck_file.puts("</div>")
              deck_file.puts("<div class=\"stats\">")        
              deck_file.puts("<p><img class=\"main\" src=\"https://cdn.discordapp.com/attachments/313655178094051331/368288837283217409/main.png\" alt=\"Skill icon\"> Main: 20</p>")
              deck_file.puts("<p><img class=\"main\" src=\"https://cdn.discordapp.com/attachments/313655178094051331/368290310100615168/extra.png\" alt=\"Skill icon\"> Extra: 0</p>")              
              deck_file.puts("<p><img class=\"main skill\" src=\"https://cdn.discordapp.com/attachments/313655178094051331/368290794882334720/skill.png\" alt=\"Skill icon\"> Skill: {{deck.skill}}</p>")              
              deck_file.puts("<div class=\"noimg\"><img class=\"info\" src=\"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\" /></div>")
              deck_file.puts("</div>")
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