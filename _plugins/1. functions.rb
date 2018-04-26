require 'fileutils'

class CustomFunctions

  def getEncodedUrl(url)
    return URI.escape(url, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
  end
  
  def getFriendlyUrl(url)
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
      urlFriendlyName = getFriendlyUrl(profile["name"])

      for role in roles
        if role["role-id"] == profile["role"] && role["url"] != ""
          return role["url"] + urlFriendlyName + "/"
        end
      end
    end
    
    return "/profile/" + urlFriendlyName + "/"
  end 

end