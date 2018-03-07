
/* ===== DiscordUser ===== */

function DiscordUser(id, username, roles)
{
    this.id = id;
    this.username = username;
    this.roles = roles;
}

DiscordUser.prototype.getID = function()
{
    return this.id;
};

DiscordUser.prototype.getUsername = function()
{
    return this.username;
};

DiscordUser.prototype.isContentManager = function()
{
    return $.inArray('website devs', this.roles) !== -1 || $.inArray('dkayed', this.roles) !== -1 || $.inArray('content creator', this.roles) !== -1;
};

DiscordUser.prototype.isDev = function()
{
    return $.inArray('website devs', this.roles) !== -1;
};

DiscordUser.prototype.isKoG = function()
{
    return $.inArray('king of games', this.roles) !== -1;
};

/* ======================= */

/* ===== Cookie Mngr ===== */

function ProfileCookieManager(profileCookieName)
{
    this.profileCookieName = profileCookieName;
}

ProfileCookieManager.prototype.hasAnyProfile = function()
{
    return this.getCookie(this.profileCookieName) ? true : false;
}

ProfileCookieManager.prototype.getCookie = function(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

ProfileCookieManager.prototype.getAllProfiles = function()
{
    if(this.hasAnyProfile())
        return JSON.parse(this.getCookie(this.profileCookieName));
    else
        return [];
}

ProfileCookieManager.prototype.hasProfile = function(profileId)
{
    return $.inArray(profileId, this.getAllProfiles()) !== -1;
}

ProfileCookieManager.prototype.addProfile = function(profileId)
{
    var currentProfiles = this.getAllProfiles();

    if(!this.hasProfile(profileId))
        currentProfiles.push(profileId);

    var newCookieValue = JSON.stringify(currentProfiles);

    var today = new Date();
    var nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0, 0, 0, 0, 0); // Already accounts for year change

    var expires = "expires="+ nextMonthDate.toUTCString();
    document.cookie = this.profileCookieName + "=" + newCookieValue + ";" + expires + ";path=/";
}

/* ======================= */

/* ===== Discord Api ===== */

function DiscordAPICall(botToken, discordId)
{
    this.botToken = botToken;
    this.discordId = discordId;

    var _accessToken = window.location.href.split("#access_token=")[1];
    if(_accessToken)
        this.accessToken = _accessToken.split("&")[0];
    else
        this.accessToken = "";

    this.userId = "";
    this.allowedRoles = [];
}

DiscordAPICall.prototype.getAccessToken = function()
{
    return this.accessToken;
}

DiscordAPICall.prototype.setUserID = function(id)
{
    this.userId = id;
}

DiscordAPICall.prototype.getUserID = function()
{
    return this.userId;
}

DiscordAPICall.prototype.setAllowedRoles = function(allowedRoles)
{
    this.allowedRoles = allowedRoles;
}

DiscordAPICall.prototype.getAllowedRoles = function()
{
    return this.allowedRoles;
}

DiscordAPICall.prototype.getUserIDByAccessToken = function(callback)
{
    var ref = this;
    $.ajax(
    {
        type: 'GET',
        url: "https://discordapp.com/api/users/@me",
        headers: { "Authorization": "Bearer " + this.accessToken },
        success: function (result) {
            ref.setUserID(result['id']);
            callback();
        },
        error: function ()
        {
            $("#kog-status").html("Please login to discord to check your KoG status.");
        }
    });
}

DiscordAPICall.prototype.getAllowedRolesID = function(callback)
{
    var ref = this;
    var roles = [/*'king of games', */'dkayed', 'website devs', 'content creator'];

    $.ajax(
    {
        type: 'GET',
        url: "https://discordapp.com/api/guilds/" + this.discordId,
        headers: { "Authorization": "Bot " + this.botToken },
        success: function (result)
        {
            var allowedRoles = [];
            for (var i = 0; i < result['roles'].length; i++)
            {
                if ($.inArray(result['roles'][i]['name'].toLowerCase(), roles) !== -1)
                {
                    allowedRoles.push(
                    {
                        name: result['roles'][i]['name'],
                        id: result['roles'][i]['id']
                    });
                }
            }

            ref.setAllowedRoles(allowedRoles);
            callback();
        },
        error: function ()
        {
            $("#kog-status").html("Internal error.");
        }
    });
}

DiscordAPICall.prototype.processUserRoles = function(isKogAction, isNotKogAction)
{
    var ref = this;
    $.ajax(
    {
        type: 'GET',
        url: "https://discordapp.com/api/guilds/" + this.discordId + "/members/" + this.userId,
        headers: { "Authorization": "Bot " + this.botToken },
        success: function (result)
        {
            var allowedRoles = ref.getAllowedRoles();

            var userRoles = [];
            for (var i = 0; i < result['roles'].length; i++)
            {
                for(var j = 0; j < allowedRoles.length; j++)
                {
                    if(allowedRoles[j].id == result['roles'][i])
                    {
                        userRoles.push(allowedRoles[j].name.toLowerCase());
                    }
                }
            }

            discordUser = new DiscordUser(ref.getUserID(), result['user']['username'], userRoles);

            if(cookieManager.hasProfile(discordUser.getID()) && !discordUser.isContentManager())
            {
                $("#kog-status").html("Only one deck per month can be submitted.");
            }
            else
            {
                if(discordUser.isKoG() || discordUser.isContentManager())
                    isKogAction(discordUser.getUsername());
                else
                    isNotKogAction(discordUser.getUsername());
            }
        },
        error: function ()
        {
            $("#kog-status").html("You appear to not be a member of our discord. Only members of the DuelLinksMeta discord can submit decks here.");
        }
    });
}

/* ======================= */

/* ==== Discord Usage ==== */

var discordUser = new DiscordUser("", "", []);
var cookieManager = new ProfileCookieManager("discord-id");
var apiManager = new DiscordAPICall('Mzk4MjkwODY1NTU2MTYwNTEz.DS8Y4A.ofv3FayCq8uldaqB--FLQnFjfJk', '303175246268334082');

$(function ()
{
    //if these are defaults then they should be on the html page (faster)
    $("#deck-sub-form").addClass("hidden");
    $("#deck-sub-form :input").prop("readonly", true);

    var accessToken = apiManager.getAccessToken();

    if (accessToken)
    {
        removeAccessTokenFromURL();

        $("#discord-login-button").addClass("hidden");
        $("#kog-status").html("Checking your discord roles...");

        apiManager.getUserIDByAccessToken(function()
        {
            apiManager.getAllowedRolesID(function()
            {
                apiManager.processUserRoles(userIsKoGAction, userIsNotKoGAction);
            });
        });
    }
    else
    {
        $("#discord-login-button").removeClass("hidden");
        $("#kog-status").html("If you are a KoG member of our discord, then please log in to get access.");
    }
})

$("#SubmitDeck").click(function()
{
    if(discordUser.getID() != "" && !discordUser.isContentManager())
    {
        $("#deck-sub-form").addClass("hidden");
        $("#deck-sub-form :input").prop("readonly", true);
        $("#post-submit-message").html("Thank you very much for your deck submission! See you next month " + discordUser.getUsername() + "!");

        cookieManager.addProfile(discordUser.getID());
    }
});

function userIsKoGAction(userName)
{
    if(discordUser.isContentManager())
    {
        $("#deck-sub-form :input").prop("readonly", false);

        if(discordUser.isDev())
            $("#kog-status").html(userName + ", you are a website developer, you have open access.");
        else
            $("#kog-status").html(userName + ", you are a content creator, you have open access.");

        $("#deck-sub-form").removeClass("hidden");

    }
    else
    {
        $("#kog-status").html(userName + ", you are King Of Games this month! You can submit your deck now.");
        $("#deck-sub-form :input").prop("readonly", false);
        $("#author").prop("readonly", true);
        $("#author").val(userName);

        $("#deck-sub-form").removeClass("hidden");
    }
}

function userIsNotKoGAction(userName)
{
    $("#kog-status").html(userName + ", you are not King Of Games yet this month. Please check the discord and send us proof in the #kog-proof channel.");
    $("#deck-sub-form").addClass("hidden");
    $("#deck-sub-form :input").prop("readonly", true);
}

function removeAccessTokenFromURL()
{
    if(window.history.pushState)
        window.history.pushState({}, null, window.location.href.split("#")[0]);
}

/* ======================= */

function isSeasonEnd()
{
    var currentDate = new Date();
    var seasonEnd = new Date($("#season-end").data("date"));
        seasonEnd.setFullYear(currentDate.getFullYear());
        seasonEnd.setMonth(currentDate.getMonth());
    var seasonStart = new Date(seasonEnd.valueOf());
        seasonStart.setDate(seasonStart.getDate() + 1)

    
    

    var x = 0;
}