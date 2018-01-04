$(function() {
    var accessToken = getAccessTokenFromURL();

    if(accessToken){
        $("#kog-status").html("Checking your discord roles...");

        getKoGInformationAboutUser(accessToken, 
            function (userName){ // is KoG action
                $("#kog-status").html(userName + ", you are King Of Games this month!");
            },
            function(userName){ // is not KoG action
                $("#kog-status").html(userName + ", you are not King Of Games this month.");
            }
        );
    }else{
        $("#kog-status").html("Login to discord to check your KoG status");
    }
})


function getAccessTokenFromURL(){
    var url = window.location.href;
    var accessToken1 = url.split("#access_token=")[1];
    if(accessToken1){
        var accessToken2 = accessToken1.split("&")[0];
        return accessToken2;
    }else{
        return "";
    }
}

function getKoGInformationAboutUser(accessToken, isKogAction, isNotKogAction){
    $.ajax({
        type: 'GET',
        url: "https://discordapp.com/api/users/@me",
        headers: { "Authorization": "Bearer " + accessToken },
        success: function(result){
            processUserCallback(result['id'], isKogAction, isNotKogAction);
        },
        error: function(){
            // Do something when the access token is not valid
            $("#kog-status").html("Login to discord to check your KoG status");
        }
    });
}

function processUserCallback(userId, isKogAction, isNotKogAction){
    var discordId = '303175246268334082'; // DLM server Id
    var botToken = 'Mzk4MjkwODY1NTU2MTYwNTEz.DS8Y4A.ofv3FayCq8uldaqB--FLQnFjfJk'; // Token for the Discord BOT - pll one

    var kogRoleId = '396825648728899606';  

    $.ajax({
        type: 'GET',
        url: "https://discordapp.com/api/guilds/" + discordId + "/members/" + userId,
        headers: { "Authorization": "Bot " + botToken },
        success: function(result){
            var isKoG = false;
            for(var i = 0; i < result['roles'].length; i++){
                if(result['roles'][i] == kogRoleId){
                    isKogAction(result['user']['username']);
                    isKoG = true;
                    break;
                }
            }
            if(!isKoG)
                isNotKogAction(result['user']['username']);
        },
        error: function(){
            // Do something
            $("#kog-status").html("Your are not in the DLM Discord.");
        }
    });
}