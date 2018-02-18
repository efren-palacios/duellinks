---
layout: blog
date: 2017-11-02 10:45:00 -0600
title: "Box: Galactic Origin"
author: Dkayed
category: box
image: https://i.imgur.com/qFL4ijU.jpg
comments: true
description: Overview of the galactic origin box.
keywords: box, boxset, galactic origin
permalink: /boxes/galactic-origin/
---

{% include heading.html title=page.title %}

{% include oneimage.html image="https://i.imgur.com/qFL4ijU.jpg" %}

<div class="row">
    {% for item in site.data.box.galactic %}
        {% include box.html cardname=item %}
    {% endfor %}
</div>