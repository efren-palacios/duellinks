require 'jekyll'
require 'fileutils'
require 'uri'

module Jekyll
    class ProfilePage < Jekyll::Page
        def initialize(site, base, dir, profile_key)            
            @site = site
            @base = base
            @dir = dir
            @name = 'index.html'
            
            self.process(@name)
            self.read_yaml(File.join(base, '_layouts'), 'author.html')

            profiles = site.data['profiles']
            current_profile = profiles[profile_key]

            self.data['title'] = current_profile['name']
            self.data['author'] = current_profile['name']
            self.data['image'] = current_profile['image']
            self.data['role'] = current_profile['role']

            social_media = current_profile['social-media']
            if social_media
                if social_media['twitch']
                    self.data['twitch'] = social_media['twitch']        
                end    
                if social_media['youtube']
                    self.data['youtube'] = social_media['youtube']        
                end
                if social_media['facebook']
                    self.data['facebook'] = social_media['facebook']        
                end
                if social_media['twitter']
                    self.data['twitter'] = social_media['twitter']        
                end
                if social_media['instagram']
                    self.data['instagram'] = social_media['instagram']        
                end
            end

            if current_profile['about'].to_s.size > 0
                self.data['about'] =  current_profile['about']
            end
            if current_profile['accomplishments'].to_s.size > 0
                self.data['accomplishments'] = current_profile['accomplishments']
            end
        end
    end

    class ProfileGenerator < Jekyll::Generator
        include CustomFunctions
        
        def generate(site)
            profiles = site.data['profiles']

            for profile_key in profiles.keys
                
                current_profile = profiles[profile_key]

                location = self.class.new.getProfileUrlByProfile(current_profile)

                site.pages << ProfilePage.new(site, site.source, location, profile_key)
            end
        end
    end
end