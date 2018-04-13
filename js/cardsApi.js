// TODO: Rename this since the skill API is added? 

/* 
 * This API is used to access a card's data
 */ 
function CardsAPI() { 

    // TODO: Rename this since the skill API is added? 

    /*
     * This function searches a given card name and returns its information
     * using the Card object.  
     * 
     * @param cardName The name of the card to search
     * @param callback Function to execute once the data is retrieved
     * 
     * @return Card An object containing the information, if available (if not, the 
     *              object will be null)
     * 
     * Card - This is object is used to store the data retrieved from a card search    
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
     *        the phrase 'Needs to be Added' will be placed inside); in addition,
     *        this value is an array, so if more than one location is available, it
     *        will be inserted   
     */  
    this.search = function(cardName, callback) {
        let cardobtain = $.getJSON("/data/cardObtain.json").then(function(r) {
            if(r) {
                var filteredCards = [];
                $(r).each(function(index, card) {
                    if(card.name == cardName) {
                        filteredCards.push(card);
                    }
                });
                return filteredCards;
            }
            else {
                return [];
            }
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
        
        var self = this;
        Promise.all([cardobtain, cardinfo]).then(function(response) {
            var card = new Object();

            self.obtainCardData = response[1];
            self.obtainCardName = cardName;

            card.name = cardName;
            card.rarity = response[0].length > 0 ? response[0][0].rarity : "";
            card.attribute = self.obtainCardProperty('family') != 'null' ? self.obtainCardProperty('family') : "";
            card.level = self.obtainCardProperty('level') != 'null' ? self.obtainCardProperty('level') : "";
            if(self.obtainCardProperty('type') && self.obtainCardProperty('type').includes("Fusion")) {
                var cardTextArray = self.obtainCardProperty('text').split('\n');
                card.materials = cardTextArray[0];
                card.description = cardTextArray[2];
            } 
            else {
                card.description = self.obtainCardProperty('text');
                card.materials = "";
            }
            if(self.obtainCardProperty('card_type') == "monster") {
                card.type = self.obtainCardProperty('type');
            }
            else {
                card.type = self.obtainCardProperty('card_type') + " / " + self.obtainCardProperty('property');
            }
            card.attack = self.obtainCardProperty('atk') != 'null' ? self.obtainCardProperty('atk') : "";
            card.defense = self.obtainCardProperty('def') != 'null' ? self.obtainCardProperty('def') : "";
            if(response[0].length > 0) {
                card.obtain = [];
                $(response[0]).each(function(index, obtainCard) {
                    card.obtain.push(obtainCard.how);
                }); 
            }
            else {
                card.obtain = ["Needs to be Added"];
            }

            callback(card);    
        });
    },

    /*
     * This function is used to search for a skill, returning the findings 
     * through a callback function. 
     * 
     * @param skillName - The name of the skill to be searched
     * @param callback - The function to return the data, once searched
     * 
     * @return Skill - Object containing the information of the skill; if 
     *                 not found, null is returned 
     * 
     * Skill - This object contains a list of parameters for a skill
     * 
     * name - Name of the skill
     * description - Description of the skill  
     * exclusive - Whether or not this skill is exclusive to a character (true/false)
     * character - If the skill is exclusive, then this will be the name of the that character (else, empty string) 
     * imageURL - URL to obtain the image of the skill, depending on its exclusivity
     */ 
    this.searchSkill = function(skillName, callback) {
        $.getJSON(getWebsiteLink() + "/data/skills.json").then( function( response ) {
            var skill = new Object();
            for(var i = 0; i < response.length; i++) {
                if(response[i].name.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase() == skillName.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase()) {
                    skill.name = response[i].name;
                    skill.description = response[i].desc;
                    skill.exclusive = response[i].exclusive;
                    skill.character = response[i].character;                       

                    break;
                }
            }
            
            if(skill.name.length == 0) {
                // Skill not found, return null
                callback(null);
            }
            else {
                skill.imageURL = getWebsiteLink() + "/img/characters/portrait-" + (skill.exclusive == true ? skill.character.toLowerCase().replace(" ", "-"): 'vagabond') + ".png";
                callback(skill);
            }
        });    
    },

    /*
     * This function iterates through each image on the page and updates its
     * 'src' location depending on an array of card names that need a localized
     * image.
     */  
    this.setImageFilters = function() {
        var self = this;
        $('.item img.dcards').each(function( index, element ) {
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
        for(var index = 0; index < cardImageFilter.length; index++) {
            if(cardImageFilter[index].name == cardName) {
                return cardImageFilter[index].customURL;
            }    
        }    

        return "https://images.weserv.nl/?url=yugiohprices.com/api/card_image/" + encodeURIComponent(cardName) + '&il';
    },

    /*
     * Used in the 'obtainCardProperty' method for the returned card 
     * data from the API 
     * 
     * (Note: This object should be treated as private)
     */ 
    this.obtainCardData = [],

    /*
     * This object is used by the 'obtainCardProperty' as the card 
     * searched against for the filter 
     * 
     * (Note: This object should be treated as private)
     */ 
    this.obtainCardName = "",

    /*
     * This method returns the asked property of a card, whether it was
     * derived from the given data array or a custom array of data for 
     * that card 
     * 
     * (Note: This method should be treated as private, as it needs the
     * returned card data to function)   
     * 
     * @param property String representation of the property asked 
     */ 
    this.obtainCardProperty = function(property) {
        var self = this;
        var cardProperty; 
        $(cardDataFilter).each(function(index, card) {
            if(self.obtainCardName == card.name) {
                cardProperty = card[property];
                return false;
            }
        });
        if(cardProperty) return cardProperty;

        if(this.obtainCardData['data']) {
            return this.obtainCardData.data[property];
        }
        else {
            return "null";
        }
    }
};

var cardImageFilter;
$(document).ready(function() {
    $.getJSON("/data/cardImageFilter.json", function(data){
        cardImageFilter = data;

        new CardsAPI().setImageFilters();
    });
}); 

var cardDataFilter;
$(document).ready(function() {
    $.getJSON("/data/cardDataFilter.json", function(data){
        cardDataFilter = data;
    });
}); 