// Channel ID = 149727725

$(function() {
   $.ajax({
       url: "https://api.twitch.tv/kraken/channels/149727725",
       dataType: 'json',
       headers: {
           'Client-ID': '2q1w5ll1m8081afry92mq3jm9k7c7j',
           'Accept': 'application/vnd.twitchtv.v5+json'
       },
       success: function (channel) {
        if (channel['stream'] == null) {
            //console.log("stream offline")
        } else {
            //console.log("stream online")
        }
       }
})

})