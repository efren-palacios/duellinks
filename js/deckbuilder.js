$(document).ready(function () {
    SortDecktypes();
    InitializeViewModel();
    GetAllCards();
    GetAllSkills();
    MakeBoxesDroppable();
    CreateTypeEnum();
    BindFormEvents();
});


//deckbuilder getDeckfromUrl
var url = new URL(window.location.href);
var saveCode = url.searchParams.get("save");

//load deckonline and add it
if (saveCode) {
    $.getJSON("https://api.myjson.com/bins/" + saveCode, function (data) {
        data.forEach(function (card) {
            AddCardToUserDeck(card);
        })
    });
}


var deckStorage = [];


function saveDeckOnline() {

    var postDataDeck = JSON.stringify(deckStorage);
    $.ajax({
        url: "https://api.myjson.com/bins",
        type: "POST",
        data: postDataDeck,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (postDataDeck, textStatus, response) {
            var rndID = response.responseJSON.uri.replace("https://api.myjson.com/bins/", "");
            document.getElementById("decklink").value = document.location.hostname + "/deckbuilder/?save=" + rndID;
        }
    });
}


function SortDecktypes() {
    var options = $("#deckType option");
    var list = options.map(function (index, option) {
        return {
            display: $(option).text(),
            value: option.value
        };
    }).get();
    list.sort(function (o1, o2) {
        return o1.display > o2.display ? 1 : o1.display < o2.display ? -1 : 0;
    });

    options.each(function (index, option) {
        option.value = list[index].value;
        $(option).text(list[index].display);
    });
}

function InitializeViewModel() {
    timeoutId = 0;

    DeckSubmissionViewModel = {
        cards: ko.observableArray(),
        searchTerm: ko.observable(""),
        filteredCards: ko.observableArray(),
        selectedMainCards: ko.observableArray(),
        selectedExtraCards: ko.observableArray(),

        GetCardUrl: function (name) {
            return GetCardUrl(name);
        }
    };

    DeckSubmissionViewModel.searchTerm.subscribe(function (searchTerm) {
        clearTimeout(timeoutId);

        if (searchTerm.length >= 2) {
            timeoutId = setTimeout(function () {
                var lowerSearchTerm = searchTerm.toLowerCase();
                var nameResults = $(DeckSubmissionViewModel.cards()).filter(function () {
                    return this.nameSearch.indexOf(lowerSearchTerm) != -1
                });
                var descResults = $(DeckSubmissionViewModel.cards()).filter(function () {
                    return this.description.indexOf(lowerSearchTerm) != -1
                });
                var mergedResults = $.unique($.merge(nameResults, descResults));
                DeckSubmissionViewModel.filteredCards(mergedResults.slice(0, 20));
                MakeCardsDraggable();
            }, 400);
        } else {
            DeckSubmissionViewModel.filteredCards([]);
        }
    });

    ko.applyBindings(DeckSubmissionViewModel);
}

function GetAllCards() {
    $.getJSON("/data/cards.json", function (data) {
        DeckSubmissionViewModel.cards(data);
    });
}

function GetAllSkills() {
    var options = {
        url: "/data/skills.json",
        getValue: "name",
        adjustWidth: false,
        list: {
            match: {
                enabled: true
            }
        }
    };

    $("#skill").easyAutocomplete(options);
}

function MakeCardsClickable() {
    $(".deck-submission").on("click", ".card-search .item", function () {
        GetCardPropertiesAndAddToUserDeck($(this).data("name"));
    });

    $(".deck-submission").on("click", "#deck-container .item", function () {
        RemoveCardFromUserDeck($(this).data("name"), $(this).data("number"));
    });
}

//todo: make it so we dont have to call this each time the search results change
function MakeCardsDraggable() {
    $(".item").draggable({
        helper: "clone",
        zIndex: 10000
    });
    updatePopupsForDesktops();
}

function MakeBoxesDroppable() {
    $("#deck-container").droppable({
        accept: ".item",
        drop: function (event, ui) {
            GetCardPropertiesAndAddToUserDeck($(ui.draggable).data("name"));
        },
        out: function (event, ui) {
            var self = ui;
            ui.helper.off('mouseup').on('mouseup', function () {

                var name = $(ui.draggable).data("name");
                var number = $(ui.draggable).data("number");

                RemoveCardFromUserDeck(name, number);
            });
        }
    });
}

function GetCardPropertiesAndAddToUserDeck(name) {
    var nextNumber = GetNextNumber(name);

    if (nextNumber <= 3) {

        $.ajax({
            type: 'GET',
            url: "https://www.ygohub.com/api/card_info?name=" + encodeURIComponent(name),
            success: function (result) {
                var data = $.parseJSON(result);

                if (data.status === "success" && CanAddCard(data.card.is_extra_deck)) {
                    var card = {
                        name: name,
                        type: GetTypeId(data.card.type),
                        attack: parseInt(data.card.attack),
                        isNormal: $.inArray("Effect", data.card.monster_types) < 0,
                        isExtra: data.card.is_extra_deck,
                        number: nextNumber
                    }

                    AddCardToUserDeck(card);
                } else if (!MainDeckIsFull()) {
                    var card = {
                        name: name,
                        type: 4,
                        attack: 0,
                        isNormal: true,
                        isExtra: false,
                        number: nextNumber
                    }

                    if (confirm("We didn't find the properties of " + name + ". This card will not be sorted correctly.")) {
                        AddCardToUserDeck(card);
                    }
                }
            },
            error: function () {
                alert("Error: ygohub.com/api unavailable.");
            }
        });
    }
}

function AddCardToUserDeck(card) {
    if (!card.isExtra) {
        DeckSubmissionViewModel.selectedMainCards.push(card);

    } else {
        DeckSubmissionViewModel.selectedExtraCards.push(card);
    }
    addCardToJson(card);
    MakeCardsDraggable();
}

//to save decks and export to playtester
function addCardToJson(card) {
    if (!deckStorage) {
        deckStorage = card;
    } else {
        deckStorage.push(card);
    }
}


//savedeck to localStorage
function savedeck(slot) {
    localStorage.setItem(slot, JSON.stringify(deckStorage));
}

//load Deck from Storage
function loaddeck(slot) {
    var loadedDeckData = JSON.parse(localStorage.getItem(slot));
    loadedDeckData.forEach(function (card) {
        AddCardToUserDeck(card);
    })
}
//push current deck to playtester
function pushToPlaytester() {
    var playtesterImportStr = "[";
    var index;
    for (index = 0; index < deckStorage.length; ++index) {
        if (index == deckStorage.length - 1) {
            if (deckStorage[index].isExtra == true) {
                playtesterImportStr = playtesterImportStr + '{"name":"' + encodeURI(deckStorage[index].name) + '","deck":1,"amount":1}';
            } else {
                playtesterImportStr = playtesterImportStr + '{"name":"' + encodeURI(deckStorage[index].name) + '","deck":0,"amount":1}';
            }
        } else {
            if (deckStorage[index].isExtra == true) {
                playtesterImportStr = playtesterImportStr + '{"name":"' + encodeURI(deckStorage[index].name) + '","deck":1,"amount":1},';
            } else {
                playtesterImportStr = playtesterImportStr + '{"name":"' + encodeURI(deckStorage[index].name) + '","deck":0,"amount":1},';
            }
        }
    }

    /*deckStorage.forEach(function(card){
        playtesterImportStr = playtesterImportStr + '{"name":"'+card.name+'","deck":0,"amount":1}';
    })*/

    playtesterImportStr = playtesterImportStr + "]";
    console.log(playtesterImportStr);
    importDeck(JSON.parse(playtesterImportStr));
}

//deckBuilder remove card json

function removeStoredCard(name) {
    for (index = 0; index < deckStorage.length; ++index) {
        if (deckStorage[index].name == name) {
            deckStorage.splice(index, 1);
            break;
        }
    }
}


function RemoveCardFromUserDeck(name) {

    removeStoredCard(name);

    DeckSubmissionViewModel.selectedMainCards.remove(function (card) {
        return card.name == name && card.number === number;
    });

    DeckSubmissionViewModel.selectedExtraCards.remove(function (card) {
        return card.name == name && card.number === number;
    });
}

function RemoveCardFromUserDeck(name, number) {

    removeStoredCard(name);


    DeckSubmissionViewModel.selectedMainCards.remove(function (card) {
        return card.name == name && card.number === number;
    });

    DeckSubmissionViewModel.selectedExtraCards.remove(function (card) {
        return card.name == name && card.number === number;
    });
}

function GetNextNumber(name) {
    var cards = $(DeckSubmissionViewModel.selectedMainCards()).filter(function () {
        return this.name === name;
    });

    var extraCards = $(DeckSubmissionViewModel.selectedExtraCards()).filter(function () {
        return this.name === name;
    });

    $.merge(cards, extraCards);

    if (cards.length === 0) {
        return 1;
    } else {
        numbers = cards.map(function () {
            return this.number;
        });

        for (var i = 1; i <= 3; i++) {
            if ($.inArray(i, numbers) < 0) {
                return i;
            }
        }

        return Math.max.apply(Math, numbers) + 1;
    }
}

function CanAddCard(isExtraDeck) {
    return (!isExtraDeck && !MainDeckIsFull()) || (isExtraDeck && !ExtraDeckIsFull());
}

function MainDeckIsFull() {
    return DeckSubmissionViewModel.selectedMainCards().length >= 30;
}

function ExtraDeckIsFull() {
    return DeckSubmissionViewModel.selectedExtraCards().length >= 5;
}

function SortDeck(a, b) {
    var typeResult = (a.type > b.type) ? 1 : ((a.type < b.type) ? -1 : 0);
    if (typeResult != 0) return typeResult;

    if (a.type === 1 && b.type === 1) {
        var normalResult = (a.isNormal > b.isNormal) ? 1 : ((a.isNormal < b.isNormal) ? -1 : 0);
        if (normalResult != 0) return normalResult;

        var attackResult = (a.attack < b.attack) ? 1 : ((a.attack > b.attack) ? -1 : 0);
        if (attackResult != 0) return attackResult;
    }

    var nameResult = (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0);
    return nameResult;
}

function CreateTypeEnum() {
    cardTypes = [{
        id: 1,
        name: "Monster"
    }, {
        id: 2,
        name: "Spell"
    }, {
        id: 3,
        name: "Trap"
    }];
}

function GetTypeId(typeName) {
    var types = $(cardTypes).filter(function () {
        return this.name === typeName;
    });
    return types.length > 0 ? types[0].id : -1;
}

function GetTypeName(typeId) {
    var types = $(cardTypes).filter(function () {
        return this.id === typeId;
    });
    return types.length > 0 ? types[0].name : "";
}