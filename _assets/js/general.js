$(document).ready(function()
{
    ExecuteOnReadyFunctions();
    BindPageEvents();
	
    $('.carousel').carousel({
        interval: false
	});
	
    setImageFilter();
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

function setImageFilter() {
    new CardsAPI().setImageFilters();
}

function twitchNotification() {
    //test if user has already seen this here
    
    
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")
	
    // Add the "show" class to DIV
    x.className = "show";
	
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 7000);
}




if (!sessionStorage.run3times || sessionStorage.run3times<3) {
    if(!sessionStorage.run3times){
        sessionStorage.run3times = 1;
		}else{
        sessionStorage.run3times++;
	}
	$.getJSON("https://api.twitch.tv/kraken/streams/duellinksmeta?client_id=ajtf58zc6vxrkaf7faohw5al9v3tua", function(channel)
	{
		if (channel["stream"] == null)
		{
			return;
			} else {
			twitchNotification();
		}
	});
}

if (typeof antiabd !== 'undefined'){
	//alert("no adblock");
    
}else{
    //you can view the site 3x with adblock but no more after that.
    if (localStorage.ABDrun3times < 3) {
        if(!localStorage.ABDrun3times){
            localStorage.ABDrun3times = 1;
            }else{
            localStorage.ABDrun3times++;
        }
    }else{
    //alert("adblock");
    window.location = "/adb/";
    }
}