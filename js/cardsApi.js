/* 
 * This API is used to access a card's data
 */ 
function CardsAPI() { 

    /*
     * This function searches a given card name and returns its information
     * using the Card object.  
     * 
     * @param cardName The name of the card to search
     * @param callback Function to execute once the data is retrieved
     * 
     * @return Card An object containing the information, if available (if not, the 
     *              object will be null)  
     */  
    this.search = function(cardName, callback) {
        let websiteLink = getWebsiteLink();

        let cardobtain = axios.get(websiteLink + "/data/cardObtain.json").then(function(r) {
            return r.data.filter(i => i.name == cardName)[0] || new Error('No Resource')
        });
        let cardinfo = JSON.parse(sessionStorage.getItem(cardName));
        
        var cardNameEncoded = encodeURIComponent(cardName);
        if (!cardinfo) {
            cardinfo = $.getJSON("https://query.yahooapis.com/v1/public/yql", {
                q:      "select * from json where url=\"https://yugiohprices.com/api/card_data/" + cardNameEncoded + "?fmt=JSON\"",
                format: "json"
            }).then(function(r) {
                sessionStorage.setItem(cardName, JSON.stringify(r.query.results.json));
                return r.query.results.json;
            });
        }
        
        Promise.all([cardobtain, cardinfo]).then(function(response) {
            var card = new Card();

            card.name = cardName;
            card.rarity = response[0].rarity ? response[0].rarity : "";
            card.attribute = response[1].data.family != 'null' ? response[1].data.family : "";
            card.level = response[1].data.level != 'null' ? response[1].data.level : "";
            if(response[1].data.type && response[1].data.type.includes("Fusion")) {
                var cardTextArray = response[1].data.text.split('\n');
                card.materials = cardTextArray[0];
                card.description = cardTextArray[2];
            } 
            else {
                card.description = response[1].data.text;
            }
            if(response[1].data.card_type == "monster") {
                card.type = response[1].data.type;
            }
            else {
                card.type = response[1].data.card_type + " / " + response[1].data.property;
            }
            card.attack = response[1].data.atk != 'null' ? response[1].data.atk : "";
            card.defense = response[1].data.def != 'null' ? response[1].data.def : "";
            card.obtain = response[0].how ? response[0].how : "Needs to be Added";

            callback(card);    
        });
    },

    /*
     * This function iterates through each image on the page and updates its
     * 'src' location depending on an array of card names that need a localized
     * image.
     */  
    this.setImageFilters = function() {
        var self = this;
        $('img').each(function( index, element ) {
            if($(element).attr('src') != undefined && $(element).attr('src').includes('https://images.weserv.nl/?url=yugiohprices.com/api/card_image/')) {
                var slicedSrc = $(element).attr('src').replace("https://images.weserv.nl/?url=yugiohprices.com/api/card_image/", "").replace("&il", "");
                var cardName = decodeURIComponent(slicedSrc);
                var updatedURL = self.getImageURL(cardName);
                if(updatedURL != $(element).attr('src')) {
                    $(element).attr('src', updatedURL);
                }
            }
        });
    },

    /*
     * This function returns a URL to obtain an image from, given a 
     * card name. 
     * 
     * @param cardName Name of the card
     * 
     * @return String URL of the for the image
     */ 
    this.getImageURL = function( cardName ) {
        for(var index = 0; index < this.filters.length; index++) {
            if(this.filters[index].name == cardName) {
                return this.filters[index].customURL;
            }    
        }    

        return "https://images.weserv.nl/?url=yugiohprices.com/api/card_image/" + encodeURIComponent(cardName) + '&il';
    },

    /*
     * List of card image that need to be updated due to its 
     * incorrect image from the default server 
     * 
     * name Name of the card
     * customURL String representation of the URL to obtain this image from
     */ 
    this.filters = [
        {
            name: "Enchanted Javelin",
            customURL: "/img/assets/enchantedJavelin.jpg"
        }
    ]
};

/*
 * This is object is used to store the data retrieved from a card search    
 *  
 * name The name of the card 
 * rarity A card's rarity value (i.e. 'N' for Normal, 'UR' for Ultra Rare, etc.)
 * attribute A card's attribute value (i.e. 'Wind', 'Light', etc.)
 * level The amount of stars a card has (only applies to monster type cards)
 * materials The monsters needed to summon this card (fusion materials)
 * description The description of the card
 * type A card's type (i.e. 'Spell', 'Trap', "Winged Beast", etc.)
 * attack A card's attack points (only applies to monsters)
 * defense A card's defense points (only applies to monsters)
 * obtain How/where to obtain this card within the game (if not available, 
 *        the phrase 'Needs to be Added' will be placed inside) 
 */ 
function Card() { 
    this.name = "";
    this.rarity = "";
    this.attribute = "";
    this.level = "";
    this.materials = "";
    this.description = "";
    this.type = "";
    this.attack = "";
    this.defense = "";
    this.obtain = "";

    return this;
}



