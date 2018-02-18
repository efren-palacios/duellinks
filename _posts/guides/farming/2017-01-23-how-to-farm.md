---
layout: blog
title: How to Farm All Characters
author: pll
image: /img/pages/tier-list/thumbnadsdil.png
category: other
comments: false
hide: true
date: 2018-01-23
description: ADD PAGE DESCRIPTION HERE - MAX 150 CHARS
keywords: guide, in-depth guide
permalink: /guides/how-to-farm-all-characters/
---

{% include heading.html title=page.title %}

<div class="tab-content">
    <div class="tab-pane fade show active">
        <div class="section"> 
			<h4>Duel Monster characters</h4>
            <div class="row button-row">
                {% for farm in site.categories.farm %}
					{% assign season = farm.season | downcase %}
					{% if season == 'dm' %}
                    <div class="btn-wrapper col-sm-6 col-md-4 col-lg-3" >
                        <a class="btn-decktype" href="{{site.url}}{{farm.id}}">
                            <img class="character-farm-card" src="{{farm.image}}"/>
                            <span class="decktype-display">{{farm.name}}</span>
                        </a>
                    </div>
					{% endif %}
                {% endfor %}
            </div>
        </div>
		<div class="section"> 
			<h4>GX characters</h4>
            <div class="row button-row">
                {% for farm in site.categories.farm %}
					{% assign season = farm.season | downcase %}
					{% if season == 'gx' %}
                    <div class="btn-wrapper col-sm-6 col-md-4 col-lg-3" >
                        <a class="btn-decktype" href="{{site.url}}{{farm.id}}">
                            <img class="character-farm-card" src="{{farm.image}}"/>
                            <span class="decktype-display">{{farm.name}}</span>
                        </a>
                    </div>
					{% endif %}
                {% endfor %}
            </div>
        </div>
    </div>
</div>
