require 'jekyll'
require 'json'

module Jekyll
    class CardNameConverter < Converter
        safe :false
        priority :high

        def matches(ext)
            ext =~ /^\.(md|markdown)$/i
        end

        def output_ext(ext)
            ".html"
        end

        def convert(content)
            cardNames = Array.new
            decks = Array.new

            lastCardNameTagOpen = -1
            for i in 0...content.length
                currChar = content[i].chr
                if(currChar == "{")
                    lastCardNameTagOpen = i
                elsif (currChar == "}" && lastCardNameTagOpen >= 0)
                    tagContent = content[lastCardNameTagOpen + 1, i - lastCardNameTagOpen - 1]

                    prohibitedSubstr = [": '", ":'", "$", ":.", "':", "' :", ">", "<"]

                    isTagCardName = true

                    for j in 0...prohibitedSubstr.length
                        if tagContent.include?(prohibitedSubstr[j])
                            isTagCardName = false
                            break
                        end
                    end

                    if isTagCardName
                        cardNames.push(tagContent)
                    end

                    lastCardNameTagOpen = -1
                end
            end

            skillsJsonFile = File.read('_data/skills.json')
            skillsJson = JSON.parse(skillsJsonFile)

            for i in 0...cardNames.size
                isSkill = false
                for j in 0...skillsJson.size
                    if skillsJson[j]['name'].downcase.tr("!", "") == cardNames[i].downcase.tr("!", "")
                        isSkill = true
                       break
                    end
                end

                if isSkill
                    content.sub! '{' + cardNames[i] + '}', '<span class="card-hover" name="skillPopup">' + cardNames[i] + '</span><span class="mobile"></span>'
                else
                    content.sub! '{' + cardNames[i] + '}', '<span class="card-hover" name="cardPopup" src="https://yugiohprices.com/api/card_image/' + cardNames[i] + '">' + cardNames[i] + '</span><span class="mobile"></span>'
                end
            end

            content.gsub! '[content-only]', '{:.content-only}'

            # Call the standard Markdown converter
            site = Jekyll::Site.new(@config)
            mkconverter = site.find_converter_instance(Jekyll::Converters::Markdown)
            mkconverter.convert(content)
        end
    end
end