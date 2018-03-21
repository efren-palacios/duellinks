$(document).ready(function()
{
    SortDecktypes();
    InitializeViewModel();
    GetAllCards();
    GetAllSkills();
    MakeBoxesDroppable();
    CreateTypeEnum();
    BindFormEvents();

    setDiscordAuthURL();
});

function SortDecktypes()
{
    var options = $("#deckType option");
    var list = options.map(function(index, option) { return { display: $(option).text(), value: option.value }; }).get();
    list.sort(function(o1, o2) { return o1.display > o2.display ? 1 : o1.display < o2.display ? -1 : 0; });
    
    options.each(function(index, option)
    {
      option.value = list[index].value;
      $(option).text(list[index].display);
    });
}

function InitializeViewModel()
{
    timeoutId = 0;

    DeckSubmissionViewModel =
    {
        cards: ko.observableArray(),
        searchTerm: ko.observable(""),
        filteredCards: ko.observableArray(),
        selectedMainCards: ko.observableArray(),
        selectedExtraCards: ko.observableArray(),

        GetCardUrl: function(name)
        {
            return GetCardUrl(name);
        }
    };

    DeckSubmissionViewModel.searchTerm.subscribe(function(searchTerm)
    {
        clearTimeout(timeoutId);

        if(searchTerm.length >= 2)
        {
            timeoutId = setTimeout(function()
            {
                var lowerSearchTerm = searchTerm.toLowerCase();
                var nameResults = $(DeckSubmissionViewModel.cards()).filter(function(){ return this.nameSearch.indexOf(lowerSearchTerm) != -1});
                var descResults = $(DeckSubmissionViewModel.cards()).filter(function(){ return this.description.indexOf(lowerSearchTerm) != -1});
                var mergedResults = $.unique($.merge(nameResults, descResults));
                DeckSubmissionViewModel.filteredCards(mergedResults.slice(0, 20));
                MakeCardsDraggable();
            }, 400);
        }
        else
        {
            DeckSubmissionViewModel.filteredCards([]);
        }
    });
    
    ko.applyBindings(DeckSubmissionViewModel);
}

function GetAllCards()
{
    $.getJSON("/data/cards.json", function(data)
    {
        DeckSubmissionViewModel.cards(data);
    });
}

function GetAllSkills()
{
    var options =
    {
        url: "/data/skills.json",
        getValue: "name",
        adjustWidth: false,
        list: { match: { enabled: true } }
    };

    $("#skill").easyAutocomplete(options);
}

function MakeCardsClickable()
{
    $(".deck-submission").on("click", ".card-search .item", function()
    {
        GetCardPropertiesAndAddToUserDeck($(this).data("name"));
    });

    $(".deck-submission").on("click", "#deck-container .item", function()
    {
        RemoveCardFromUserDeck($(this).data("name"), $(this).data("number"));
    });
}

//todo: make it so we dont have to call this each time the search results change
function MakeCardsDraggable()
{
    $(".item").draggable({helper: "clone", zIndex: 10000});
}

function MakeBoxesDroppable()
{
    $("#deck-container").droppable(
    {
        accept: ".item",
        drop: function(event, ui)
        {
            GetCardPropertiesAndAddToUserDeck($(ui.draggable).data("name"));
        },
        out: function (event, ui)
        {
            var self = ui;
            ui.helper.off('mouseup').on('mouseup', function ()
            {
                
                var name = $(ui.draggable).data("name");
                var number = $(ui.draggable).data("number");

                RemoveCardFromUserDeck(name, number);
            });
        }
    });
}

function GetCardPropertiesAndAddToUserDeck(name)
{
    var nextNumber = GetNextNumber(name);
    
    if(nextNumber <= 3)
    {
        $.ajax(
        {
            type: 'GET',
            url: "https://www.ygohub.com/api/card_info?name=" + encodeURIComponent(name),
            success: function (result)
            {
                var data = $.parseJSON(result);

                if(data.status === "success" && CanAddCard(data.card.is_extra_deck))
                {
                    var card = 
                    {
                        name: name,
                        type: GetTypeId(data.card.type),
                        attack: parseInt(data.card.attack),
                        isNormal: $.inArray("Effect", data.card.monster_types) < 0,
                        isExtra: data.card.is_extra_deck,
                        number: nextNumber
                    }

                    AddCardToUserDeck(card);
                }
                else if(!MainDeckIsFull())
                {
                    var card = 
                    {
                        name: name,
                        type: 4,
                        attack: 0,
                        isNormal: true,
                        isExtra: false,
                        number: nextNumber
                    }

                    if (confirm("We didn't find the properties of " + name + ". This card will not be sorted correctly."))
                    {
                        AddCardToUserDeck(card);
                    }
                }
            },
            error: function ()
            {
                alert("Error: ygohub.com/api unavailable.");
            }
        });
    }
}

function AddCardToUserDeck(card)
{
    if(!card.isExtra)
    {
        DeckSubmissionViewModel.selectedMainCards.push(card);
    }
    else
    {
        DeckSubmissionViewModel.selectedExtraCards.push(card);
    }

    MakeCardsDraggable();
}

function RemoveCardFromUserDeck(name)
{
    DeckSubmissionViewModel.selectedMainCards.remove(function(card)
    {
        return card.name == name && card.number === number;
    });

    DeckSubmissionViewModel.selectedExtraCards.remove(function(card)
    {
        return card.name == name && card.number === number;
    });
}

function RemoveCardFromUserDeck(name, number)
{
    DeckSubmissionViewModel.selectedMainCards.remove(function(card)
    {
        return card.name == name && card.number === number;
    });

    DeckSubmissionViewModel.selectedExtraCards.remove(function(card)
    {
        return card.name == name && card.number === number;
    });
}

function GetNextNumber(name)
{
    var cards = $(DeckSubmissionViewModel.selectedMainCards()).filter(function()
    {
        return this.name === name;
    });

    var extraCards = $(DeckSubmissionViewModel.selectedExtraCards()).filter(function()
    {
        return this.name === name;
    });

    $.merge(cards, extraCards);

    if(cards.length === 0)
    {
        return 1;
    }
    else
    {
        numbers = cards.map(function(){return this.number;});

        for(var i = 1; i <= 3; i++)
        {
            if($.inArray(i, numbers) < 0)
            {
                return i;
            }
        }

        return Math.max.apply(Math, numbers) + 1;
    }
}

function CanAddCard(isExtraDeck)
{
    return (!isExtraDeck && !MainDeckIsFull()) || (isExtraDeck && !ExtraDeckIsFull());
}

function MainDeckIsFull()
{
    return DeckSubmissionViewModel.selectedMainCards().length >= 30;
}

function ExtraDeckIsFull()
{
    return DeckSubmissionViewModel.selectedExtraCards().length >= 5;
}

function SortDeck(a, b)
{
    var typeResult = (a.type > b.type) ? 1 : ((a.type < b.type) ? -1 : 0);
    if(typeResult != 0) return typeResult;

    if(a.type === 1 && b.type === 1)
    {
        var normalResult = (a.isNormal > b.isNormal) ? 1 : ((a.isNormal < b.isNormal) ? -1 : 0);
        if(normalResult != 0) return normalResult;

        var attackResult = (a.attack < b.attack) ? 1 : ((a.attack > b.attack) ? -1 : 0);
        if(attackResult != 0) return attackResult;
    }

    var nameResult = (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0);
    return nameResult;
}

function CreateTypeEnum()
{
    cardTypes = [{ id: 1, name: "Monster"}, { id: 2, name: "Spell"}, { id: 3, name: "Trap"}];
}

function GetTypeId(typeName)
{
    var types = $(cardTypes).filter(function() { return this.name === typeName; });
    return types.length > 0 ? types[0].id : -1;
}

function GetTypeName(typeId)
{
    var types = $(cardTypes).filter(function(){ return this.id === typeId; });
    return types.length > 0 ? types[0].name : "";
}

function BindFormEvents()
{
    MakeCardsClickable();

    $("#SubmitDeck").click(function()
    {
        $("form.deck-submission").submit();
    });

    $("form.deck-submission").submit(function()
    {
        var form = this;
    
        $(form).addClass('form--loading');
    
        $.ajax(
        {
          type: $(this).attr('method'),
          url: $(this).attr('action'),
          data: $(this).serialize(),
          contentType: 'application/x-www-form-urlencoded',
          success: function (data)
          { 
            alert("Deck submitted!");
            $(form).removeClass('form--loading');
            DeckSubmissionViewModel.selectedMainCards.remove(function(card){ return true; });
            DeckSubmissionViewModel.selectedExtraCards.remove(function(card){ return true; });
            $('#deck-sub-form').trigger("reset");
          },
          error: function (err)
          {
            console.log(err);
            alert("Error");
            $(form).removeClass('form--loading');
          }
        });
    
        return false;  
    });
}

function setDiscordAuthURL() {
    // Set the site URL dynamically for the dev server
    let websiteLink = location.protocol + "//" + location.hostname;
    if(location.port){
        websiteLink += ":" + location.port;
    }
    $('#discord-login-button').attr('href', 'https://discordapp.com/api/oauth2/authorize?client_id=398290865556160513&redirect_uri=' + encodeURIComponent(websiteLink) + '%2Fsubmit-your-deck%2F&response_type=token&scope=identify');
}