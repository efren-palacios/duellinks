$(document).ready(function()
{
    $(".guides-filters [data-filter]").on("click", function()
    {
        $(this).toggleClass("active");

        var category = $(this).data("filter");

        $("[data-category='" + category + "']").each(function()
        {
            $(this).toggleClass("hidden");
        });
    });
});

