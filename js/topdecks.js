$(document).ready(function()
{
    InitializeViewModel();
    GetTopDecks();
});

function InitializeViewModel()
{
    TopDecksViewModel =
    {
        deckTypes: ko.observableArray(),
        filteredDecks: ko.observableArray(),
        filteredSkills: ko.observableArray(),

        activeDeckType: ko.observable(""),
        activeSkill: ko.observable(""),

        defaultDecks: [],
        filteredDecksByType: [],

        filterByType: function(decktype)
        {
            if(TopDecksViewModel.activeDeckType() != decktype)
            {
                var newDecks = $.map($(TopDecksViewModel.deckTypes()).filter(function(){ return this.id === decktype.id}), function(value, index){ return value.decks });
                var newSkills = RemoveDuplicates($.map(newDecks, function(value, index){ return value.skill }));
                
                TopDecksViewModel.filteredSkills(newSkills);

                if(newDecks.length !== 0)
                    newDecks.sort(SortDecks);
                    
                TopDecksViewModel.filteredDecks(newDecks);
                filteredDecksByType = newDecks;
                TopDecksViewModel.activeDeckType(decktype);
                TopDecksViewModel.activeSkill("");
            }
            else
            {
                TopDecksViewModel.filteredDecks(TopDecksViewModel.defaultDecks);
                TopDecksViewModel.filteredSkills([]);
                filteredDecksByType = [];
                TopDecksViewModel.activeDeckType("");
                TopDecksViewModel.activeSkill("");
            }
        },

        filterByTypeAndSkill: function(skill)
        {
            if(TopDecksViewModel.activeSkill() != skill)
            {
                var newDecks = $(filteredDecksByType).filter(function(){return this.skill === skill});
                
                if(newDecks.length !== 0)
                    newDecks.sort(SortDecks);
                    
                TopDecksViewModel.filteredDecks(newDecks);
                TopDecksViewModel.activeSkill(skill);
            }
            else
            {
                TopDecksViewModel.activeSkill("");
                TopDecksViewModel.filteredDecks(filteredDecksByType);
            }
        },

        deckTypeHasNewDecks: function(deckType)
        {
            var deckTypeHasNewDecks = false;

            $.each(deckType.decks, function(index, deck)
            {
                var creationDate = new Date(deck.created);
                creationDate.setDate(creationDate.getDate() + 3);

                if (creationDate >= new Date())
                {
                    deckTypeHasNewDecks = true;
                    return false;
                }
            });

            return deckTypeHasNewDecks;
        }
    };
    
    ko.applyBindings(TopDecksViewModel);
}

function GetTopDecks()
{
    $.getJSON( "/data/topdecks.json", function(data)
    {
        data.sort(SortDeckTypes);
        TopDecksViewModel.deckTypes(data);

        TopDecksViewModel.defaultDecks = [];

        $.each(data,  function(index, decktype)
        {
            $.merge(TopDecksViewModel.defaultDecks, decktype.decks);
        });

        TopDecksViewModel.defaultDecks.sort(SortDecks);
        TopDecksViewModel.filteredDecks(TopDecksViewModel.defaultDecks);
    });
}

function SortDeckTypes(a, b)
{
    var countResult = (a.count < b.count) ? 1 : ((a.count > b.count) ? -1 : 0);
    if(countResult != 0) return countResult;

    var displayResult = (a.display > b.display) ? 1 : ((a.display < b.display) ? -1 : 0);
    return displayResult;
}

function SortDecks(a, b)
{
    var createdResult = (a.created < b.created) ? 1 : ((a.created > b.created) ? -1 : 0);
    if(createdResult != 0) return createdResult;

    var nameResult = (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0);
    return nameResult;
}

function RemoveDuplicates(array)
{
    return $.grep(array, function(elem, index)
    {
        return index === $.inArray(elem, array);
    });
}