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
    BindSeasonArchiveSelection();
}

function ReadUrlHashFragment()
{
    var hash = window.location.hash;
    
    if (hash !== "")
    {
        $.when( $(".nav-tabs a[href='" + hash + "']").tab("show") ).then(function( ) { $(".page-wrapper").scrollTop(0); });
        /*$(".nav-tabs a[href='" + hash + "']").tab("show");
        $(".page-wrapper").scrollTop(0);*/
    } 
}

function BindTabsToUrlHash()
{
    $(document).on("shown.bs.tab", "a[data-toggle='tab']", function(event)
    {
        var position = $(".page-wrapper").scrollTop();
        window.location.hash = event.target.hash;
        $(".page-wrapper").scrollTop(position);
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

function BindSeasonArchiveSelection()
{
    $("#SeasonArchiveLink").attr("href", "/top-decks/" + $("#SeasonArchiveSelection option").eq(0).val());

    $("#SeasonArchiveSelection").change(function(event)
    {
        $("#SeasonArchiveLink").attr("href", "/top-decks/" + $(event.target).val());
    });
}