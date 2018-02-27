---
layout: blog
title: Farming & Events
author: Dkayed
image: https://i.imgur.com/NPQiG8p.png
category: page
sub-category: main
order: 5
comments: false
date: 2018-02-11 01:29:00 -0600
description: ADD PAGE DESCRIPTION HERE - MAX 150 CHARS
keywords: event, events, new event, farming, duel assessment, score, farm decks
permalink: /farming-and-events/
---

{% include heading.html title='Active Events' %}

<div class="row card-collection">
  {% assign active-events = site.categories.event | where: "ended", false %}
  {% for event in active-events %}
    {% if event.hide == null or event.hide == false %}
    <div class="col-sm-6 col-12 card-deck">
      <div class="card">
        <div class="zoom">
          <a href="{{event.url}}" class="gallerypic" title="">
            <img src="{{event.image}}" class="card-img-top lazyload" />
          </a>
        </div>
        <div class="card-block text-white">
          <a href="{{ site.url }}{{ event.url }}">
            <h4 class="card-title">{{event.title}}</h4>
          </a>
          <div class="text-white">
            <small class="text-muted">Last Updated: {{ event.date | timeago }}
              By <b><a class="text-warning" href="/authors/{{event.author}}.html">{{event.author}}</a></b> <!-- TODO: CHECK IF AUTHOR HAS PROFILE FIRST -->
            </small>
          </div>
        </div>
      </div>
    </div>
    {% endif %}
  {% endfor %}
</div>

{% include heading.html title='Farming' %}

<div class="row card-collection">
  <div class="col-sm-6">
    <div class="card">
      <div class="zoom">
        <a href="/farming/all-characters/" class="gallerypic" title="">
          <img src="/img/pages/farm-all-characters/thumbnail.png" class="card-img-top lazyload" />
        </a>
      </div>
      <div class="card-block text-white">
        <a href="/farming/all-characters/">
          <h4 class="card-title">Farming all Characters</h4>
        </a>
      </div>
    </div>
  </div>
  <div class="col-sm-6">
    <div class="card">
      <div class="zoom">
        <a href="/farming/duel-assessment-score/" class="gallerypic" title="">
          <img src="/img/guides/farming/farming.jpg" class="card-img-top lazyload" />
        </a>
      </div>
      <div class="card-block text-white">
        <a href="/farming/duel-assessment-score/">
          <h4 class="card-title">Duel Assessment Score</h4>
        </a>
      </div>
    </div>
  </div>
</div>


{% include heading.html title='Past Events' %}

<div class="row card-collection">
  {% assign active-events = site.categories.event | where: "ended", true %}
  {% for event in active-events %}
    {% if event.hide == null or event.hide == false %}
    <div class="col-sm-6 col-12 card-deck">
      <div class="card">
        <div class="zoom">
          <a href="{{event.url}}" class="gallerypic" title="">
            <img src="{{event.image}}" class="card-img-top lazyload" />
          </a>
        </div>
        <div class="card-block text-white">
          <a href="{{ site.url }}{{ event.url }}">
            <h4 class="card-title">{{event.title}}</h4>
          </a>
          <div class="text-white">
            <small class="text-muted">Last Updated: {{ event.date | timeago }}
              By <b><a class="text-warning" href="/authors/{{event.author}}.html">{{event.author}}</a></b> <!-- TODO: CHECK IF AUTHOR HAS PROFILE FIRST -->
            </small>
          </div>
        </div>
      </div>
    </div>
    {% endif %}
  {% endfor %}
</div>

<!--
<ul>
  {% for event in site.categories.event offset: 4 limit:16 %}
    {% if event.hide == null or event.hide == false %}
      <li>
        <a href="{{ event.url }}">{{ event.title }}</a>
      </li>
    {% endif %}
  {% endfor %}
</ul>
-->