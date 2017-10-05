---
layout: blog
title: Top Decks - Cyber Angels
meta: Top Decks - Toon Barrel Dragon
author: Creative
date: 2017-10-05
comments: true
description: Check out the latest version of the most popular Duel Links decklists.
filterTitle: Filter by Type    
permalink: /topdecks/cyber-angels/
---

## {{page.title}}

<p class="text-muted"> {{page.description}} </p>

## {{page.filterTitle}}

{% include decktype_filter.html %}

<table class="table" style="margin-top: 2rem;" id="topDeckTable">
    <thead>
        <tr>
            <th>Deck Name</th>
            <th>Author</th>
            <th>Added</th>
        </tr>
    </thead>
    <tbody>
        {% for deck in site.data.decklists.cyber-angels %}
            <tr>
                <th>
                    <div class="row">
                        <div class="col-lg-1">
                            <div class="thumbnail">
                                <img src="http://yugiohprices.com/api/card_image/{{deck[1].main[0].name}}" class="portrait" />  
                            </div>
                        </div>
                        <div class="col-lg-11">
                            <a href="{{site.url}}/topdecks/cyber-angels/{{deck[1].name | downcase | replace: " ", "-" }}">{{deck[1].name}}</a>    
                        </div>
                    </div>
                </th>
                <th>{{deck[1].author}}</th>
                <th>{{deck[1].created}}</th>
            </tr>
        {% endfor %}
    </tbody>
</table>