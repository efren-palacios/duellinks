require 'jekyll'
require 'json'

module Jekyll
    class CardNameConverter < Converter
        safe false
        priority :high

        def matches(ext)
            ext =~ /^\.(md|markdown)$/i
        end

        def output_ext(ext)
            ".html"
        end

        def convert(content)
            markedText = Array.new
            customTagsIndex = Array.new
            customTagsName = Array.new
			customTagData = Array.new
            decks = Array.new

            lastTagOpen = -1
            for i in 0...content.length
                currChar = content[i].chr
                if(currChar == "{" || currChar == "[")
                    lastTagOpen = i
                elsif ((currChar == "}" || currChar == "]") && lastTagOpen >= 0)
                    tagContent = content[lastTagOpen + 1, i - lastTagOpen - 1]

                    prohibitedSubstr = [": '", ":'", "$", ":.", "':", "' :", ">", "<"]

                    isTagCardName = true

                    for j in 0...prohibitedSubstr.length
                        if tagContent.include?(prohibitedSubstr[j])
                            isTagCardName = false
                            break
                        end
                    end

                    if isTagCardName
                        if(currChar == "}")
                            markedText.push(tagContent)
                        elsif(currChar == "]")
                            customTagsIndex.push(i)
                            customTagsName.push(tagContent)
							
							startContent = -1
							addedData = false
							for j in i...content.length
								currLocalChar = content[j].chr
								if(currLocalChar == "(")
									startContent = j
								elsif(currLocalChar == ")" && startContent > 0)
									tagData = content[startContent + 1, j - startContent - 1]
									customTagData.push(tagData)
									addedData = true
									break
								end
							end
							
							if addedData == false
								customTagData.push("")
							end
                        end
                    end

                    lastTagOpen = -1
                end
            end

            skillsJsonFile = File.read('_data/skills.json')
            skillsJson = JSON.parse(skillsJsonFile)

			galleryCount = 0
            for i in (0...customTagsIndex.size).to_a.reverse
                startI = customTagsIndex[i]
                tag = customTagsName[i]
				tagData = customTagData[i]

                if(tag.include? "gallery")	
					imageLinks = tagData.split(',')

					carouselSize = ""
					if(tag.include? "1/3")
						carouselSize = "carousel-size-1-3 "
					elsif(tag.include? "2/3")
						carouselSize = "carousel-size-2-3 "
					else
						carouselSize = "carousel-size-3-3 "
					end

					carouselImageHeight = ""
                    carosuelItemHeight = ""
					if(tag.include? "h3")
                        carosuelItemHeight = "carousel-h3"
                        carouselSize += "carousel-h3"
						carouselImageHeight = "carousel-image-size-h3"
					elsif(tag.include? "h2")
                        carosuelItemHeight = "carousel-h2"
                        carouselSize += "carousel-h2"
						carouselImageHeight = "carousel-image-size-h2"
					else
                        carosuelItemHeight = "carousel-h1"
                        carouselSize += "carousel-h1"
						carouselImageHeight = "carousel-image-size-h1"
					end

galleryHtml = '
<div id="imageGallery' + galleryCount.to_s + '" class="carousel slide ' + carouselSize + '" data-ride="carousel">
    <ol class="carousel-indicators">
        <li data-target="imageGallery' + galleryCount.to_s + '" data-slide-to="0" class="active">
            <img src="' + imageLinks[0].strip + '" class="carousel-miniature" />
        </li>
        '


for k in 1...imageLinks.length
    galleryHtml += '<li data-target="imageGallery' + galleryCount.to_s + '" data-slide-to="' + k.to_s + '">
            <img src="' + imageLinks[k].strip + '" class="carousel-miniature" />
        </li>
	';
end


galleryHtml += '
    </ol>
	<div class="carousel-inner">
		<div class="carousel-item ' + carosuelItemHeight + ' active"><img class="d-block ' + carouselImageHeight + '" src="' + imageLinks[0].strip + '" alt=""></div>
        '

for k in 1...imageLinks.length
	galleryHtml += '    <div class="carousel-item ' + carosuelItemHeight + '"><img class="d-block ' + carouselImageHeight + '" src="' + imageLinks[k].strip + '" alt=""></div>
	';
end

galleryHtml += '</div>
	<a class="carousel-control-prev" href="#imageGallery' + galleryCount.to_s + '" role="button" data-slide="prev">
		<span class="carousel-control-prev-icon" aria-hidden="true"></span>
		<span class="sr-only">Previous</span>
	</a>
	<a class="carousel-control-next" href="#imageGallery' + galleryCount.to_s + '" role="button" data-slide="next">
		<span class="carousel-control-next-icon" aria-hidden="true"></span>
		<span class="sr-only">Next</span>
	</a>
</div>'

					content.sub!('[' + tag + '](' + tagData + ')', galleryHtml)
					galleryCount = galleryCount + 1
				
                elsif(tag.start_with?('deck'))
                    if(tag.start_with? "deck:")
                        skillName = tag.split(':', 2)[1];
                    else
                        skillName = ""
                    end

                    cardNames = tagData.split(';')

                    deckContainer =
                        '<div class="flex-container">
                            <div class="deck-container left">
                            '

                    if(skillName != "")
                        deckContainer +=
                        '<div class="skill">
                            <img class="main" src="/img/assets/skill.png" alt="skill">
                            <span class="card-hover" name="skillPopup">' + skillName.strip + '</span><span class="mobile"></span>
                        </div>
                        '
                    end

                    deckContainer +=
                        '       <div id="deck">
                                    <div id="cards">'

                    for card in cardNames
                        deckContainer +=
                                        '<div class="item">
                                            <a><img class="dcards"  name="cardPopup" src="https://yugiohprices.com/api/card_image/' + card.strip + '" alt=""></a>
                                        </div>'
                    end

                    deckContainer +=
                                    '</div>
                                </div>
                            </div>
                        </div>'

                    content.sub!('[' + tag + '](' + tagData + ')', deckContainer)
                end
            end

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
            content.gsub! '[w100]', '{:.img-w-100}'
            content.gsub! '[w75]', '{:.img-w-75}'
            content.gsub! '[w50]', '{:.img-w-50}'
            content.gsub! '[w25]', '{:.img-w-25}'

            # Call the standard Markdown converter
            site = Jekyll::Site.new(@config)
            mkconverter = site.find_converter_instance(Jekyll::Converters::Markdown)
            mkconverter.convert(content)
        end
    end
end