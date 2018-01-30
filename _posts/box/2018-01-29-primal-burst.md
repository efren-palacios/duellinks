---
layout: blog
title: Box - Primal Burst
meta: New Box
categories: box
image: https://i.imgur.com/wNoW7nN.jpg
author: Yami Hammy
date: 2018-01-28
comments: true
---

{% include oneimage.html image="https://i.imgur.com/wNoW7nN.jpg" %}

<div class="row">
{% for item in site.data.box.list %}
{% include box.html cardname=item %}
{% endfor %}
</div>