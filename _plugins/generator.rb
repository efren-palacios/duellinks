require 'fileutils'

module Jekyll
  class DeckPage < Jekyll::Page
  end

  class DeckPageGenerator < Jekyll::Generator
    safe true

    def generate(site)
      site_data = site.data
      decklists = site_data["decklists"]

      for decktype_key in decklists.keys
        decktype = decklists[decktype_key]
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

          deck_file.puts("permalink: /topdecks/#{decktype_key}/#{updated_deck_name}/")
          deck_file.puts("---")
          deck_file.puts("")
          deck_file.puts("<h2>{{site.data.decklists.#{decktype_key}.#{deck_key}.name}}</h2>")
          deck_file.puts("<h4>{{site.data.decklists.#{decktype_key}.#{deck_key}.author}}</h4>")
          deck_file.puts("")
          deck_file.puts("<p style=\"margin-top: 2rem;\">Added {{site.data.decklists.#{decktype_key}.#{deck_key}.created}}</p>")
          deck_file.puts("")
          deck_file.puts("<ul class=\"list-group\">")
          deck_file.puts("    <h4 style=\"margin: 1rem 0;\">Main Deck</h4>")
          deck_file.puts("    {% assign main = site.data.decklists.#{decktype_key}.#{deck_key}.main %}")
          deck_file.puts("    {% for item in main %}")
          deck_file.puts("        {% include deckbuild.html card=item %}")
          deck_file.puts("    {% endfor %}")
          deck_file.puts("    {% assign extra = site.data.decklists.#{decktype_key}.#{deck_key}.extra %}")
          deck_file.puts("    {% if extra != null %}")
          deck_file.puts("        <h4 style=\"margin: 1rem 0;\">Extra Deck</h4>")
          deck_file.puts("        {% for item in extra %}")
          deck_file.puts("            {% include deckbuild.html card=item %}")
          deck_file.puts("        {% endfor %}")
          deck_file.puts("    {% endif %}")
          deck_file.puts("</ul>")

          deck_file.close

          site.pages << DeckPage.new(site, site.source, '', 'deck.html')

          FileUtils.rm 'deck.html'
        end
      end
    end
  end
end