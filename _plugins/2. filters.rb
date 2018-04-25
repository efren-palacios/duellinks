require 'fileutils'
require 'liquid'
require 'uri'

module Jekyll

  module ArrayFilter
    def filter_meta_giveaway(posts)
      posts.find_all { |post| post['category'] == 'tournament' and (post['tournament'] == 'Meta Weekly' or post['tournament'] == 'Give Away') }.sort_by{ |post| post.date }.reverse 
    end
    def filter_posts(posts)
      posts.find_all { |post| (post['category'] == 'guide' or post['category'] == 'tournament') and (post['hide'] == false or post['hide'] == nil) }
    end
    def sort_descending(array)
      array.sort.reverse
    end
    def arr_remove(articles, to_remove)
      return articles - to_remove
    end
    def filter_card_locations(locations)
      cards = []
      locations.each do |locationName, locationData|
        splitName = locationName.split('-')
        combinedLocationName1 = ""
        splitNameCount = 1
        splitName.each do |subSplitName|
          combinedLocationName1 += subSplitName.capitalize
          splitNameCount += 1
          if (splitNameCount <= splitName.length)
            combinedLocationName1 += " "
          end
        end
        locationData.each do |subLocationName, subLocationData|
          splitSubName = subLocationName.split('-')
          combinedLocationName2 = ""
          splitSubName.each do |coSubSplitName|
            combinedLocationName2 += coSubSplitName.capitalize + " "
          end  
          subLocationData.each do |card|
            if(combinedLocationName1 == "Level Up Reward")
              obtainVal = combinedLocationName2 + combinedLocationName1.gsub('Up', card["level"].to_s)
            else 
              if(combinedLocationName2.include? "Non Player Character")
                obtainVal = combinedLocationName2.gsub('Non Player', 'Non-Player') + combinedLocationName1
              else
                obtainVal = combinedLocationName2 + combinedLocationName1 
              end 
            end        
            card_hash = { 'name' => card["name"].gsub(/"/, "\\\""), 'rarity' => card["rarity"], 'obtain' => obtainVal }
            cards.push(card_hash)
          end 
        end
      end
      return cards
    end
    def deckTypeDecks(collection, deckType)
      decks = []
      for year_key in collection.keys
        months = collection[year_key]
        for month_key in months.keys
          month = months[month_key]
          for deckType_key in month.keys
            if deckType_key == deckType
              month_decks = month[deckType_key]
              for month_deck in month_decks
                decks.push(month_deck)    
              end
            end               
          end           
        end
      end
      decks.sort_by { |deck| deck[1]['created'] }.reverse
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

  module ContentFilter
    def getDeckTypeName(deckTypeId)
      tierlistFile = File.read('_data/tierlist.json')
      tierlist = JSON.parse(tierlistFile)

      tiertype = { "display" => "", "card" => "" }

      for tier in tierlist
        for type in tier["types"]
          if type["id"] == deckTypeId
            tiertype = type
          end
        end
      end

      return tiertype["display"]
    end
  end

  module ReadingTimeFilter
    def reading_time(input)
      words_per_minute = 180
  
      words = input.split.size;
      minutes = (words / words_per_minute).floor
      minutes_label = minutes === 1 ? " minute" : " minutes"
      minutes > 0 ? "about #{minutes} #{minutes_label}" : "less than 1 minute"
    end
  end

end

Liquid::Template.register_filter(Jekyll::DateFilter)
Liquid::Template.register_filter(Jekyll::StringFilter)
Liquid::Template.register_filter(Jekyll::ApiFilter)
Liquid::Template.register_filter(Jekyll::YoutubeFilter)
Liquid::Template.register_filter(Jekyll::ArrayFilter)
Liquid::Template.register_filter(Jekyll::ContentFilter)
Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)