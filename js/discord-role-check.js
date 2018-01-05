var discordId = '303175246268334082'; // DLM server Id
var botToken = 'Mzk4MjkwODY1NTU2MTYwNTEz.DS8Y4A.ofv3FayCq8uldaqB--FLQnFjfJk'; // Token for the Discord BOT - pll one

var savedUserId = -1;
var savedUserDevRole = false;

$(function () {
    $("#deck-sub-form").addClass("hidden");
    $("#deck-sub-form :input").prop('readonly', true);

    var accessToken = getAccessTokenFromURL();
    var hasAccessToken = accessToken ? true : false;

    if (hasAccessToken) {
        $("#discord-login-button").addClass("hidden");
        $("#kog-status").html("Checking your discord roles...");
        getDiscordInformationAboutUser(accessToken, userIsKoGAction, userIsNotKoGAction);

        if(window.history.pushState)
            window.history.pushState({}, null, window.location.href.split("#")[0]);
    }else{
        $("#discord-login-button").removeClass("hidden");
        $("#kog-status").html("Only KoG memebers can submit decks to this page. Login to discord to get access.");
    }
})

$("#SubmitDeck").click(function(){
    if(savedUserId != 1 && !savedUserDevRole){
        $("#deck-sub-form").addClass("hidden");
        $("#deck-sub-form :input").prop('readonly', true);
        $("#post-submit-message").html("Thank you very much for your deck submission!");

        var cookies = getCookie("discord-id");
        if(cookies){
            var cookiesJson = JSON.parse(getCookie("discord-id"));

            if($.inArray(savedUserId, cookiesJson) === -1){
                setCookie("discord-id", JSON.stringify(cookiesJson));
            }
        }else{
            setCookie("discord-id", JSON.stringify([savedUserId]));
        }
    }
});

function userIsKoGAction(userName){
    if(savedUserDevRole){
        $("#kog-status").html(userName + ", you are a content manager, you have open access.");
        $("#deck-sub-form").removeClass("hidden");
        $("#deck-sub-form :input").prop('readonly', false);
    }else{
        $("#kog-status").html(userName + ", you are King Of Games this month!");
        $("#deck-sub-form").removeClass("hidden");
        $("#deck-sub-form :input").prop('readonly', false);
        $("#author").prop('readonly', true);
        $("#author").val(userName);
    }
}

function userIsNotKoGAction(userName){
    $("#kog-status").html(userName + ", you not are King Of Games this month!");
    $("#deck-sub-form").addClass("hidden");
    $("#deck-sub-form :input").prop('readonly', true);
}

function getAccessTokenFromURL() {
    var url = window.location.href;
    var accessToken1 = url.split("#access_token=")[1];
    if (accessToken1) {
        var accessToken2 = accessToken1.split("&")[0];
        return accessToken2;
    } else {
        return "";
    }
}

/*
    Gets basic user information and proceeds to get the information about roles in the discord
*/
function getDiscordInformationAboutUser(accessToken, isKogAction, isNotKogAction) {
    $.ajax({
        type: 'GET',
        url: "https://discordapp.com/api/users/@me",
        headers: { "Authorization": "Bearer " + accessToken },
        success: function (result) {
            var userId = result['id'];
            savedUserId = userId;

            processUserCallback(result['id'], isKogAction, isNotKogAction);
        },
        error: function () {
            // Do something when the access token is not valid
            $("#kog-status").html("Login to discord to check your KoG status");
        }
    });
}

/*
    Gets the ID of the roles allowed to post decklist and proceeds to the function that gets information about the user in the discord
*/
function processUserCallback(userId, isKogAction, isNotKogAction) {
    var allowedRoles = ['king of games', 'dkayed', 'website devs', 'content manager'];

    $.ajax({
        type: 'GET',
        url: "https://discordapp.com/api/guilds/" + discordId,
        headers: { "Authorization": "Bot " + botToken },
        success: function (result) {
            var allowedRolesId = [];
            for (var i = 0; i < result['roles'].length; i++) {
                if ($.inArray(result['roles'][i]['name'].toLowerCase(), allowedRoles) !== -1) {
                    allowedRolesId.push({
                        name: result['roles'][i]['name'],
                        id: result['roles'][i]['id']
                    });
                }
            }

            getUserInformation(userId, allowedRolesId, isKogAction, isNotKogAction);
        },
        error: function () {
            // Do something
            $("#kog-status").html("Internal error.");
        }
    });
}

/*
    Checks if the user has any of the correct roles in the discord
*/
function getUserInformation(userId, allowedRoles, isKogAction, isNotKogAction) {
    $.ajax({
        type: 'GET',
        url: "https://discordapp.com/api/guilds/" + discordId + "/members/" + userId,
        headers: { "Authorization": "Bot " + botToken },
        success: function (result) {
            var isKoG = false;
            var userRoles = [];
            for (var i = 0; i < result['roles'].length; i++) {
                for(var j = 0; j < allowedRoles.length; j++){
                    if(allowedRoles[j].id == result['roles'][i]){
                        userRoles.push(allowedRoles[j].name.toLowerCase());
                        isKoG = true;
                    }
                }
            }

            var isUserDev = $.inArray('website devs', userRoles) !== -1 || $.inArray('dkayed', userRoles) !== -1 || $.inArray('content manager', userRoles) !== -1;

            savedUserDevRole = isUserDev;

            var cookie = getCookie("discord-id");

            if(cookie && !isUserDev){
                var idsInCookie = JSON.parse(cookie);
                if($.inArray(userId, idsInCookie) !== -1){
                    $("#kog-status").html("You can only submit one deck per month.");
                }else{
                    if(isKoG) isKogAction(result['user']['username']);
                    else isNotKogAction(result['user']['username']);
                }
            }else{
                if(isKoG) isKogAction(result['user']['username']);
                else isNotKogAction(result['user']['username']);
            }
        },
        error: function () {
            // Do something
            $("#kog-status").html("Your are not in the DLM Discord.");
        }
    });
}

function getCookie(cname) {
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

function setCookie(cname, cvalue) {
    console.log(cvalue);
    var d = new Date();
    var currentMonth = d.getMonth();
    var currentYear = d.getFullYear();

    var nextMonthDate = new Date(currentYear, currentMonth + 1, 0, 0, 0, 0, 0); // Already accounts for year change

    var expires = "expires="+ nextMonthDate.toUTCString();
    console.log(cname + "=" + cvalue + ";" + expires + ";path=/");
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}