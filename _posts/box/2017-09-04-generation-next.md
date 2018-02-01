---
layout: blog
title: Box - Generation Next
author: Dkayed
meta: New Box
categories: box
image: https://i.imgur.com/eB5UjMk.png
date: 2017-09-19 10:45:00 -0600
comments: true
---

{% include heading.html title=page.title %}

{% include oneimage.html image="https://i.imgur.com/eB5UjMk.png" %}

<div class="row">
{% for item in site.data.box.list %}
{% include box.html cardname=item %}
{% endfor %}
</div>