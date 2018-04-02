var currentPageNumber = 1;
var maxPages = 0; 

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

        updatePagination();
    });    

    $(".guide-pagination .pagination.next a").click(function() {
        pageDirectionClicked($(this).data('page'));    
    });
    $(".guide-pagination .pagination.previous a").click(function() {
        pageDirectionClicked($(this).data('page'));
    });

    updatePagination();
});

function updatePagination() {
    // Unset paginated table rows
    $("[data-category]").each(function() {
        $(this).removeClass('paginated');
    });
    
    // Unset pagination
    $('.guide-pagination .pagination.pages').html("");
    $('.guide-pagination').hide();

    var filteredData = getFilteredTableData(); 

    // Establish pagination    
    if(filteredData.dataLength > 10) {
        // Establish the table
        var rowCount = 1;
        if(filteredData.filter) {
            $("[data-category*='" + filteredData.category + "']").each(function() {
                if(rowCount > 10) {
                    $(this).addClass('paginated');
                }
                rowCount++;
            });
        }
        else {
            $("[data-category]").each(function() {
                if(rowCount > 10) {
                    $(this).addClass('paginated');
                }
                rowCount++;
            });    
        }

        // Establish the pages 
        maxPages = Math.ceil(filteredData.dataLength / 10);
        $('.guide-pagination .pagination.pages').append("<li class='page-item active'><a class='page-link' data-page='" + 1 + "'>" + 1 + "</a></li>");
        for(var pageCount = 2; pageCount <= maxPages; pageCount++) {
            $('.guide-pagination .pagination.pages').append("<li class='page-item'><a class='page-link' data-page='" + pageCount + "'>" + pageCount + "</a></li>");
        }     
        $('.guide-pagination').show(); 
        $(".guide-pagination .pagination.pages a").click(function() {
            pageClicked($(this), $(this).data('page'));
        });  

        currentPageNumber = 1;
        updatePageNavigation();
    }
};

function pageClicked(self, pageNumber) {
    currentPageNumber = new Number(pageNumber);
    var filteredData = getFilteredTableData();
    
    var rowCount = 1;
    if(filteredData.filter) {
        $("[data-category*='" + filteredData.category + "']").each(function() {
            if(((currentPageNumber * 10) - 9) <= rowCount && rowCount <= (currentPageNumber * 10)) {
                $(this).removeClass('paginated');
            }
            else {
                $(this).addClass('paginated');
            }
            rowCount++;
        });
    }
    else {
        $("[data-category]").each(function() {
            if(((currentPageNumber * 10) - 9) <= rowCount && rowCount <= (currentPageNumber * 10)) {
                $(this).removeClass('paginated');
            }
            else {
                $(this).addClass('paginated');
            }
            rowCount++;
        });    
    }

    // Set the buttons to active/deactive, as needed
    self.parent().addClass('active');
    $(".guide-pagination .pagination a").each(function() {
        if($(this).data('page') != pageNumber) {
            $(this).parent().removeClass('active');
        }
    });

    updatePageNavigation();
};

function getFilteredTableData() {
    var filter = false;
    var category = "";
    $(".guides-filters [data-filter]").each(function() {
        if($(this).hasClass('active')) {
            filter = true;
            category = $(this).data("filter");
        }     
    });  
    
    var dataLength = 0;
    if(filter) {
        dataLength = $("[data-category*='" + category + "']").length;
    }
    else {
        dataLength = $("[data-category]").length;
    }

    return {
        filter: filter,
        category: category,
        dataLength: dataLength
    };
};

function pageDirectionClicked(pageDirection) {
    switch(pageDirection) {
        case 'first': 
            currentPageNumber = 1;            
            break;
        case 'previous':
            currentPageNumber = currentPageNumber - 1;
            if(currentPageNumber < 1) currentPageNumber = 1;      
            break;      
        case 'next':
            currentPageNumber = currentPageNumber + 1;
            if(currentPageNumber > maxPages) currentPageNumber = maxPages; 
            break;
        case 'last':
            currentPageNumber = maxPages;            
            break;
    }

    updatePageNavigation();

    pageClicked( $("[data-page*='" + currentPageNumber + "']"), currentPageNumber);
};

function updatePageNavigation() {
    if(currentPageNumber == 1) {
        $("[data-page*='first']").parent().addClass('disabled');
        $("[data-page*='previous']").parent().addClass('disabled');
        $("[data-page*='next']").parent().removeClass('disabled');
        $("[data-page*='last']").parent().removeClass('disabled');
    }
    else if (currentPageNumber == maxPages) {
        $("[data-page*='first']").parent().removeClass('disabled');
        $("[data-page*='previous']").parent().removeClass('disabled');
        $("[data-page*='next']").parent().addClass('disabled');
        $("[data-page*='last']").parent().addClass('disabled');
    }
    else {
        $("[data-page*='first']").parent().removeClass('disabled');
        $("[data-page*='previous']").parent().removeClass('disabled');
        $("[data-page*='next']").parent().removeClass('disabled');
        $("[data-page*='last']").parent().removeClass('disabled');   
    }
};