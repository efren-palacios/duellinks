$(document).ready(function()
{
    InitializeViewModel();
    GetTopDecks();
});

function InitializeViewModel()
{
    TopDecksViewModel =
    {
        allDecks: [],
        filteredDecks: ko.observableArray(),

        filterByType : function(viewModel, event)
        {
            var type = $(event.currentTarget).attr("data-type");
            var newDecks = $(TopDecksViewModel.allDecks).filter(function(){return this.decktype === type});
            TopDecksViewModel.filteredDecks(newDecks);
        }
    };
    
    ko.applyBindings(TopDecksViewModel);
}

function GetTopDecks()
{
    $.getJSON( "/data/topdecks.json", function(data)
    {
        TopDecksViewModel.filteredDecks(data);
        TopDecksViewModel.allDecks = data;
    });
}