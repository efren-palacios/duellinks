$(document).ready(function()
{
    GetAllCards();
});

function GetAllCards()
{
    $.getJSON("/data/cards.json", function(data)
    {
        var x = data;
        x++;
    });
}