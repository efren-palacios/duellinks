$(document).ready(function()
{
    ExecuteOnReadyFunctions();
    BindPageEvents();

    $('.carousel').carousel({
        interval: false
    })
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
    $("#SeasonArchiveSelection").change(function(event)
    {
        if($(event.target).val() != 'defaultValue') window.location = "/top-decks/" + $(event.target).val();
    });
}

function EventComplete()
{
    $(".soon-event-countdown").addClass("hidden");
    $(".soon-event-complete").removeClass("hidden");
}

function getWebsiteLink() {
    var websiteLink = location.protocol + "//" + location.hostname;
    if(location.port) {
        websiteLink += ":" + location.port;
    }
    return websiteLink;
}
//menubutton script
function toggleChange(elem)
        {
            elem.classList.toggle("change");
        }
