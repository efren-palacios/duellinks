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

        resetPagination: function()
        {
            TopDecksViewModel.currentPage(1);
            TopDecksViewModel.recalculatePagination();
        },

        recalculatePagination: function()
        {
            TopDecksViewModel.pages.removeAll();
            TopDecksViewModel.pages.push(TopDecksViewModel.currentPage());

            var minPages = 1;
            var maxPages = Math.ceil(TopDecksViewModel.filteredDecks().length / TopDecksViewModel.decksPerPage);

            for(var i = 0; i < 9; i++)
            {
                var minPage = Math.min.apply(Math, TopDecksViewModel.pages());
                var maxPage = Math.max.apply(Math, TopDecksViewModel.pages());

                if(i % 2 === 0)
                {
                    if(maxPage < maxPages)
                        TopDecksViewModel.pages.push(maxPage + 1);
                    else if(minPage > minPages)
                        TopDecksViewModel.pages.push(minPage - 1);
                }
                else
                {
                    if(minPage > minPages)
                        TopDecksViewModel.pages.push(minPage - 1); 
                    else if(maxPage < maxPages)
                        TopDecksViewModel.pages.push(maxPage + 1);
                }
            }

            TopDecksViewModel.pages.sort(SortPages);
        },

        selectPage: function(page)
        {
            TopDecksViewModel.currentPage(page);
            TopDecksViewModel.recalculatePagination();
        },

        selectFirstPage: function()
        {
            TopDecksViewModel.currentPage(1);
            TopDecksViewModel.recalculatePagination();
        },

        selectLastPage: function()
        {
            var amountOfDecks = TopDecksViewModel.filteredDecks().length;
            var lastPage = Math.floor(amountOfDecks / TopDecksViewModel.decksPerPage) + 1;
            TopDecksViewModel.currentPage(lastPage);
            TopDecksViewModel.recalculatePagination();
        },

        selectPreviousPage: function()
        {
            TopDecksViewModel.currentPage(TopDecksViewModel.currentPage() - 1);
            TopDecksViewModel.recalculatePagination();
        },

        selectNextPage: function()
        {
            TopDecksViewModel.currentPage(TopDecksViewModel.currentPage() + 1);
            TopDecksViewModel.recalculatePagination();
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
    var countResult = (parseInt(a.count) < parseInt(b.count)) ? 1 : ((parseInt(a.count) > parseInt(b.count)) ? -1 : 0);
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

function SortPages(a, b)
{
    return a > b ? 1 : (a < b) ? -1 : 0;
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
        var scrollPosition = $(element).offset().top;

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
