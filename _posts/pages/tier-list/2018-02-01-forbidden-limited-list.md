---
layout: blog
title: Forbidden/Limited List
author: unpreceden7ed
category: page
comments: false
date: 2018-2-01 09:39:00 -0600
description: This page contains the current and upcoming status of the Forbidden/Limited list
permalink: /tier-list/forbidden-limited-list/
hide: true
---

{% include heading.html title=page.title description=page.description %}

{% assign changelog = site.data.forbidden-limited-changelog %}
{% assign sortedLog = changelog | sort: 'date' | reverse %}
{% assign firstDate = sortedLog[0].date %}
<div class="section">
    <h3>Last Updated: {{ firstDate | date: "%B %d, %Y" }}</h3>
    <ul>
        {% assign changelog_current = sortedLog | where: "date", firstDate %}
        {% for log in changelog_current %}
            {% if log.from == "nothing" %}
                <li>{{ log.name }} was added to {{ log.to }}</li>
            {% elsif log.to == "nothing" %}
                <li>{{ log.name }} was removed</li>
            {% else %}
                <li>{{ log.name }} moved from {{ log.from }} to {{ log.to }}</li>
            {% endif %}
        {% endfor %}    
    </ul>
</div>

<div class="section">
    {% assign categories = site.data.forbidden-limited-list | where: "section", "Forbidden" %}
    {% for category in categories %}
        <h4>FORBIDDEN</h4>
        <p>{{category.info}}</p>
        {% assign cards = category.cards | sort: "name" %}
        {% if cards.size > 0 %}
            <div class="flex-container">
                <div class="deck-container left">
                    <div id="deck">
                        <div id="cards">                        
                            {% for card in cards %}
                                <div class="item">
                                    <a><img class="dcards" name="cardPopup" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/{{ card.name | url_encode }}&il" alt="{{ card.name| url_encode }}"></a>
                                </div>
                            {% endfor %}
                        </div>
                    </div>
                </div>
            </div>
        {% endif %}
    {% endfor %}        
</div>

<div class="section">
    {% assign categories = site.data.forbidden-limited-list | where: "section", "Limited" %}
    {% for category in categories %}
        <h4>LIMITED</h4>
        <p>{{category.info}}</p>
        {% assign cards = category.cards | sort: "name" %}
        {% if cards.size > 0 %}
            <div class="flex-container">
                <div class="deck-container left">
                    <div id="deck">
                        <div id="cards">                        
                            {% for card in cards %}
                                <div class="item">
                                    <a><img class="dcards" name="cardPopup" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/{{ card.name | url_encode }}&il" alt="{{ card.name| url_encode }}"></a>
                                </div>
                            {% endfor %}
                        </div>
                    </div>
                </div>
            </div>
        {% endif %}  
    {% endfor %}        
</div>

<div class="section">
    {% assign categories = site.data.forbidden-limited-list | where: "section", "Semi-Limited" %}
    {% for category in categories %}
        <h4>SEMI-LIMITED</h4>
        <p>{{category.info}}</p>
        {% assign cards = category.cards | sort: "name" %}
        {% if cards.size > 0 %}
            <div class="flex-container">
                <div class="deck-container left">
                    <div id="deck">
                        <div id="cards">                        
                            {% for card in cards %}
                                <div class="item">
                                    <a><img class="dcards" name="cardPopup" src="https://images.weserv.nl/?url=yugiohprices.com/api/card_image/{{ card.name | url_encode }}&il" alt="{{ card.name| url_encode }}"></a>
                                </div>
                            {% endfor %}
                        </div>
                    </div>
                </div>
            </div>
        {% endif %}
    {% endfor %}        
</div>