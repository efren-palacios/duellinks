---
layout: blog
title: Top Deck Build
author: unpreceden7ed
comments: true
permalink: /topdecks/deckbuild/
---

## {{site.data.decklists.toons.1song.name}}
#### {{site.data.decklists.toons.1song.author}}

<p style="margin-top: 2rem;">Added {{site.data.decklists.toons.1song.date}}</p>

<ul class="list-group">
    <h4 style="margin: 1rem 0;">Main Deck</h4>
    {% assign main = site.data.decklists.toons.1song.main %}
    {% for item in main %}
        {% include deckbuild.html card=item %}
    {% endfor %}
    {% assign extra = site.data.decklists.toons.1song.extra %}
    {% if extra != null %}
        <h4 style="margin: 1rem 0;">Extra Deck</h4>
        {% for item in extra %}
            {% include deckbuild.html card=item %}
        {% endfor %}
    {% endif %}
</ul>


