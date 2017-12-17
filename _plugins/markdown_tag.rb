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
            markedText = Array.new
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
                        markedText.push(tagContent)
                    end

                    lastCardNameTagOpen = -1
                end
            end

            skillsJsonFile = File.read('_data/skills.json')
            skillsJson = JSON.parse(skillsJsonFile)

            for i in 0...markedText.size
                isSkill = false
                skillOfficialName = markedText[i]
                for j in 0...skillsJson.size
                    skillJson = skillsJson[j]['name'].downcase.gsub(/\W/, '')
                    text = markedText[i].downcase.gsub(/\W/, '')

                    if skillJson == text
                        isSkill = true
                        skillOfficialName = skillsJson[j]['name']
                       break
                    end
                end

                if isSkill
                    content.sub! '{' + markedText[i] + '}', '<span class="card-hover" name="skillPopup">' + skillOfficialName + '</span><span class="mobile"></span>'
                else
                    content.sub! '{' + markedText[i] + '}', '<span class="card-hover" name="cardPopup" src="https://yugiohprices.com/api/card_image/' + markedText[i] + '">' + markedText[i] + '</span><span class="mobile"></span>'
                end
            end

            content.gsub! '[content-only]', '{:.content-only}'
            content.gsub! '[table-of-contents]', '{:.table-of-contents}'

            # Call the standard Markdown converter
            site = Jekyll::Site.new(@config)
            mkconverter = site.find_converter_instance(Jekyll::Converters::Markdown)
            mkconverter.convert(content)
        end
    end
end