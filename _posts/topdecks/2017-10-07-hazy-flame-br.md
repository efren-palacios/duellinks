---
layout: blog
title: Hazy Flame BR
category: decktype-guide
author: Creative
date: 2017-10-07
comments: false
description: In depth information about Hazy Flame BR decks.
type: hazy-flame-br
permalink: /tier-list/hazy-flame-br/
---

{% assign guide = site.data.decktype-guides[{{page.type}}] | where: "active", true %}

<div class="decktype-guide">
    <div class="header">
        <h2>{{guide[0].title}}</h2> by {{guide[0].created-by}}
    </div>
    <img class="splash" src="/img/card-splashes/{{guide[0].card-splash}}.png">
    
    {% for section in guide[0].sections %}
        {% include guides/section.html section=section level=1 %}
    {% endfor %}
</div>


{% include decktype_decks.html decktype=page.type %}