---
layout: blog
title: Burn
meta: Top Decks - Burn
author: Creative
date: 2017-10-07
comments: true
description: In depth information about Burn decks.
permalink: /top-decks/burn-decks/
---

## {{page.title}}

<p class="text-muted"> {{page.description}} </p>

<div>
    <p>HERE COMES INFO ABOUT BURN DECKS</p>
    <p>how to play, strong points, weak points, key cards, replacements, combos, matchups, why in current tier?, ...</p>
</div>

<table class="table" style="margin-top: 2rem;" id="TopDeckTable">
    <thead>
        <tr>
            <th>Deck Name</th>
            <th>Author</th>
            <th>Added</th>
        </tr>
    </thead>
    <tbody>
        {% for deck in site.data.decklists.burn-decks %}
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-1">
                            <div class="thumbnail">
                                <img src="https://yugiohprices.com/api/card_image/{{deck[1].main[0].name}}" class="portrait" />  
                            </div>
                        </div>
                        <div class="col-lg-11">
                            <a href="{{site.url}}/top-decks/burn-decks/{{deck[1].name | downcase | replace: " ", "-" }}">{{deck[1].name}}</a>    
                        </div>
                    </div>
                </th>
                <th>{{deck[1].author}}</th>
                <th>{{deck[1].created}}</th>
            </tr>
        {% endfor %}
    </tbody>
</table>