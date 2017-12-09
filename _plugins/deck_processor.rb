require 'fileutils'
require 'jekyll'

module Jekyll
  class DeckFileGenerator < Jekyll::Generator
    safe true

    def generate(site)

      # Deck File Processing

      pending = site.data["top-decks"]["pending"]

      year = Date.today.year.to_s
      month = Date.today.month.to_s

      for file_key in pending.keys

        file = pending[file_key]
        deck_type = file["deckType"]

        directory = site.source + "/_data/top-decks/" + year + "/" + month + "/" + deck_type + "/"
        file_name = file["author"].downcase + ".json"
        full_path = directory + file_name

        unless File.directory?(directory)
          FileUtils.mkdir_p(directory)
        end

        unless File.exist?(full_path)
          new_file = File.new(full_path, "w")

          file_main = [file["main0"], file["main1"], file["main2"], file["main3"], file["main4"], file["main5"]]
          deck_main = []

          for card in file_main
            deck_main.push({ "name" => card, "amount" => 1})
          end

          deck =
          {
            "name" => file["name"],
            "author" => file["author"],
            "created" => file["date"],
            "skill" => file["skill"],
            "main" => deck_main,
            "notes" => file["notes"]
          }

          new_file.puts(deck.to_json)
          new_file.close

        end
      end

      # End Deck File Processing
      
    end
  end
end