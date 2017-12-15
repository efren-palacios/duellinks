require 'fileutils'
require 'jekyll'

module Jekyll
  class DeckFileGenerator < Jekyll::Generator
    safe true

    def generate(site)

      pending = site.data["top-decks"]["pending"]

      if pending

        year = Date.today.year.to_s
        month = Date.today.month.to_s

        for file_key in pending.keys

          file = pending[file_key]
          deck_type = file["deckType"]

          directory = site.source + "/_data/top-decks/" + year + "/" + month + "/" + deck_type + "/"
          file_name = file["author"].gsub("/", "").gsub(/\s+/, ' ').gsub(" ", "-").downcase + ".json"
          full_path = directory + file_name

          unless File.directory?(directory)
            FileUtils.mkdir_p(directory)
          end

          unless File.exist?(full_path)
            new_file = File.new(full_path, "w")

            file_main = [
              file["main0"],  file["main1"],  file["main2"],  file["main3"],  file["main4"],  file["main5"],
              file["main6"],  file["main7"],  file["main8"],  file["main9"],  file["main10"], file["main11"],
              file["main12"], file["main13"], file["main14"], file["main15"], file["main16"], file["main17"],
              file["main18"], file["main19"], file["main20"], file["main21"], file["main22"], file["main23"],
              file["main24"], file["main25"], file["main26"], file["main27"], file["main28"], file["main29"]]
            
            file_extra = [
              file["extra0"], file["extra1"], file["extra2"], file["extra3"], file["extra4"], file["extra5"]]

            deck_main = []
            deck_extra = []

            for card in file_main
              if card
                deck_main.push({ "name" => card, "amount" => 1})
              end
            end

            for card in file_extra
              if card
                deck_extra.push({ "name" => card, "amount" => 1})
              end
            end

            deck =
            {
              "name" => file["name"],
              "author" => file["author"],
              "created" => file["date"][0..9],
              "skill" => file["skill"],
              "main" => deck_main,
              "extra" => deck_extra,
              "notes" => [{ "text" => file["notes"]}]
            }

            new_file.puts(deck.to_json)
            new_file.close

          end

          #FileUtils.rm site.source + "/_data/top-decks/pending/" + file_key + ".json"
          
        end
      end
    end
  end
end