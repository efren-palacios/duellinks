$(document).ready(function()
{
    ExecuteOnReadyFunctions();
    BindPageEvents();
});

function ExecuteOnReadyFunctions()
{
    ReadUrlHashFragment();
}

function BindPageEvents()
{
    BindTabsToUrlHash();
    BindCollapsableTables();
}

function ReadUrlHashFragment()
{
    var hash = window.location.hash;
    
    if (hash !== "")
    {
        $(".nav-tabs a[href='" + hash + "']").tab("show");
    } 
}

function BindTabsToUrlHash()
{
    $(document).on("shown.bs.tab", "a[data-toggle='tab']", function(event)
    {
        window.location.hash = event.target.hash;
        $(".page-wrapper").scrollTop(0);
    });
}

function BindCollapsableTables()
{
    $("table.collapsable").each(function(index, elem)
    {
        $(elem).find("thead").click(function()
        {
            $(elem).toggleClass("collapsed");
        });
    });
}