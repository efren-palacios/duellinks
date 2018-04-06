var articles = [];
var articlesLoaded = 12;
var council = [];
var articlesDisplayed = 8; 

$(document).ready(function() {
    $('#moreArticles').click(enableMoreArticles);

    $.getJSON("/data/articles.json", function(response) {
        articles = response;
    });
    $.getJSON("/data/top-player-council.json", function(response) {
        council = response;
    });
});

function enableMoreArticles() {
    loadHiddenArticles();
    displayArticles();    
}

function loadHiddenArticles() {        
    var articleLimit = articlesLoaded + 4; 
    for(var index = articlesLoaded; index < articleLimit; index++) {
        if(articlesLoaded < articles.length) {
            var clone = $('#articleCard').clone();
            var currentArticle = articles[index];

            clone.find('#articleImageAnchor').attr('href', currentArticle.url);
            clone.find('#articleImage').attr('src', currentArticle.image);
            clone.find('#articleInfoAnchor').attr('href', currentArticle.url);
            clone.find('#articleInfoTitle').html(currentArticle.title);

            var timeago = getTimeago(currentArticle.date);
            clone.find('#articleAuthor').html('Last Updated: ' + timeago + ' ');

            if(currentArticle.author == 'Dkayed') {
                clone.find('#articleAuthor').append('By <b><a class="text-danger" href="/authors/Dkayed/">Dkayed</a></b>');     
            }
            else if(currentArticle.author == "Top Player Council") {
                clone.find('#articleAuthor').append('By <b><a class="text-warning" href="/top-player-council/">Top Player Council</a></b>');
            }
            else {
                var councilMember = false;
                $(council).each(function(index, member) {
                    if(currentArticle.author.toLowerCase() == member.name.toLowerCase()) {
                        councilMember = true;
                        clone.find('#articleAuthor').append('By <b><a class="text-warning" href="/top-player-council/' + currentArticle.author + '/">' + currentArticle.author + '</a></b>');    
                    }
                });
                if(!councilMember) {
                    clone.find('#articleAuthor').append('By <b><a class="text-warning" href="/authors/' + currentArticle.author + '/">' + currentArticle.author + '</a></b>');
                }
            }

            $(clone).removeAttr('id');
            $('.articleButtonColumn').before(clone);
            articlesLoaded++;
        }
        else {
            break;
        }
    }
}

function displayArticles() {
    var hiddenArticles = $('.hiddenCard'); 
    
    for(var i = 0; i < 4; i++ ) {
        if(articlesDisplayed < articles.length) {
            var currentArticle = hiddenArticles[i];
            $(currentArticle).removeClass('hiddenCard');
            $(currentArticle).show('slow');

            articlesDisplayed++;
        }
        else {
            $('#moreArticles').attr('disabled', true);
            break;
        }        
    }
    if(articlesDisplayed == articles.length) {
        $('#moreArticles').attr('disabled', true);    
    }
}

function getTimeago(date) {
    var dayInMilliseconds = 1000 * 60 * 60 * 24; 

    var formattedDateInMilliseconds = new Date(date).getTime();
    var todayDateInMilliseconds = Date.now();

    var differenceInMilliseconds = todayDateInMilliseconds - formattedDateInMilliseconds;

    var differenceInDays = Math.round(differenceInMilliseconds/dayInMilliseconds);
    
    switch(true) {
        case (differenceInDays == 0):
            return 'Today';
            break;
        case (differenceInDays == 1):
            return 'Yesterday';
            break;
        case (differenceInDays >= 2 && differenceInDays < 7): 
            return differenceInDays + (differenceInDays > 1 ? ' days': ' day');
            break;
        case (differenceInDays >= 7 && differenceInDays < 30):    
            var weeks = Math.floor(differenceInDays/7);
            var leftOverDays = differenceInDays - (weeks * 7);
            var leftOverString = leftOverDays > 0 ? ' and ' + leftOverDays + (leftOverDays > 1 ? ' days': ' day') : "";
            return weeks + (weeks > 1 ? ' weeks': ' week') + leftOverString;   
            break;
        case (differenceInDays >= 30 && differenceInDays < 365):
            var months = Math.floor(differenceInDays/30);
            var leftOverDays = differenceInDays - (months * 30);
            var leftOverWeeks = leftOverDays >= 7 ? Math.floor(leftOverDays/7) : 0;
            var leftOverString = "";
            if(leftOverDays > 0) leftOverString = leftOverWeeks > 0 ? ' and ' + leftOverWeeks + (leftOverWeeks > 1 ? ' weeks': ' week') : ' and ' + leftOverDays + (leftOverDays > 1 ? ' days': ' day');
            return months + (months > 1 ? ' months':' month') + leftOverString;   
            break;     
        case (differenceInDays >= 365):
            var years = Math.floor(differenceInDays/365);
            var leftOverDays = differenceInDays - (years * 365);
            var leftOverMonths = leftOverDays >= 30 ? Math.floor(differenceInDays/30) : 0;            
            var leftOverWeeks = leftOverDays >= 7 ? Math.floor(leftOverDays/7) : 0;
            var leftOverString = "";
            if(leftOverDays > 0) {
                if(leftOverMonths > 0) {
                    leftOverString = ' and ' + leftOverMonths + (leftOverMonths > 1 ? ' months':' month');
                }
                else if(leftOverWeeks > 0) {
                    leftOverString = ' and ' + leftOverWeeks + (leftOverWeeks > 1 ? ' weeks': ' week'); 
                } 
                else {
                    leftOverString = ' and ' + leftOverDays + (leftOverDays > 1 ? ' days': ' day');
                }
            } 
            return years + (years > 1 ? ' years':' year') + leftOverString;   
            break;       
    }
}