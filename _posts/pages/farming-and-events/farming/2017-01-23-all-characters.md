---
layout: blog
title: How to Farm All Characters
author: pll
image: /img/pages/tier-list/thumbnadsdil.png
category: page
comments: false
date: 2018-01-23
description: ADD PAGE DESCRIPTION HERE - MAX 150 CHARS
keywords: guide, in-depth guide
permalink: /farming/all-characters/
hide: true
---

{% include heading.html title=page.title %}

{% assign farm-pages-dm = site.posts | where: "category", "farming" | where: "season", "dm" %}
{% assign farm-pages-gx = site.posts | where: "category", "farming" | where: "season", "gx" %}

<div class="tab-content">
    <div class="tab-pane fade show active">
        <div class="section"> 
			<h4>Duel Monster Characters</h4>
            <div class="row button-row">
                {% for farm-page in farm-pages-dm %}
                    <div class="btn-wrapper col-sm-6 col-md-4 col-lg-3" >
                        <a class="btn-decktype" href="{{farm-page.url}}">
                            <img class="character-farm-card" src="{{farm-page.image}}"/>
                            <span class="decktype-display">{{farm-page.name}}</span>
                        </a>
                    </div>
                {% endfor %}
            </div>
        </div>
		<div class="section"> 
			<h4>GX Characters</h4>
            <div class="row button-row">
                {% for farm-page in farm-pages-gx %}
                    <div class="btn-wrapper col-sm-6 col-md-4 col-lg-3" >
                        <a class="btn-decktype" href="{{farm-page.url}}">
                            <img class="character-farm-card" src="{{farm-page.image}}"/>
                            <span class="decktype-display">{{farm-page.name}}</span>
                        </a>
                    </div>
                {% endfor %}
            </div>
        </div>
    </div>
</div>
