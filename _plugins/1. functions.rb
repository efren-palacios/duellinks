require 'fileutils'

class CustomFunctions

  def getEncodedUrl(url)
    return URI.escape(url, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
  end
  
  def getFriendlyUrl(url)
    return url.gsub(/\W|_/, "-").gsub(/-+/, "-").downcase
  end

  def getProfileDataByName(name)
    profile = nil

    allProfiles = Dir["_data/profiles/*.json"]

    for fileName in allProfiles
      profileFile = File.read("_data/profiles/" + fileName)
      if profileFile
        profileJson = JSON.parse(profileFile)
        if profileJson && profileJson["name"] && profileJson["name"] == name
          profile = profileJson
          break
        end
      end
    end

    if profile

      rolesFile = File.read("_data/roles.json")
      roles = JSON.parse(rolesFile)

      foundRoles = roles.select do |elem|
        elem[:role-id] == profile["role"]
      end

      role = foundRoles.first

      url = getProfileUrlByProfile(profile)

      if role
        return { "name" => name, "url" => url, "color" => role["color"], "class" => "" }
      else
        return { "name" => name, "url" => url, "color" => "", "class" => "no-role" }
      end

    else

      foundGroups = roles.select do |elem|
        elem[:group-name] == name
      end

      group = foundGroups.first

      if group
        return { "name" => group["group-name"], "url" => group["url"], "color" => group["color"], "class" => "" }
      else
        return { "name" => name, "url" => "", "color" => "", "class" => "no-profile" }
      end

    end
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