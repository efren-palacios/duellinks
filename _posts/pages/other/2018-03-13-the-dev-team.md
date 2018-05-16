---
layout: blog
title: The Dev Team
category: page
permalink: /the-dev-team/
---
<section class="team">
  <div class="container">
    <div class="row">
      <div>
        <div class="col-lg-12">
          <h6 class="description">The Dev Team</h6>
          <div class="row pt-md">
          {% assign developerProfiles = site.data.profiles | where: "role", "developer" %}
          {% for profile in developerProfiles %}
            <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12 devprofile">
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
    </div>
  </div>
</section>
