---
layout: blog
title: Farming & Events
author: Creative; pll
image: /img/pages/events/thumbnail-yami-marik.jpg
category: page
sub-category: main
order: 5
comments: false
date: 2018-03-17 01:29:00 -0600
description: Check out active events and how best to farm them as well as events that have happened in the past!
keywords: event, events, new event, farming, duel assessment, score, farm decks
permalink: /farming-and-events/
---



{% include heading.html title='Active Events' %}
{% assign active-events = site.categories.event | where: "ended", false | where_exp: "item", "item.hidden != true" | sort: "date" | reverse %}

<div class="row card-collection">
  {% for event in active-events %}
    {% include articles/article.html article=event options='3' %}
  {% endfor %}
</div>



{% include heading.html title='Farming' %}
{% assign farm-all-chars = site.posts | where: "permalink", "/farming/all-characters/" | first %}
{% assign duel-ass-score = site.posts | where: "permalink", "/farming/duel-assessment-score/" | first %}
{% assign skills = site.posts | where: "permalink", "/skills/" | first %}

<div class="row card-collection">
  {% include articles/article.html article=farm-all-chars options='3, 4, 5, 6' %}
  {% include articles/article.html article=duel-ass-score options='3, 4, 5, 6' %}
  {% include articles/article.html article=skills options='3, 4, 5, 6' %}
</div>



{% include heading.html title='Past Events' %}
{% assign past-events = site.categories.event | where: "ended", true | where_exp: "item", "item.hidden != true" | sort: "date" | reverse %}

<div class="row card-collection">
  {% for event in past-events %}
    {% include articles/article.html article=event options='3' %}
  {% endfor %}
</div>