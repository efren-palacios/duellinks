$(document).ready(function() {
  ExecuteOnReadyFunctions();
  BindPageEvents();

  $(".carousel").carousel({
    interval: false
  });
});

function ExecuteOnReadyFunctions() {
  ReadUrlHashFragment();
}

function BindPageEvents() {
  BindTabsToUrlHash();
  BindCollapsableTables();
  BindSeasonArchiveSelection();
}

function ReadUrlHashFragment() {
  var hash = window.location.hash;

  if (hash !== "") {
    $.when($(".nav-tabs a[href='" + hash + "']").tab("show")).then(function() {
      $(".page-wrapper").scrollTop(0);
    });
    /*$(".nav-tabs a[href='" + hash + "']").tab("show");
		$(".page-wrapper").scrollTop(0);*/
  }
}

function BindTabsToUrlHash() {
  $(document).on("shown.bs.tab", "a[data-toggle='tab']", function(event) {
    var position = $(".page-wrapper").scrollTop();
    window.location.hash = event.target.hash;
    $(".page-wrapper").scrollTop(position);
  });
}

function BindCollapsableTables() {
  $("table.collapsable").each(function(index, elem) {
    $(elem)
      .find("thead")
      .click(function() {
        $(elem).toggleClass("collapsed");
      });
  });
}

function BindSeasonArchiveSelection() {
  $("#SeasonArchiveSelection").change(function(event) {
    if ($(event.target).val() != "defaultValue")
      window.location = "/top-decks/" + $(event.target).val();
  });
}

function EventComplete() {
  $(".soon-event-countdown").addClass("hidden");
  $(".soon-event-complete").removeClass("hidden");
}

function getWebsiteLink() {
  var websiteLink = location.protocol + "//" + location.hostname;
  if (location.port) {
    websiteLink += ":" + location.port;
  }
  return websiteLink;
}

//menubutton script
function toggleChange(elem) {
  elem.classList.toggle("change");
}

function twitchNotification() {
  //test if user has already seen this here

  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function() {
    x.className = x.className.replace("show", "");
  }, 7000);
}

if (!sessionStorage.run3times || sessionStorage.run3times < 3) {
  if (!sessionStorage.run3times) {
    sessionStorage.run3times = 1;
  } else {
    sessionStorage.run3times++;
  }
  $.getJSON(
    "https://api.twitch.tv/kraken/streams/duellinksmeta?client_id=ajtf58zc6vxrkaf7faohw5al9v3tua",
    function(channel) {
      if (channel["stream"] == null) {
        return;
      } else {
        twitchNotification();
      }
    }
  );
}

//Disable the antiadblock by uncommenting the line below | To activate comment out or remove the line below
//antiabd=="off";

//AntiAdblock
if (typeof antiabd === "undefined") {
  //you can view the site 3x with adblock but no more after that.
  if (localStorage.ABDrun3times < 3) {
    if (!localStorage.ABDrun3times) localStorage.ABDrun3times = 1;
    else localStorage.ABDrun3times++;
  } else {
    window.location = "/advertisements-info/";
  }
}

//remove disqus ads script
(function($) {
  setInterval(() => {
    $.each($("iframe"), (arr, x) => {
      let src = $(x).attr("src");
      if (src && src.match(/(ads-iframe)|(disqusads)/gi)) {
        $(x).remove();
      }
    });
  }, 300);
})(jQuery);

//searchbar
var sjs = SimpleJekyllSearch({
  searchInput: document.getElementById("nav_searchbar"),
  resultsContainer: document.getElementById("results-container"),
  json: "/data/search.json",
  searchResultTemplate:
    '<a href="{url}" title="{description}" class="list-group-item list-group-item-action">{title}</a>'
});
//iconchange on hover
function searchhover(element) {
  element.setAttribute("src", "/img/assets/search_icon_hover.png");
}

function searchunhover(element) {
  element.setAttribute("src", "/img/assets/search_icon.png");
}

//back to Top button
document
  .getElementById("pageContent")
  .addEventListener("wheel", scrollFunction);

function scrollFunction() {
  if (
    $("#pageContent").scrollTop() > 20 ||
    $("#pageContent").scrollTop() > 20
  ) {
    $(".scroll-top-wrapper").addClass("show");
  } else {
    $(".scroll-top-wrapper").removeClass("show");
  }
}
$(".scroll-top-wrapper").on("click", function(e) {
  e.preventDefault();
  $("#pageContent").animate(
    {
      scrollTop: 0
    },
    700
  );
});
