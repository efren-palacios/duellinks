$(document).ready(function()
{
    $(".guides-filters [data-filter]").on("click", function()
    {
        $(this).toggleClass("active");

        var self = $(this);
        $(".guides-filters [data-filter]").each(function() {
            var category = $(this).data("filter");
            if(self.data("filter") != category) {
                $(this).removeClass("active");
            }    
        });

        if($(".guides-filters .active[data-filter]").length == 0)
        {
            $("[data-category]").each(function()
            {
                $(this).removeClass("hidden");
            });
        }
        else
        {
            $("[data-filter]").each(function()
            {
                var category = $(this).data("filter");
                var active = $(this).hasClass("active");

                $("[data-category='" + category + "']").each(function()
                {
                    if(active)
                        $(this).removeClass("hidden");
                    else
                        $(this).addClass("hidden");
                });
            });
        }
    });
});

