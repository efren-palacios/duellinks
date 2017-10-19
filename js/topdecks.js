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
                    newDecks.sort(SortDecksByDate);
                    
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
                    newDecks.sort(SortDecksByDate);
                    
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
        data.sort(SortDeckTypesByCount);
        TopDecksViewModel.deckTypes(data);

        TopDecksViewModel.defaultDecks = [];

        $.each(data,  function(index, decktype)
        {
            $.merge(TopDecksViewModel.defaultDecks, decktype.decks);
        });

        defaultDecks.sort(SortDecksByDate);
        TopDecksViewModel.filteredDecks(TopDecksViewModel.defaultDecks);
    });
}

function SortDeckTypesByCount(a, b)
{
    return ((a.count < b.count) ? 1 : ((a.count > b.count) ? -1 : 0));
}

function SortDecksByDate(a, b)
{
    return ((a.created < b.created) ? 1 : ((a.created > b.created) ? -1 : 0));
}

function RemoveDuplicates(array)
{
    return $.grep(array, function(elem, index)
    {
        return index === $.inArray(elem, array);
    });
}