$(document).ready(function()
{
    BindPageEvents();
});

function BindPageEvents()
{
    BindCollapsableTables();
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