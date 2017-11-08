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

                ScrollTo("#SkillSelection");
            }
            else
            {
                TopDecksViewModel.filteredDecks(TopDecksViewModel.defaultDecks);
                TopDecksViewModel.filteredSkills([]);
                filteredDecksByType = [];
                TopDecksViewModel.activeDeckType("");
                TopDecksViewModel.activeSkill("");
            }

            TopDecksViewModel.resetPagination();
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

            TopDecksViewModel.resetPagination();
        },

        deckTypeHasNewDecks: function(deckType)
        {
            var deckTypeHasNewDecks = false;

            $.each(deckType.decks, function(index, deck)
            {
                var creationDate = new Date(deck.created);
                creationDate.setDate(creationDate.getDate() + 2);

                if (creationDate >= new Date())
                {
                    deckTypeHasNewDecks = true;
                    return false;
                }
            });

            return deckTypeHasNewDecks;
        },

        decksPerPage: 10,
        currentPage: ko.observable(1),
        pages: ko.observableArray(),

        pagedDecks: ko.computed({read: function()
        {
            var start = (TopDecksViewModel.currentPage() -1 ) * TopDecksViewModel.decksPerPage;
            return TopDecksViewModel.filteredDecks().slice(start, start + TopDecksViewModel.decksPerPage);
        },
        deferEvaluation: true}),

        navigateToPage: function(page)
        {
            TopDecksViewModel.currentPage(1);
        },

        resetPagination: function()
        {
            TopDecksViewModel.currentPage(1);
            TopDecksViewModel.pages.removeAll();

            var amountOfDecks = TopDecksViewModel.filteredDecks().length;

            for(var i = 1; i < amountOfDecks / TopDecksViewModel.decksPerPage + 1; i++)
            {
                TopDecksViewModel.pages.push(i);
            }
        },

        selectPage: function(page)
        {
            TopDecksViewModel.currentPage(page);
        },

        selectPreviousPage: function()
        {
            TopDecksViewModel.currentPage(TopDecksViewModel.currentPage() - 1);
        },

        selectNextPage: function()
        {
            TopDecksViewModel.currentPage(TopDecksViewModel.currentPage() + 1);
        }
    };
    
    ko.applyBindings(TopDecksViewModel);
}

function GetTopDecks()
{
    $.getJSON( "/data/topdecks.json", function(data)
    {
        data = $.grep(data, function(deckType)
        { 
            return deckType.count > 0; 
        });

        data.sort(SortDeckTypes);
        TopDecksViewModel.deckTypes(data);

        TopDecksViewModel.defaultDecks = [];

        $.each(data,  function(index, decktype)
        {
            $.merge(TopDecksViewModel.defaultDecks, decktype.decks);
        });

        TopDecksViewModel.defaultDecks.sort(SortDecks);
        TopDecksViewModel.filteredDecks(TopDecksViewModel.defaultDecks);
        TopDecksViewModel.resetPagination();
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

function ScrollTo(element)
{
    if($(window).outerWidth() <= 767)
    {
        var page = $("html,body");
        var scrollPosition = $(element).offset().top - $(".navbar").outerHeight() - 15;

        page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function()
        {
            page.stop();
        });
    
        page.animate({ scrollTop: scrollPosition }, 1500, function()
        {
            page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
        });
    }
}