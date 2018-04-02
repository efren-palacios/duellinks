// STYLING NOTATION - [style]Text
var stylingNotationStart = "[";
var stylingNotationEnd = "]";
var stylingClasses = { // markdown tag: css class
    //"center": "mdstyle-center"
};

// CARD NAME NOTATION - {Card Name}
var cardNameNotationStart = "{";
var cardNameNotationEnd = "}";

$(function(){
    $("p, h1, h2, h3, h4, h5, li").each(function(){
        var text = $(this).text();

        // Card name positions
        var cardNamePositons = [];

        // Styling positions 
        var stylingPositions = [];

        var lastCardNameTagOpen = -1;
        var lastStyleTagOpen = -1;
        for(var i = 0; i < text.length; i++){
            // CHECK FOR CARD NAME
            if(text[i] == cardNameNotationStart){
                lastCardNameTagOpen = i;
            }            
            else if(text[i] == cardNameNotationEnd && lastCardNameTagOpen >= 0){
                cardNamePositons.push({
                    start: lastCardNameTagOpen,
                    end: i,
                    name: text.substr(lastCardNameTagOpen + 1, i - lastCardNameTagOpen - 1)
                });

                lastCardNameTagOpen = -1;
            }

            // CHECK FOR STYLING TAG - Only in the start of a paragraph/title
            if(i == 0 && text[i] == stylingNotationStart){
                lastStyleTagOpen = i;
            }else if(lastStyleTagOpen >= 0 && text[i] == stylingNotationEnd){
                let tag = text.substr(lastStyleTagOpen + 1, i - lastStyleTagOpen - 1);

                if(tag in stylingClasses){
                    stylingPositions.push({
                        start: lastStyleTagOpen,
                        end: i,
                        tag: tag,
                        inTagText: text.substr(i + 1, text.length - lastStyleTagOpen)
                    });
                }

                lastStyleTagOpen = -1;
            }
        }

        let html = $(this).html();

        // Replace {Card Name} with the appropriate HTML tag for the card hover
        for(var i = 0; i < cardNamePositons.length; i++){
            let textToRepace = cardNameNotationStart + cardNamePositons[i].name + cardNameNotationEnd;
            html = html.replace(textToRepace, cardNameToCardPopup(cardNamePositons[i].name))
        }

        // Replace the "[style]Text" to the appropriate HTML tag correspondent to the styling
        for(var i = 0; i < stylingPositions.length; i++){
            let tag = stylingPositions[i].tag;
            let inTagText = stylingPositions[i].inTagText;
            let textToRepace = stylingNotationStart + tag + stylingNotationEnd + inTagText;
            console.log(stylingTagToStyledText(inTagText, tag));
            html = html.replace(textToRepace, stylingTagToStyledText(inTagText, tag))
        }

        $(this).html(html);
    });
});

function cardNameToCardPopup(cardName){
    return '<span class="card-hover" src="https://yugiohprices.com/api/card_image/' + cardName + '">' + cardName + '</span><span class="mobile"></span>';
}

function stylingTagToStyledText(text, tag){
    return '<span class="' + stylingClasses[tag] + '">' + text + "</span>";
}