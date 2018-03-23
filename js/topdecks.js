$(document).ready(function()
{
    InitializeTopDecksViewModel();
    GetTopDecks();
    BindTopDecksPageEvents();
    GetTopPlayerCouncil();
});

function InitializeTopDecksViewModel()
{
    var topDecksElem = $("#TopDecks")[0];

    if(typeof topDecksElem != "undefined")
    {
        TopDecksViewModel =
        {
            deckTypes: ko.observableArray(),
            filteredDecks: ko.observableArray(),
            filteredSkills: ko.observableArray(),
            filteredDecksByCouncil: ko.observableArray(),

            activeDeckType: ko.observable(""),
            activeSkill: ko.observable(""),
            councilFilterActive: ko.observable(false),

            defaultDecks: [],
            filteredDecksByType: [],
            filteredDecksBeforeCouncilFilter: [],

            topPlayerCouncil: [],

            filterByType: function(decktype)
            {
                if(TopDecksViewModel.activeDeckType() != decktype)
                {
                    var newDeckType = $(TopDecksViewModel.deckTypes()).filter(function(){ return this.id === decktype.id});
                    var newDecks  = $.map(newDeckType, function(value, index){ return value.decks });
                    var newSkills = $.map(newDeckType, function(value, index){ return value.skills });
                    //var newSkillNames = RemoveDuplicates($.map(newDecks, function(value, index){ return value.skill }));
                    
                    TopDecksViewModel.filteredSkills(newSkills);

                    if(newDecks.length !== 0)
                        newDecks.sort(SortDecks);
                        
                    TopDecksViewModel.filteredDecks(newDecks);
                    filteredDecksByType = newDecks;
                    TopDecksViewModel.activeDeckType(decktype);
                    TopDecksViewModel.activeSkill("");

                    TopDecksViewModel.filteredDecksByCouncil($(filteredDecksByType).filter(function(index, element) {
                        if(element["top-player-council"] === true) {
                            return true;
                        }

                        for(var index = 0; index < TopDecksViewModel.topPlayerCouncil.length; index++) {
                            if(TopDecksViewModel.topPlayerCouncil[index].active) {
                                if(TopDecksViewModel.topPlayerCouncil[index].name === element.author.toLowerCase()) {
                                    return true;
                                }
                            }   
                        }

                        return false;
                    }));
                    TopDecksViewModel.councilFilterActive(false); 

                    ScrollTo("#SkillSelection");
                }
                else
                {
                    TopDecksViewModel.filteredDecks(TopDecksViewModel.defaultDecks);
                    TopDecksViewModel.filteredSkills([]);
                    filteredDecksByType = [];
                    TopDecksViewModel.activeDeckType("");
                    TopDecksViewModel.activeSkill("");
                    TopDecksViewModel.filteredDecksByCouncil([]);
                }

                TopDecksViewModel.resetPagination();
            },

            filterByTypeAndSkill: function(skill)
            {
                if(TopDecksViewModel.activeSkill() != skill)
                {
                    var newDecks = $(filteredDecksByType).filter(function(){return this.skill === skill.display});
                    
                    if(newDecks.length !== 0)
                        newDecks.sort(SortDecks);
                        
                    TopDecksViewModel.filteredDecks(newDecks);
                    TopDecksViewModel.activeSkill(skill);

                    TopDecksViewModel.filteredDecksByCouncil($(newDecks).filter(function(index, element) {
                        if(element["top-player-council"] === true) {
                            return true;
                        }

                        for(var index = 0; index < TopDecksViewModel.topPlayerCouncil.length; index++) {
                            if(TopDecksViewModel.topPlayerCouncil[index].active) {
                                if(TopDecksViewModel.topPlayerCouncil[index].name === element.author.toLowerCase()) {
                                    return true;
                                }
                            }   
                        }

                        return false;
                    }));
                    TopDecksViewModel.councilFilterActive(false); 
                }
                else
                {
                    TopDecksViewModel.activeSkill("");
                    TopDecksViewModel.filteredDecks(filteredDecksByType);

                    TopDecksViewModel.filteredDecksByCouncil($(filteredDecksByType).filter(function(index, element) {
                        if(element["top-player-council"] === true) {
                            return true;
                        }

                        for(var index = 0; index < TopDecksViewModel.topPlayerCouncil.length; index++) {
                            if(TopDecksViewModel.topPlayerCouncil[index].active) {
                                if(TopDecksViewModel.topPlayerCouncil[index].name === element.author.toLowerCase()) {
                                    return true;
                                }
                            }   
                        }

                        return false;
                    }));
                }

                TopDecksViewModel.resetPagination();
            },

            filterByCouncil: function() {
                if( !TopDecksViewModel.councilFilterActive() ) {
                    filteredDecksBeforeCouncilFilter = TopDecksViewModel.filteredDecks();

                    var newDecks = $(TopDecksViewModel.filteredDecks()).filter(function(index, element) {
                        if(element["top-player-council"] === true) {
                            return true;
                        }

                        for(var index = 0; index < TopDecksViewModel.topPlayerCouncil.length; index++) {
                            if(TopDecksViewModel.topPlayerCouncil[index].active) {
                                if(TopDecksViewModel.topPlayerCouncil[index].name === element.author.toLowerCase()) {
                                    return true;
                                }
                            }   
                        }

                        return false;
                    });
                    newDecks.sort(SortDecks);
                    TopDecksViewModel.filteredDecks(newDecks);

                    TopDecksViewModel.councilFilterActive(true);   
                }
                else {
                    TopDecksViewModel.filteredDecks(filteredDecksBeforeCouncilFilter);
                    filteredDecksBeforeCouncilFilter = [];

                    TopDecksViewModel.councilFilterActive(false);  
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
            pagesSmall: ko.observableArray(),

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
                TopDecksViewModel.recalculateDynamicPagination(TopDecksViewModel.pages, 10);
                TopDecksViewModel.recalculateDynamicPagination(TopDecksViewModel.pagesSmall, 7);
            },

            recalculateDynamicPagination: function(pages, amountOfPages)
            {
                pages.removeAll();
                pages.push(TopDecksViewModel.currentPage());

                var minPages = 1;
                var maxPages = Math.ceil(TopDecksViewModel.filteredDecks().length / TopDecksViewModel.decksPerPage);

                for(var i = 0; i < amountOfPages - 1; i++)
                {
                    var minPage = Math.min.apply(Math, pages());
                    var maxPage = Math.max.apply(Math, pages());

                    if(i % 2 === 0)
                    {
                        if(maxPage < maxPages)
                            pages.push(maxPage + 1);
                        else if(minPage > minPages)
                            pages.push(minPage - 1);
                    }
                    else
                    {
                        if(minPage > minPages)
                            pages.push(minPage - 1); 
                        else if(maxPage < maxPages)
                            pages.push(maxPage + 1);
                    }
                }

                    pages.sort(SortPages);
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
            }
        };
        
        ko.applyBindings(TopDecksViewModel, topDecksElem);
    }
}

function GetTopDecks()
{
    var season = $("#season-identifier").data("season");

    if(typeof season != "undefined")
    {
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
    if(ShouldScroll())
    {
        var page = $(".page-wrapper");
        var scrollPosition = page.scrollTop() + $(element).offset().top - 70;

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

function ShouldScroll()
{
    var windowWidth = $(window).outerWidth();
    var amountOfTypes = TopDecksViewModel.deckTypes().length;

    return windowWidth <= 767 || (windowWidth > 767 && windowWidth <= 991 && amountOfTypes > 12) || (windowWidth > 991 && amountOfTypes > 16);
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

function GetTopPlayerCouncil() {
    $.getJSON("/data/top-player-council.json", function(data) {
        TopDecksViewModel.topPlayerCouncil = data;
    });
}