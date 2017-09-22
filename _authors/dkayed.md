---
layout: blog
title: "Dkayed"
meta: "Owner"
categories: authors
image: https://i.imgur.com/AZaNe2i.png
author: Dkayed
date: 2017-9-22 01:32:00 -0600
comments: true
---

<h1 class="text-center">{{page.author}}</h1>
<img width="100px" src='{{page.image}}' class="img-fluid" />

<div class="row justify-content-center text-center">
{% assign author = site.posts | where:"author","Dkayed" %}
{% for card in author %}
  <div class="col-sm-4 col-12 card-deck header">
    <div class="card">
      <div class="zoom">
        <a href='{{site.url}}{{card.url}}'> 
            <img
            src="https://images.weserv.nl/?url={{card.image | replace: 'https://', ''}}&w=200&blur=5"
            data-src="{{card.image}}"
            class="card-img-top lazyload" />
        </a>
      </div>
      <div class="card-block text-white">
        <a href='{{site.url}}{{card.url}}'>
          <h4 class="card-title">{{card.title}}</h4>
        </a>
        <div class="text-white">
                <small class="text-muted">Last Updated: {{ card.date | date: '%B %d, %Y' }}
              </small>
        </div>
      </div>

    </div>
  </div>
  {% endfor %}
  </div>