$(document).ready(function()
{
    InitializeViewModel();
    GetTopDecks();
    BindTopDecksPageEvents();
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
            TopDecksViewModel.selectFirstPage();
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
            TopDecksViewModel.selectPage(1);
        },

        selectLastPage: function()
        {
            var amountOfDecks = TopDecksViewModel.filteredDecks().length;
            var lastPage = Math.floor(amountOfDecks / TopDecksViewModel.decksPerPage) + 1;
            TopDecksViewModel.selectPage(lastPage);
        },

        selectPreviousPage: function()
        {
            TopDecksViewModel.selectPage(TopDecksViewModel.currentPage() - 1);
        },

        selectNextPage: function()
        {
            TopDecksViewModel.selectPage(TopDecksViewModel.currentPage() + 1);
        },

        bindCollapsable: function(elements, data, idk, mkay)
        {
            if ($("#stats-skills table.top-decks-stats").length === TopDecksViewModel.deckTypes().length)
            {
                BindCollapsableTables();
            }
        },

        selectedArchivedSeason: ko.observable("")
    };
    
    ko.applyBindings(TopDecksViewModel);
}

function GetTopDecks()
{
    var season = $("#season-identifier").data("season");

    $.getJSON( "/data/top-decks/" + season + ".json", function(data)
    {
        data = $.grep(data, function(deckType)
        { 
            return deckType.count > 0; 
        });

        TopDecksViewModel.defaultDecks = [];

        $.each(data, function(index, decktype)
        {
            $.merge(TopDecksViewModel.defaultDecks, decktype.decks);
        });

        var totalDecks = TopDecksViewModel.defaultDecks.length;

        $.each(data, function(index, decktype)
        {
            decktype.percentage = GetPercentage(decktype.count, totalDecks);

            var allSkills = $.map(decktype.decks, function(deck, index){ return deck.skill });
            var skills = [];

            $.each(allSkills, function(index, skill)
            {
                var skillDisplays = $.map(skills, function(skill) { return skill.display; });
                var skillIndex = $.inArray(skill, skillDisplays);

                if(skillIndex === -1)
                {
                    count = (skills[skill] || 0 ) + 1;
                    
                    skills.push(
                    {
                        display: skill,
                        count: count,
                        percentage: GetPercentage(count, allSkills.length)
                    });
                }
                else
                {
                    skills[skillIndex].count++;
                    skills[skillIndex].percentage = GetPercentage(skills[skillIndex].count, allSkills.length);
                }
            });

            skills.sort(SortSkills),
            decktype.skills = skills;
        });

        data.sort(SortDeckTypes);
        TopDecksViewModel.deckTypes(data);

        TopDecksViewModel.defaultDecks.sort(SortDecks);
        TopDecksViewModel.filteredDecks(TopDecksViewModel.defaultDecks);

        TopDecksViewModel.resetPagination();
    });
}

function SortDeckTypes(a, b)
{
    var countResult = (a.count < b.count) ? 1 : ((a.count > b.count) ? -1 : 0);
    if(countResult != 0) return countResult;

    var aL = a.display.toLowerCase(), bL = b.display.toLowerCase();

    var displayResult = (aL > bL) ? 1 : ((aL < bL) ? -1 : 0);
    return displayResult;
}

function SortDecks(a, b)
{
    var createdResult = (a.created < b.created) ? 1 : ((a.created > b.created) ? -1 : 0);
    if(createdResult != 0) return createdResult;

    var nameResult = (a.name > b.name) ? 1 : ((a.name < b.name) ? -1 : 0);
    return nameResult;
}

function SortSkills(a, b)
{
    //Skills for stats have a count and a display property as well
    return SortDeckTypes(a, b);
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

function GetPercentage(amount, total)
{
    return Math.round(amount / total * 1000) / 10 + "%";
}

function ScrollTo(element)
{
    if($(window).outerWidth() <= 767)
    {
        var page = $(".page-wrapper");
        var scrollPosition = page.scrollTop() + $(element).offset().top;

        page.on("mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function()
        {
            page.stop();
        });
    
        page.animate({ scrollTop: scrollPosition }, 1500, function()
        {
            page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
        });
    }
}

function BindTopDecksPageEvents()
{
    $(".stats-header #collapse-all").click(function(event)
    {
        $("#stats-skills table.collapsable").addClass("collapsed");
        $("#collapse-all").addClass("hidden");
        $("#expand-all").removeClass("hidden");
    });

    $(".stats-header #expand-all").click(function(event)
    {
        $("#stats-skills table.collapsable").removeClass("collapsed");
        $("#expand-all").addClass("hidden");
        $("#collapse-all").removeClass("hidden");
    });
}