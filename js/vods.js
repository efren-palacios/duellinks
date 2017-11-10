$(function() {
    $.ajax({
        url: "https://api.twitch.tv/kraken/channels/149727725/videos",
        dataType: 'json',
        headers: {
            'Client-ID': '2q1w5ll1m8081afry92mq3jm9k7c7j',
            'Accept': 'application/vnd.twitchtv.v5+json'
        },
        success: function (channel) {
            channel.videos.reverse().forEach(i => {
                $('#vods').prepend("<div class='col-sm-4 col-12 card-deck header'><div class='card'><div class='zoom'><a href="+i.url+"><img class='card-img-top lazyloaded' src="+i.preview.medium+"/></div><div class='card-block'><a href="+i.url+"><h5 class='card-title text-white'>"+i.title+"</h5></a><div class='text-white'><small class='text-muted'>Uploaded: "+new Date(i.created_at)+"<br/>Views: "+i.views+" | Length: "+('0'+Math.floor(i.length/3600) % 24).slice(-2)+':'+('0'+Math.floor(i.length/60)%60).slice(-2)+':'+('0' + i.length % 60).slice(-2)+"</small></div></div></div>")
            })
        }
 })
 
 })