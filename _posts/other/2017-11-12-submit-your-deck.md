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
            <label for="cards">Cards</label>
            <select multiple class="form-control" name="fields[cards]" id="cards">
                <option>Yomi Ship</option>
                <option>Sphere Kuriboh</option>
                <option>Vorse Raider</option>
                <option>Enemy Controller</option>
                <option>Mirror Wall</option>
            </select>
        </div>
        <div class="form-group">
            <label for="notes">Notes</label>
            <textarea class="form-control" id="notes" name="fields[notes]" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</div>