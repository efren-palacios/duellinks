$(document).ready(function()
{
    InitializeViewModel();
    GetAllCards();
    MakeBoxesDroppable();
});

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
            var name = $(ui.draggable).data("name");
            DeckSubmissionViewModel.selectedMainCards.push(name);
            MakeCardsDraggable();
        },
        out: function (event, ui)
        {
            var self = ui;
            ui.helper.off('mouseup').on('mouseup', function ()
            {
                var name = $(ui.draggable).data("name");
                DeckSubmissionViewModel.selectedMainCards.remove(name);
            });
        }
    });
}

function AddCardToUserDeck(name)
{
    
}