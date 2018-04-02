$(function() {
    $.ajax({
        url: "https://api.twitch.tv/kraken/channels/149727725/videos",
        dataType: 'json',
        headers: {
            'Client-ID': '2q1w5ll1m8081afry92mq3jm9k7c7j',
            'Accept': 'application/vnd.twitchtv.v5+json'
        },
        success: function (channel) {
            $.each(channel.videos.reverse(), function(i, item) {
                $('#vods').prepend(`<div class='col-sm-4 col-12 card-deck header'><div class='card'><div class='zoom'><a target='_blank' href="${item.url}"><img class='card-img-top lazyloaded' src="${item.preview.medium}"/></div><div class='card-block'><a target='_blank' href="${item.url}"><h5 class='card-title text-white'>${item.title}</h5></a><div class='text-white'><small class='text-muted'>Uploaded: ${moment(item.created_at).format('MMMM Do')}<br/>Views: ${item.views} | Length: ${('0'+Math.floor(item.length/3600) % 24).slice(-2)+':'+('0'+Math.floor(item.length/60)%60).slice(-2)+':'+('0' + item.length % 60).slice(-2)}</small></div></div></div>`)
            })
        }
 })
 
 $.ajax({
     url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=UUz_cNcJzCy4asffzW5ERH1w&key=AIzaSyAfhx-IxhZeex3Gmk6I1oMGN2OANo4h4Dw",
     dataType: 'json',
     success: function (channel) {
         var output;
         $.each(channel.items.reverse(), function (i, item) {
             $('#youtube').prepend(`<div class='col-sm-4 col-12 card-deck header'><div class='card'><div class='zoom'><a target='_blank' href="https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}"><img class='card-img-top lazyloaded' src="${item.snippet.thumbnails.medium.url}"/></div><div class='card-block'><a target='_blank' href="https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}"><h5 class='card-title text-white'>${item.snippet.title}</h5></a><div class='text-white'><small class='text-muted'>Uploaded: ${moment(item.snippet.publishedAt).format('MMMM Do')}</small></div></div></div>`)
         })
     }
 })

 })