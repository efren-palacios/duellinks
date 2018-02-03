---
layout: blog
title: Forbidden/Limited List
author: unpreceden7ed
category: other
comments: false
date: 2018-2-01 09:39:00 -0600
description: This page contains the current and upcoming status of the Forbidden/Limited list
permalink: /forbidden-limited-list/
hide: true
---

{% include heading.html title=page.title description=page.description %}

{% assign changelog = site.data.forbidden-limited-changelog %}
{% assign sortedLog = changelog | sort: 'date' | reverse %}
{% assign firstDate = sortedLog[0].date %}
<div class="section">
    <h3>Last Updated: {{ firstDate | date: "%B %d, %Y" }}</h3>
    <ul>
        {% assign changelog_current = sortedLog | where: "date", firstDate %}
        {% for log in changelog_current %}
            {% if log.from == "nothing" %}
                <li>{{ log.name }} was added to {{ log.to }}</li>
            {% elsif log.to == "nothing" %}
                <li>{{ log.name }} was removed</li>
            {% else %}
                <li>{{ log.name }} moved from {{ log.from }} to {{ log.to }}</li>
            {% endif %}
        {% endfor %}    
    </ul>
</div>

<div class="section">
    {% assign categories = site.data.forbidden-limited-list | where: "section", "Forbidden" %}
    {% for category in categories %}
        <h4>FORBIDDEN</h4>
        <p>{{category.info}}</p>
        <ul>
            {% assign cards = category.cards | sort: "name" %}
            {% for card in cards %}
                <li>{% raw %}{{% endraw %}{{card.name}}{% raw %}}{% endraw %}</li>
            {% endfor %}
        </ul>  
    {% endfor %}        
</div>

<div class="section">
    {% assign categories = site.data.forbidden-limited-list | where: "section", "Limited" %}
    {% for category in categories %}
        <h4>LIMITED</h4>
        <p>{{category.info}}</p>
        <ul>
            {% assign cards = category.cards | sort: "name" %}
            {% for card in cards %}
                <li>{% raw %}{{% endraw %}{{card.name}}{% raw %}}{% endraw %}</li>
            {% endfor %}
        </ul>  
    {% endfor %}        
</div>

<div class="section">
    {% assign categories = site.data.forbidden-limited-list | where: "section", "Semi-Limited" %}
    {% for category in categories %}
        <h4>SEMI-LIMITED</h4>
        <p>{{category.info}}</p>
        <ul>
            {% assign cards = category.cards | sort: "name" %}
            {% for card in cards %}
                <li>{% raw %}{{% endraw %}{{card.name}}{% raw %}}{% endraw %}</li>
            {% endfor %}
        </ul>  
    {% endfor %}        
</div>




