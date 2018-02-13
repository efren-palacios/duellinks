var is_mobile = false;

$(function()
{
    console.log(window.location.href);

    if ($(".mobile").css("display") == "none")
    {
        is_mobile = true;
    }
    else
    {
        $(function()
        {
            let options =
            {
                style: { classes: 'qtip-dark qtip-shadow rounded' },
                show:  { effect: function() { $(this).fadeIn(250); } },
                hide:  { fixed: true, effect: function() { $(this).fadeOut(250); } },
                position: { my: 'center left', to: 'center right', adjust: { method: 'flip', y: -50, x: 10 } },
                content:
                {
                    text: function(event, api)
                    {
						
						let websiteLink = location.protocol + "//" + location.hostname;
						if(location.port){
							websiteLink += ":" + location.port;
						}
						
                        let type = $(this).attr('name')
                        if(type == "cardPopup"){
                            let name = $(this).attr('src')
                            axios.get("https://www.ygohub.com/api/card_info?name=" + $(this).attr("src").replace("https://yugiohprices.com/api/card_image/", "")).then(function(r)
                            {
                                api.set('content.text',
                                `<div class="preview"><img width="120px" src="${name}" /></div>
                                    <div class="carddata"><b>${r.data.card.name}</b><br />
                                        ${r.data.card.attribute ? "<p>Attribute: " + r.data.card.attribute : ""}
                                        ${r.data.card.stars ? "Level: " + r.data.card.stars+"</p>"  : ""}
                                        ${r.data.card.is_monster
                                            ? '<p><b>[ </b>' + r.data.card.species + ' / ' + r.data.card.monster_types + '<b> ]</b></p>'
                                            : '<p><b>[ </b>' + r.data.card.type + ' / ' + r.data.card.property +  '<b> ]</b></p>'}
                                        <p>${r.data.card.text}</p>
                                        <p>${r.data.card.attack ? "<b>ATK/</b>" + r.data.card.attack : ""}
                                        ${r.data.card.defense ? "<b>DEF/</b>"+r.data.card.defense : ""}</p>
                                    </div>`)
                            })
                            return "Loading card...";
                        }else if(type == "skillPopup"){
                            let name = $(this).html();
                            axios.get(websiteLink + "/data/skillsChars.json").then(function(r)
                            {						
                                let characterWhoUses = [];
                                let exclusive = false;
                                let desc = "No description available";
                                let officialName = name;

                                for(var i = 0; i < r.data.length; i++){
                                    if(r.data[i].name.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase() == name.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase()){
                                        officialName = r.data[i].name;
                                        desc = r.data[i].desc;
                                        exclusive = r.data[i].exclusive;
                                        characterWhoUses.push(r.data[i].character);

                                        if(exclusive == true)
                                            break;
                                    }
                                }

                                let portaitName = characterWhoUses[0].toLowerCase().replace(" ", "-");
								
                                api.set('content.text',
                                `<div class="previewSkill"><img src="${websiteLink}/img/characters/portrait-${exclusive == true ? portaitName : 'vagabond'}.png" /></div>
                                <div class="skilldata">
                                    <b>${officialName}</b><br/>
                                    <p>${desc}</p>
                                    ${exclusive == true
                                            ? '<p>Skill exclusive to ' + characterWhoUses[0] + '.</p>'
                                            : '<p>Skill can be used by different characters.</p>'}
                                </div>`)
                            })
                            return "Loading skill...";
                        }
                    },
                }
            }

            $('.dcards, .card-hover').each(function()
            {
                if($(this).hasClass("card-hover"))
                {
                    options.style.tip = false
                    options.position.viewport = $('.container')
                    options.position.adjust.method = 'shift'
                    options.position.adjust.x = 0
                    options.position.adjust.y = 0
                }
                $(this).qtip(options)
            })
        })
    } 
}); 

$(function()
{
    console.log(is_mobile)
    if (is_mobile == true)
    {
        $(".item a").each(function()
        {
            $(this).attr("href",$(this).find("img").attr("src")).addClass("fancybox");
            $(this).qtip('destroy')
        });

        $(".markdown-item a").each(function()
        {
            $(this).attr("href",$(this).find("img").attr("src")).addClass("fancybox");
            $(this).qtip('destroy')
        });

        $(".card-hover").each(function()
        {
            if($(this).attr('name') == 'skillPopup') {
                let websiteLink = location.protocol + "//" + location.hostname;
                if(location.port){
                    websiteLink += ":" + location.port;
                }

                $(this).replaceWith($('<a class="fancybox-skill" data-type="ajax" data-src="' + websiteLink + '/skill/' + '" href="javascript:;">' + $(this).text() + '</a>'))    
            }
            else {
                var imgSrc = $(this).attr('src')
                $(this).replaceWith($('<a class="fancybox" href="' + imgSrc + '">' + $(this).text() + '</a>'))
            }
        })

        // Set the fancybox for card images
        $('.qtip').remove();
        $().fancybox({
            selector: '.fancybox'
        });

        // Set the fancybox for skill popups
        $().fancybox({
            buttons: ['close'],
            selector: '.fancybox-skill',
            smallBtn: false,
            afterShow: function( instance, current ) {
                // Obtain the skill
                var skill = $(current.opts.$orig).html();

                // Obtain the skill data
                let websiteLink = location.protocol + "//" + location.hostname;
                if(location.port){
                    websiteLink += ":" + location.port;
                }
                axios.get(websiteLink + "/data/skillsChars.json").then( function(response) {
                    // Slice the data
                    let characterWhoUses = [];
                    let exclusive = false;
                    let desc = "No description available";
                    let officialName = skill;
                    for(var i = 0; i < response.data.length; i++){
                        if(response.data[i].name.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase() == skill.replace(/[^a-zA-Zα-ωΑ-Ω ]/g, "").toLowerCase()){
                            officialName = response.data[i].name;
                            desc = response.data[i].desc;
                            exclusive = response.data[i].exclusive;
                            characterWhoUses.push(response.data[i].character);

                            if(exclusive == true) {
                                break;
                            }
                        }
                    }
                    let portaitName = characterWhoUses[0].toLowerCase().replace(" ", "-");

                    // Update and display the data
                    $('#skillTitle').html(officialName);
                    $('#skillDescription').html(desc);
                    var exclusiveString = (exclusive == true ? 'Skill exclusive to ' + characterWhoUses[0] + '' : 'Skill can be used by different characters.');
                    $('#skillExclusive').html(exclusiveString); 
                    var characterString = websiteLink + "/img/characters/portrait-" + (exclusive == true ? portaitName : 'vagabond') + ".png";
                    $('#characterImage').one("load", function() {
                        // Style the image for large skill descriptions, then display the box
                        var containerHeight = $('#characterImageContainer').height();
                        var difference = Math.floor(containerHeight - 146); // Default height of all pics are 146
                        $('#characterImage').css('padding', Math.floor(difference/2) + 'px 0px ' + Math.floor(difference/2) + 'px 0px');

                        $('#defaultFancybox').remove();
                        $('#skillFancybox').removeClass('hideSkillContainer');
                    });
                    $('#characterImage').attr('src', characterString);
                });
            }
        });
    }
});

$(window).on("resize", function()
{
    is_mobile = $(".mobile").css("display") == "none";
    if (is_mobile == true)
    {
        $(".item a").each(function(index)
        {
        $(this).attr("href",$(this).find("img").attr("src")).addClass("fancybox").qtip('destroy');
        $(this).qtip('destroy');
        });

        $(".markdown-item a").each(function(index)
        {
        $(this).attr("href",$(this).find("img").attr("src")).addClass("fancybox").qtip('destroy');
        $(this).qtip('destroy');
        });

        $(".card-hover").each(function(){
            var imgSrc = $(this).attr('src')
            $(this).replaceWith($('<a class="fancybox" href="' + imgSrc + '">' + $(this).text() + '</a>'))
        })
        
        $(".fancybox").fancybox({
            selector: '.fancybox'
        });
    }
});