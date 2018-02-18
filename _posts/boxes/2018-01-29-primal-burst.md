---
layout: blog
date: 2018-01-28
title: "Box: Primal Burst"
author: Yami Hammy
category: box
image: https://i.imgur.com/wNoW7nN.jpg
comments: true
description: Overview of the primal burst box.
keywords: box, boxset, primal burst
permalink: /boxes/primal-burst/
---

{% include heading.html title=page.title %}

{% include oneimage.html image="https://i.imgur.com/wNoW7nN.jpg" %}

<div class="row">
    {% for item in site.data.box.primal-burst %}
        {% include box.html cardname=item %}
    {% endfor %}
</div>