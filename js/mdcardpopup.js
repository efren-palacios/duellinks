$(function(){
    $("p").each(function(){
        var text = $(this).text();

        var startInd = [];
        var endInd = [];

        for(var i = 0; i < text.length; i++){
            if(text[i] == "{"){
                startInd.push(i);
            }else if(text[i] == "}"){
                endInd.push(i);
            }
        }

        for(var i = 0; i < startInd.length; i++){
            let start = startInd[i];
            let end = endInd[i];

            let cardName = text.substr(start + 1, end - start - 1);
            
            let html = $(this).html();

            html = html.replace("{" + cardName + "}", cardNameToCardPopup(cardName))

            $(this).html(html);
        }
    });

    rerunDeckMaker();
});

function cardNameToCardPopup(cardName){
    return '<span class="card-hover" src="https://yugiohprices.com/api/card_image/' + cardName + '">' + cardName + '</span><span class="mobile"></span>';
}

function rerunDeckMaker(){
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = window.location.hostname + '/js/deckmaker.js';
    head.appendChild(script);
}