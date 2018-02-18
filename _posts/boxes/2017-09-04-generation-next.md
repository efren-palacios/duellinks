---
layout: blog
date: 2017-09-19 10:45:00 -0600
title: "Box: Generation Next"
author: Dkayed
category: box
image: https://i.imgur.com/eB5UjMk.png
comments: true
description: Overview of the generation next box.
keywords: box, boxset, generation next
permalink: /boxes/generation-next/
---

{% include heading.html title=page.title %}

{% include oneimage.html image="https://i.imgur.com/eB5UjMk.png" %}

<div class="row">
    {% for item in site.data.box.list %}
        {% include box.html cardname=item %}
    {% endfor %}
</div>