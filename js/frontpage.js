
$(document).ready(function()
{
    InitializeFrontPageViewModel();
    LoadArticles();
});

function InitializeFrontPageViewModel()
{
    FrontPageViewModel =
    {
        displayedArticles: ko.observableArray(),
        hiddenArticles: [],

        showMoreArticles: function()
        {
            ko.utils.arrayPushAll(FrontPageViewModel.displayedArticles(), FrontPageViewModel.hiddenArticles.splice(0, 4));
            FrontPageViewModel.displayedArticles.valueHasMutated();

            /* Really dirty hack but it saves me from frustration. Knockout adds empty anchor elements
               which mess up the CSS :after rules which add "," and "and" in between authors */
            $(".card-collection.collection-attached .authors a").not(".author").remove();
        },

        animateNewArticle: function(elem)
        {
            if (elem.nodeType === 1)
                $(elem).hide().show("slow");
        }
    };
    
    ko.applyBindings(FrontPageViewModel);
}

function LoadArticles()
{
    $.getJSON("/data/articles.json", function(articles)
    {
        FrontPageViewModel.hiddenArticles = articles;
    });
}