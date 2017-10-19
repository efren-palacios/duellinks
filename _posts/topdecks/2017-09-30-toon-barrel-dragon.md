---
layout: blog
title: Toon Barrel Dragon
meta: Top Decks - Toon Barrel Dragon
author: unpreceden7ed
date: 2017-09-30
comments: true
description: In depth information about Toon Barrel Dragon decks.
permalink: /top-decks/toon-barrel-dragon/
---

## {{page.title}}

<p class="text-muted"> {{page.description}} </p>

<div>
    <p>HERE COMES INFO ABOUT TOON BARREL DRAGON DECKTYPE</p>
    <p>how to play, strong points, weak points, key cards, replacements, combos, matchups, why in current tier?, ...</p>
</div>

<table class="table">
    <thead>
        <tr>
            <th>Deck Name</th>
            <th>Author</th>
            <th>Added</th>
        </tr>
    </thead>
    <tbody>
        {% for deck in site.data.decklists.toon-barrel-dragon %}
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-1">
                            <div class="thumbnail">
                                <img src="https://yugiohprices.com/api/card_image/{{deck[1].main[0].name}}" class="portrait" />  
                            </div>
                        </div>
                        <div class="col-lg-11">
                            <a href="{{site.url}}/top-decks/toon-barrel-dragon/{{deck[1].name | downcase | replace: " ", "-" }}">{{deck[1].name}}</a>    
                        </div>
                    </div>
                </th>
                <th>{{deck[1].author}}</th>
                <th>{{deck[1].created}}</th>
            </tr>
        {% endfor %}
    </tbody>
</table>