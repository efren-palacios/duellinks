require 'jekyll'
require 'fileutils'

module Jekyll
    class ProfilePage < Jekyll::Page
    end

    class ProfileGenerator < Jekyll::Generator
        def generate(site)
            profiles = site.data['profiles']

            for profile_key in profiles.keys            
                current_profile = profiles[profile_key]
                
                FileUtils.rm 'profile.html', :force => true
                    
                profile_page = File.new('profile.html', 'w+')

                profile_page.puts("---")
                profile_page.puts("layout: author")
                profile_page.puts("title: #{current_profile['name']}")
                profile_page.puts("author: #{current_profile['name']}")
                profile_page.puts("image: #{current_profile['image']}")
                profile_page.puts("role: #{current_profile['role']}")

                social_media = current_profile['social-media']
                if social_media
                    if social_media['twitch']
                        profile_page.puts("twitch: #{social_media['twitch']}")        
                    end    
                    if social_media['youtube']
                        profile_page.puts("youtube: #{social_media['youtube']}")        
                    end
                    if social_media['facebook']
                        profile_page.puts("facebook: #{social_media['facebook']}")        
                    end
                    if social_media['twitter']
                        profile_page.puts("twitter: #{social_media['twitter']}")        
                    end
                    if social_media['instagram']
                        profile_page.puts("instagram: #{social_media['instagram']}")        
                    end
                end

                if current_profile['about'].to_s.size > 0
                    profile_page.puts("about: \"#{current_profile['about']}\"")
                end
                if current_profile['accomplishments'].to_s.size > 0
                    profile_page.puts("accomplishments: \"#{current_profile['accomplishments']}\"")
                end

                if current_profile['role'] == 'author'
                    profile_page.puts("permalink: /authors/#{profile_key}/")
                else
                    profile_page.puts("permalink: /top-player-council/#{profile_key}/")   
                end

                profile_page.puts("---")
                profile_page.close

                site.pages << ProfilePage.new(site, site.source, '', 'profile.html')

                FileUtils.rm 'profile.html'
            end
        end
    end
end