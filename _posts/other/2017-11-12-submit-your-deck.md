---
layout: blog
title: "SUBMIT YOUR DECK"
category: other
hide: true
image: https://i.imgur.com/AJBBqGQ.png
author: Creative
date: 2017-11-12 18:05:00 +0200
comments: false
description: ADD PAGE DESCRIPTION HERE - MAX 150 CHARS
keywords: submit your deck, deck submission, showcase deck, upload deck, deck
permalink: /submit-your-deck/
---

<div class="section">
    <h2>SUBMIT YOUR DECK</h2>
    <p>lorem ipsum dolar sit amet</p>
</div>

<div class="section">
    <form class="deck-submission" method="post" action="https://api.staticman.net/v2/entry/orctamer/duellinks/master">
        <div class="row">
            <div class="form-group col-sm-12">
                <label for="name">Deck name</label>
                <input type="text" class="form-control" id="name" name="fields[name]">
            </div>
            <div class="form-group col-sm-12">
                <label for="author">Author</label>
                <input type="text" class="form-control" id="author" name="fields[author]">
            </div>
            <div class="form-group col-sm-12">
                <label for="skill">Skill</label>
                <select class="form-control" id="skill" name="fields[skill]">
                    <option>Balance</option>
                    <option>Restart</option>
                    <option>The Tie That Binds</option>
                    <option>Mind Scan</option>
                    <option>Destiny Draw</option>
                </select>
            </div>
            <div class="form-group col-sm-5 card-search">
                <label for="searcher">Search a card</label>
                <input type="text" class="form-control" data-bind="textInput: searchTerm">
                <div id="deck">
                    <div id="cards" data-bind="foreach: filteredCards">
                        <div class="item"><a><img class="dcards" data-bind="attr: { src: 'https://yugiohprices.com/api/card_image/' + nameLink }" alt=""></a></div>
                    </div>
                </div>
            </div>
            <div class="form-group col-sm-7 card-display">
                <label for="searcher">Your deck</label>
                    <div id="deck">
                        <div id="cards">
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Dark_Magician" alt=""></a></div>
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Dark_Magician" alt=""></a></div>
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Dark_Magician" alt=""></a></div>
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Blue_Eyes_White_Dragon" alt=""></a></div>
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Blue_Eyes_White_Dragon" alt=""></a></div>
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Blue_Eyes_White_Dragon" alt=""></a></div>
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Red_Eyes_Black_Dragon" alt=""></a></div>
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Red_Eyes_Black_Dragon" alt=""></a></div>
                            <div class="item"><a><img class="dcards" src="https://yugiohprices.com/api/card_image/Red_Eyes_Black_Dragon" alt=""></a></div>
                        </div>
                    </div>
            </div>
            <div class="form-group col-sm-12">
                <label for="notes">Notes</label>
                <textarea class="form-control" id="notes" name="fields[notes]" rows="3"></textarea>
            </div>
            <div class="form-group col-sm-12 hidden">
                <input type="text" class="form-control" id="main01" name="fields[main01]" value="Flame Tiger">
                <input type="text" class="form-control" id="main02" name="fields[main02]" value="Flame Tiger">
                <input type="text" class="form-control" id="main03" name="fields[main03]" value="Flame Tiger">
                <input type="text" class="form-control" id="main04" name="fields[main04]" value="Caninetaur">
                <input type="text" class="form-control" id="main05" name="fields[main05]" value="Caninetaur">
                <input type="text" class="form-control" id="main06" name="fields[main06]" value="Caninetaur">
                <input type="text" class="form-control" id="main07" name="fields[main07]" value="Hazy Flame Sphynx">
                <input type="text" class="form-control" id="main08" name="fields[main08]" value="Hazy Flame Sphynx">
                <input type="text" class="form-control" id="main09" name="fields[main09]" value="Hazy Flame Sphynx">
                <input type="text" class="form-control" id="main10" name="fields[main10]" value="Soul Exchange">
                <input type="text" class="form-control" id="main11" name="fields[main11]" value="Enemy Controller">
                <input type="text" class="form-control" id="main12" name="fields[main12]" value="Enemy Controller">
                <input type="text" class="form-control" id="main13" name="fields[main13]" value="Enemy Controller">
                <input type="text" class="form-control" id="main14" name="fields[main14]" value="Floodgate Trap Hole">
                <input type="text" class="form-control" id="main15" name="fields[main15]" value="Floodgate Trap Hole">
                <input type="text" class="form-control" id="main16" name="fields[main16]" value="Mirror Wall">
                <input type="text" class="form-control" id="main17" name="fields[main17]" value="Mirror Wall">
                <input type="text" class="form-control" id="main18" name="fields[main18]" value="Mirror Wall">
                <input type="text" class="form-control" id="main19" name="fields[main19]" value="Beast Rising">
                <input type="text" class="form-control" id="main20" name="fields[main20]" value="Beast Rising">
            </div>
            <div class="form-group col-sm-1">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </div>
    </form>
    <div class="game-board hidden">
        <div class="card-slot-row">
            <div class="card-slot"><img src="http://img3.wikia.nocookie.net/__cb20130902115200/yugioh/images/e/ee/Back-ZX-Site.png" /></div>
            <div class="card-slot"></div>
            <div class="card-slot"><img src="http://img3.wikia.nocookie.net/__cb20130902115200/yugioh/images/e/ee/Back-ZX-Site.png" /></div>
            <div class="card-slot"></div>
            <div class="card-slot"></div>
        </div>
        <div class="card-slot-row">
            <div class="card-slot"><img src="https://yugiohprices.com/api/card_image/Machine_Angel_Ritual" /></div>
            <div class="card-slot"></div>
            <div class="card-slot"><img src="https://yugiohprices.com/api/card_image/Cyber_Angel_Dakini" /></div>
            <div class="card-slot"></div>
            <div class="card-slot"></div>
        </div>
        <div class="game-phase"></div>
        <div class="card-slot-row">
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            <div class="card-slot"><img src="https://yugiohprices.com/api/card_image/Black_Dragon_Ninja" /></div>
            <div class="card-slot"><img class="rotated" src="https://yugiohprices.com/api/card_image/Crimson_Ninja" /></div>
            <div class="card-slot"><img src="https://yugiohprices.com/api/card_image/Ninjitsu_Art_of_Transformation" /></div>
        </div>
        <div class="card-slot-row">
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            <div class="card-slot"><img src="http://img3.wikia.nocookie.net/__cb20130902115200/yugioh/images/e/ee/Back-ZX-Site.png" /></div>
            <div class="card-slot"></div>
            <div class="card-slot"><img src="http://img3.wikia.nocookie.net/__cb20130902115200/yugioh/images/e/ee/Back-ZX-Site.png" /></div>
        </div>
    </div>
</div>