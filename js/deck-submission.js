$(document).ready(function()
{
    timeoutId = 0;
    InitializeViewModel();
    GetAllCards();
});

function InitializeViewModel()
{
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
                var newCards = $(TopDecksViewModel.cards()).filter(function(){ return this.nameSearch.indexOf(lowerSearchTerm) != -1 || this.description.indexOf(lowerSearchTerm) != -1});
                TopDecksViewModel.filteredCards(newCards.slice(0, 20));
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