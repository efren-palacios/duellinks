---
layout: blog
date: 2018-03-26
title: Meta Weekly Tournament Information
author: Creative
image: /img/logos/meta-weekly.png
category: page
comments: false
description: The Meta Weekly is a tournament that is held once a week, alternating between Tuesday 2pm EST and Wednesday 7pm EST. There is no player cap, nor is there a deadline to join. You can even join at the very last second! Read up on how to join the meta weekly here.
keywords: meta weekly, tournament, weekly, information, how to join, time, rules, reports
permalink: /tournaments/meta-weekly/
---

{% include heading.html title=page.title %}

![](/img/logos/meta-weekly.png)

### What is Meta Weekly?
The Meta Weekly is a tournament that is held once a week, alternating between Tuesday 2pm EST and Wednesday 7pm EST. There is no player cap, nor is there a deadline to join - you can even join at the very last second!

### How to Join
Subscribe to DuelLinksMeta on [Twitch](https://www.twitch.tv/duellinksmeta) or check out the [Top Player](/discord/) page for more info!
  
{% assign reports = site.posts | where: "category", "tournament" | where: "tournament", "Meta Weekly" | where_exp: "item", "item.hidden != true" | sort: "number" | reverse %}

<div class="section">
    <h3>Past Meta Weekly Reports</h3>
    <div class="row card-collection">
        {% for report in reports %}
            <div class="col-sm-6 col-12 card-deck">  
                <div class="card">
                    <div class="card-block text-white">
                    <a href="{{report.url}}">
                        <h4 class="card-title">{{report.title}}</h4>
                    </a>
                    <div class="text-white">
                        <small class="text-muted">Last Updated: {{ report.date | timeago }}
                        {% if report.author == 'Dkayed' %}
                        by <b><a class="text-danger" href="/authors/{{report.author}}">{{report.author}}</a></b> {% else %}
                        by <b><a class="text-warning" href="/authors/{{report.author}}">{{report.author}}</a></b> {% endif %}
                        </small>
                    </div>
                    </div>
                </div>
            </div>
        {% endfor %}
    </div>     
</div>