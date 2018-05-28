---
layout: blog
title: The Dev Team
category: page
permalink: /the-dev-team/
---
<section class="team">
  <div class="container">
    <div>
      <h6 class="description">The Dev Team</h6>
      <div class="row">
        {% assign developerProfiles = site.data.profiles | where: "role", "developer" %} {% for profile in developerProfiles %}
        <div class="col-2 devprofile">
          {% assign profileData = profile.name | profileData %}
          <a href="{{ profileData.url }}">
            <img src="{{ profile.image }}" class="img-responsive devProfileImg">
          </a>
          <h1>{{ profile.name }}</h1>
        </div>
        {% endfor %}
      </div>
    </div>
  </div>
</section>
