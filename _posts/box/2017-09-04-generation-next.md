---
layout: blog
title: Box - Generation Next
meta: New Box
categories: box
image: https://i.imgur.com/eB5UjMk.png
author: Dkayed
date: 2017-09-19 10:45:00 -0600
comments: true
---

{% include oneimage.html image="https://i.imgur.com/eB5UjMk.png" %}


{% for item in site.data.box.list %}
{% include box.html cardname=item %}
{% endfor %}