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
    <form method="post" action="https://api.staticman.net/v2/entry/orctamer/duellinks/master">
        <div class="form-group">
            <label for="name">Deck name</label>
            <input type="text" class="form-control" id="name" name="fields[name]">
        </div>
        <div class="form-group">
            <label for="author">Author</label>
            <input type="text" class="form-control" id="author" name="fields[author]">
        </div>
        <div class="form-group">
            <label for="skill">Skill</label>
            <select class="form-control" id="skill" name="fields[skill]">
                <option>Balance</option>
                <option>Restart</option>
                <option>The Tie That Binds</option>
                <option>Mind Scan</option>
                <option>Destiny Draw</option>
            </select>
        </div>
        <div class="form-group">
            <label for="notes">Notes</label>
            <textarea class="form-control" id="notes" name="fields[notes]" rows="3"></textarea>
        </div>
        <div class="form-group hidden">
            <input type="text" class="form-control" id="main01" name="fields[main01]" value="Mirror Wall">
            <input type="text" class="form-control" id="main02" name="fields[main02]" value="Dark Magician">
            <input type="text" class="form-control" id="main03" name="fields[main03]" value="Thousand Knives">
            <input type="text" class="form-control" id="main04" name="fields[main04]" value="Beaver Warrior">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
    <div class="game-board hidden">
        <div class="card-slot-row">
            <div class="card-slot"><img src="http://img3.wikia.nocookie.net/__cb20130902115200/yugioh/images/e/ee/Back-ZX-Site.png" /></div>
            <div class="card-slot"></div>
            <div class="card-slot"><img src="https://yugiohprices.com/api/card_image/Mirror_Wall" /></div>
            <div class="card-slot"><img src="http://img3.wikia.nocookie.net/__cb20130902115200/yugioh/images/e/ee/Back-ZX-Site.png" /></div>
            <div class="card-slot"></div>
        </div>
        <div class="card-slot-row">
            <div class="card-slot"><img src="https://yugiohprices.com/api/card_image/Burst Stream of Destruction" /></div>
            <div class="card-slot"></div>
            <div class="card-slot"><img class="rotated" src="https://yugiohprices.com/api/card_image/Blue_Eyes_White_Dragon" /></div>
            <div class="card-slot"></div>
            <div class="card-slot"></div>
        </div>
        <div class="game-phase"></div>
        <div class="card-slot-row">
            <div class="card-slot"></div>
            <div class="card-slot"></div>
            <div class="card-slot">
                <img src="https://yugiohprices.com/api/card_image/Dark_Magician" />
            </div>
            <div class="card-slot"></div>
            <div class="card-slot"><img src="https://yugiohprices.com/api/card_image/Thousand_Knives" /></div>
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