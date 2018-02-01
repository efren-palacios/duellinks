---
layout: blog
title: Box - Galactic Origin
author: Dkayed
meta: New Box
categories: box
image: https://i.imgur.com/qFL4ijU.jpg
date: 2017-11-02 10:45:00 -0600
comments: true
---

{% include heading.html title=page.title %}

{% include oneimage.html image="https://i.imgur.com/qFL4ijU.jpg" %}

<div class="row">
    {% for item in site.data.box.galactic %}
        {% include box.html cardname=item %}
    {% endfor %}
</div>