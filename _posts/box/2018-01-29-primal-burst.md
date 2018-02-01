---
layout: blog
title: Box - Primal Burst
author: Yami Hammy
meta: New Box
categories: box
image: https://i.imgur.com/wNoW7nN.jpg
date: 2018-01-28
comments: true
---

{% include heading.html title=page.title %}

{% include oneimage.html image="https://i.imgur.com/wNoW7nN.jpg" %}

<div class="row">
{% for item in site.data.box.primal-burst %}
{% include box.html cardname=item %}
{% endfor %}
</div>