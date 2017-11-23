$(document).ready(function()
{
    InitializeViewModel();
    GetAllCards();
    MakeBoxesDroppable();
});

function InitializeViewModel()
{
    timeoutId = 0;

    TopDecksViewModel =
    {
        cards: ko.observableArray(),
        searchTerm: ko.observable(""),
        filteredCards: ko.observableArray()
    };

    TopDecksViewModel.searchTerm.subscribe(function(searchTerm)
    {
        clearTimeout(timeoutId);

        if(searchTerm.length >= 2)
        {
            timeoutId = setTimeout(function()
            {
                var lowerSearchTerm = searchTerm.toLowerCase();
                var nameResults = $(TopDecksViewModel.cards()).filter(function(){ return this.nameSearch.indexOf(lowerSearchTerm) != -1});
                var descResults = $(TopDecksViewModel.cards()).filter(function(){ return this.description.indexOf(lowerSearchTerm) != -1});
                var mergedResults = $.unique($.merge(nameResults, descResults));
                TopDecksViewModel.filteredCards(mergedResults.slice(0, 20));
                MakeCardsDraggable();
            }, 400);
        }
        else
        {
            TopDecksViewModel.filteredCards([]);
        }
    });
    
    ko.applyBindings(TopDecksViewModel);
}

function GetAllCards()
{
    $.getJSON("/data/cards.json", function(data)
    {
        TopDecksViewModel.cards(data);
    });
}

function MakeCardsDraggable()
{
    $(".item").draggable({helper: "clone"});
}

function MakeBoxesDroppable()
{
    $(".box-main").droppable(
        {
            accept: ".item",
            drop: function(event, ui)
            {
                var card = $(ui.draggable).clone();
                $(this).append(card);
            }
        });
}