$(document).ready(function()
{
    GetCardApi();
    GetCards();
});

function GetCardApi()
{
    $.getJSON("/data/card-api.json", function(data)
    {
        cardApi = data;
    });
}

function GetCards()
{
    $.getJSON("/data/cards-dl.json", function(data)
    {
        cards = data;
    });
}

function GetCardUrl(name)
{
    var invalidChars = [" ", "-", ":", "#", "\"", "/"];

    $.each(invalidChars, function(index, value)
    {
        var regex = new RegExp(value, "g");
        name = name.replace(regex, "_");
    });

    return cardApi.replace("[name]", name);
}




/*function GetCardImageUrlByCardName(name)
{
    var urlKonami = "https://www.konami.com/yugioh/duel_links/en/box/cards/en/{id}.jpg";
    var urlStudio = "https://static-3.studiobebop.net/ygo_data/card_images/{name}.jpg";
    var urlYgoHub = "https://www.ygohub.com/api/card_info?name={name}";
    
    var idResult = GetDuelLinksIdByCardName(name);

    if(idResult !== false)
    {
        var url = urlKonami.replace("{id}", idResult);

        UrlExists(url, function(success)
        {
            if (success) { alert(name + ': Yay!'); }
            else { alert(name + ': Oh no!'); }
        });

        if(UrlExists(url))
            alert("yay");
        else
            alert("aww");
    }
    else
    {
        return "404";
    }
}

function GetDuelLinksIdByCardName(name)
{
    var result = $(cards).filter(function(index, value)
    {
        return value.name === name;
    });

    if($(result).length >= 1)
    {
        return $(result)[0].id;
    }
    else
    {
        return false;
    }
}

function UrlExists(url)
{
    $("#card-test").attr("src", url);

    setTimeout(function()
    {
        return $("#card-test").width() !== 0;
    }, 2000);
    
    
    $.ajax(
    {
        type: 'HEAD',
        dataType: "image/jpeg",
        url: url,
        success: function() { callback(true); },
        error: function() { callback(false); }
    });
}*/