require 'fileutils'

module Jekyll

  module CustomFunctions

    def url_encode(url)
      return URI.escape(url, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
    end
    
    def url_friendly(url)
      return url.gsub(/\W|_/, "-").gsub(/-+/, "-").downcase
    end

    def getProfileUrlByName(name)
      allProfiles = Dir["_data/profiles/*.json"]

      for profile in allProfiles
        profileFile = File.read("_data/profiles/" + profile)

        if profileFile

          profile = JSON.parse(profileFile)

          if profile && profile["name"] && profile["name"] == name
            return getProfileUrlByProfile(profile)
          end

        end
      end

      return ""

    end

    def getProfileUrlByProfile(profile)

      unless profile
        return ""
      end
      
      if profile["role"] && profile["role"] != ""

        rolesFile = File.read("_data/roles.json")
        roles = JSON.parse(rolesFile)
        urlFriendlyName = url_friendly(profile["name"])

        for role in roles
          if role["role-id"] == profile["role"] && role["url"] != ""
            return role["url"] + "/" + urlFriendlyName + "/"
          end
        end
      end
      
      return "/profile/" + urlFriendlyName + "/"
    end  
  end
end

Liquid::Template.register_filter(Jekyll::CustomFunctions)