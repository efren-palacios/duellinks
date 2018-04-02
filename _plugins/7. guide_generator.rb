require 'jekyll'
require 'fileutils'

module Guide
    class GuidePage < Jekyll::Page
    end
    
    class GuidePageGenerator < Jekyll::Generator
        def generate(site)
            deck_type = site.data['deck-types']
            pages = deck_type['pages']

            for page_key in pages.keys
                current_page = pages[page_key]

                FileUtils.rm 'guide.html', :force => true
                
                guide_page = File.new('guide.html', 'w+')

                guide_page.puts("---")
                guide_page.puts("layout: blog")
                guide_page.puts("title: Introduction to #{current_page['deck-type']}")
                guide_page.puts("author: #{current_page['created-by']}")
                guide_page.puts("category: page")
                guide_page.puts("sub-category: deck-type")
                guide_page.puts("deck-type: #{page_key}")
                guide_page.puts("date: #{current_page['modified-on']}")
                guide_page.puts("comments: false")

                description = "A quick introduction to the #{current_page['deck-type']} deck type. View sample deck, core cards, tech cards"
                if current_page['guides'].length > 0  
                    description += ", guides"
                end 
                if current_page['videos'].length > 0
                    description += ", videos"
                end
                description += " and other information."
                guide_page.puts("description: #{description}")
                guide_page.puts("keywords: #{current_page['deck-type']}, decks, deck type, info, information")
                guide_page.puts("permalink: /tier-list/#{page_key}/")
                guide_page.puts("---")
                
                guide_page.puts("")
                guide_page.puts("{% assign guide = site.data.deck-types.pages[{{page.deck-type}}] %}")
                guide_page.puts("{% include guides/guide.html guide=guide %}")
                guide_page.puts("{% include decktype_decks.html deckType=page.deck-type %}")
                guide_page.puts("{% include top-decks-season-archive.html %}") 

                guide_page.close
    
                site.pages << GuidePage.new(site, site.source, '', 'guide.html')
    
                FileUtils.rm 'guide.html'
            end
        end
    end
end