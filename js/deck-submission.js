$(document).ready(function()
{
    SortDecktypes();
    InitializeViewModel();
    GetAllCards();
    MakeBoxesDroppable();
    CreateTypeEnum();
    BindFormEvents();
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

function MakeCardsDraggable()
{
    $(".item").draggable({helper: "clone", zIndex: 10000});
}

function MakeBoxesDroppable()
{
    $(".user-deck").droppable(
    {
        accept: ".item",
        drop: function(event, ui)
        {
            AddCardToUserDeck($(ui.draggable).data("name"));
        },
        out: function (event, ui)
        {
            var self = ui;
            ui.helper.off('mouseup').on('mouseup', function ()
            {
                var name = $(ui.draggable).data("name");
                var number = $(ui.draggable).data("number");

                DeckSubmissionViewModel.selectedMainCards.remove(function(card)
                {
                    return card.name == name && card.number === number;
                });
            });
        }
    });
}

function AddCardToUserDeck(name)
{
    if(DeckSubmissionViewModel.selectedMainCards().length < 30)
    {
        var nextNumber = GetNextNumber(name);
        
        if(nextNumber <= 3)
        {
            $.getJSON("https://www.ygohub.com/api/card_info?name=" + encodeURIComponent(name), function(data)
            {
                if(data.status === "success")
                {
                    var card = 
                    {
                        name: name,
                        type: GetTypeId(data.card.type),
                        attack: parseInt(data.card.attack),
                        isNormal: $.inArray("Effect", data.card.monster_types) < 0,
                        number: nextNumber
                    }
            
                    DeckSubmissionViewModel.selectedMainCards.push(card);
                    MakeCardsDraggable();
                }
            });
        }
    }
}

function GetNextNumber(name)
{
    var cards = $(DeckSubmissionViewModel.selectedMainCards()).filter(function()
    {
        return this.name === name;
    });

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
    $("#SubmitDeck").click(function()
    {
        $("form.deck-submission").submit();
    });
}