---
layout: blog
date: 2018-05-23 22:00:00 +0100
title: MCS 9 Announcement
author: Yami Hammy
image: /img/content/news/2018/05/mcs-9-announcement/thumbnail.jpg
category: news
comments: true
description: All the information you need to know about MCS 9!
keywords: mcs, mcs 9, 9, meta championship series
permalink: /news/may-2018/mcs-9-announcement/
pinned: true
---

{% assign reports = site.posts | where: "category", "tournament" | where: "tournament", "Meta Championship Series" | where_exp: "item",
"item.hidden != true" | sort: "number" | reverse %}
{% assign last-report = reports | first %}

{% include heading.html title=page.title author=page.author %}

<div class="section center">
    <h4><a href="/tournaments/">Meta Championship Series 9 will take place on June 2nd at 1pm EST!</a></h4>  
</div>

<br>

The Meta Championship Series is Duel Links' largest and most competitive tournament held monthly for cash prizes. It's where the best players compete for the largest prize pool in Duel Links with **over $20,000** given out already!

### Format
- 7 rounds, top 32 cut
- 140 player cap, all x-2 make the top cut
- 1 deck with a 5 card side deck
- $10 entry fee
- 100% of the entry fee + 100% stream donations are prize support 

### How to Join
In order of priority:
- Past MCS champions
- Top Player Council
- Top 100 [Meta Ladder](/tournaments/)
- Top 32 [Giveaway Tournament](https://smash.gg/tournament/give-away-tournament-1/details) that will take place May 29th

You **must** message Gia (GiaJoestar#7730) for your invite and must purchase entry before May 30th or you **lose** your invite priority.

The King of Games players of May will receive the remaining invites (if any) on May 30th and subscribers may have an opportunity to attain the "excess" invites that aren't claimed or paid for.

### Current Sponsor - NerdChic: $500

<br>

<div class="section center">
    <h4>Here are all the past MCS reports</h4>
    <ul>
        {% for report in reports %}
            <li><a href="{{report.url}}">{{report.tournament | upcase}} #{{report.number}}</a></li>
        {% endfor %}
    </ul>     
</div>