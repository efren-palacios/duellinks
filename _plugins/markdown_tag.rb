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
            customTagsIndex = Array.new
            customTagsName = Array.new
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
                            customTagsIndex.push(i + 1)
                            customTagsName.push(tagContent)
                        end
                    end

                    lastTagOpen = -1
                end
            end

            skillsJsonFile = File.read('_data/skills.json')
            skillsJson = JSON.parse(skillsJsonFile)

            for i in (0...customTagsIndex.size).to_a.reverse
                startI = customTagsIndex[i]
                tag = customTagsName[i]

                startContent = -1
                for j in startI...content.length
                    currChar = content[j].chr
                    if(currChar == "(")
                        startContent = j
                    elsif(currChar == ")" && startContent > 0)
                        tagContent = content[startContent + 1, j - startContent - 1]

                        if(tag.include? "gallery")
                            imageLinks = tagContent.split(',')

                            carouselSize = ""
                            if(tag.include? "1/3")
                                carouselSize = "carousel-size-1-3"
                            elsif(tag.include? "2/3")
                                carouselSize = "carousel-size-2-3"
                            else
                                carouselSize = "carousel-size-3-3"
                            end

                            carouselImageHeight = ""
                            if(tag.include? "h3")
                                carouselImageHeight = "carousel-image-size-h3"
                            elsif(tag.include? "h2")
                                carouselImageHeight = "carousel-image-size-h2"
                            else
                                carouselImageHeight = "carousel-image-size-h1"
                            end


galleryHtml = '
<div id="imageGallery" class="carousel slide ' + carouselSize + '" data-ride="carousel">
    <ol class="carousel-indicators">
    '


for k in 0...imageLinks.length
    galleryHtml += '    <li data-target="#imageGallery" data-slide-to="' + k.to_s + '"></li>
    ';
end

galleryHtml += '</ol>
    <div class="carousel-inner">
    '

galleryHtml += '    <div class="carousel-item active"><img class="d-block ' + carouselImageHeight + '" src="' + imageLinks[0] + '" alt=""></div>
    ';

for k in 1...imageLinks.length
    galleryHtml += '    <div class="carousel-item"><img class="d-block ' + carouselImageHeight + '" src="' + imageLinks[k] + '" alt=""></div>
    ';
end

galleryHtml += '</div>
    <a class="carousel-control-prev" href="#imageGallery" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#imageGallery" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
    </a>
</div>'

                            content.sub!('[' + tag + '](' + tagContent + ')', galleryHtml)
                        end

                        startContent = -1
                        break
                    end
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

            # Call the standard Markdown converter
            site = Jekyll::Site.new(@config)
            mkconverter = site.find_converter_instance(Jekyll::Converters::Markdown)
            mkconverter.convert(content)
        end
    end
end