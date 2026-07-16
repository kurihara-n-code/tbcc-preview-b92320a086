(function () {
  "use strict";

  var data = window.LP_CONTENT;
  if (!data) return;
  function escLines(value) {
    return esc(value)
      .replace(/（税抜）(?:\\n|\r\n|\n|\s+)(?=\S)/g, "（税抜）<br>")
      .replace(/\\n|\r\n|\n/g, "<br>");
  }

  function tabLabel(value) {
    return esc(value)
      .replace(/\\n|\r\n|\n/g, "\n")
      .split("\n")
      .map(function (line) {
        var className = /^（.*）$/.test(line) ? "tab-level" : "tab-title";
        return '<span class="' + className + '">' + line + '</span>';
      })
      .join("");
  }
  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function imageStyle(path) {
    return "background-image:url('" + path + "')";
  }

  document.getElementById("vision-grid").innerHTML = data.visions.map(function (item) {
    return [
      '<article class="vision-card">',
      '<div class="vision-photo" style="', imageStyle(item.image), '" role="img" aria-label="', esc(item.title), '"></div>',
      '<div class="vision-body"><h3>', esc(item.title), '</h3><p>', esc(item.text), "</p></div>",
      "</article>"
    ].join("");
  }).join("");

  document.getElementById("lead-copy").innerHTML = data.leadParagraphs.map(function (text) {
    return "<p>" + esc(text) + "</p>";
  }).join("");

  document.getElementById("practice-list").innerHTML = data.practices.map(function (item, index) {
    return [
      '<article class="practice-row', index % 2 ? " reverse" : "", '">',
      '<div class="practice-photo" style="', imageStyle(item.image), '" role="img" aria-label="', esc(item.title), '"></div>',
      '<div class="practice-copy"><p class="practice-number"><span>POINT</span><strong>', esc(item.number), "</strong></p>",
      item.tag ? '<span class="practice-tag">' + esc(item.tag) + "</span>" : "",
      "<h3>", esc(item.title), "</h3><p>", esc(item.text), "</p></div>",
      "</article>"
    ].join("");
  }).join("");

  document.getElementById("support-grid").innerHTML = data.supports.map(function (item) {
    return [
      '<article class="support-card" data-mark="', esc(item.mark), '"><span class="support-mark"><span>Support</span>', esc(item.mark), "</span>",
      "<h3>", esc(item.title), "</h3><p>", esc(item.text), "</p></article>"
    ].join("");
  }).join("");

  var tabs = document.getElementById("course-tabs");
  var panels = document.getElementById("course-panels");

  tabs.innerHTML = data.courses.map(function (course, index) {
    return [
      '<button type="button" role="tab" id="tab-', esc(course.id), '" aria-controls="panel-', esc(course.id),
      '" aria-selected="', index === 0 ? "true" : "false", '" tabindex="', index === 0 ? "0" : "-1", '">',
      tabLabel(course.tab), "</button>"
    ].join("");
  }).join("");

  panels.innerHTML = data.courses.map(function (course, index) {
    var details = course.details.map(function (detail) {
      return "<div><dt>" + esc(detail[0]) + "</dt><dd>" + escLines(detail[1]) + "</dd></div>";
    }).join("");
    var items = course.items.map(function (item) {
      return "<li>" + esc(item) + "</li>";
    }).join("");
    return [
      '<section class="course-panel" role="tabpanel" id="panel-', esc(course.id), '" aria-labelledby="tab-', esc(course.id), '"',
      index === 0 ? "" : " hidden", ">",
      '<div class="course-photo" style="', imageStyle(course.image), '" role="img" aria-label="', esc(course.name), '"></div>',
      '<div class="course-copy"><p class="course-ribbon">', esc(course.ribbon), "</p>",
      "<h3>", esc(course.name), "</h3><p>", esc(course.description), "</p>",
      '<dl class="course-details">', details, "</dl><ul>", items, "</ul></div>",
      "</section>"
    ].join("");
  }).join("");

  function activateTab(nextTab) {
    Array.from(tabs.querySelectorAll('[role="tab"]')).forEach(function (tab) {
      var active = tab === nextTab;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
    });
  }

  tabs.addEventListener("click", function (event) {
    var tab = event.target.closest('[role="tab"]');
    if (tab) activateTab(tab);
  });

  tabs.addEventListener("keydown", function (event) {
    var list = Array.from(tabs.querySelectorAll('[role="tab"]'));
    var index = list.indexOf(event.target);
    var next;
    if (event.key === "ArrowRight") next = (index + 1) % list.length;
    if (event.key === "ArrowLeft") next = (index - 1 + list.length) % list.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = list.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    activateTab(list[next]);
    list[next].focus();
  });


  var licenseTabs = document.getElementById("license-course-tabs");
  var licensePanels = document.getElementById("license-course-panels");

  if (licenseTabs && licensePanels && data.licenseCourses) {
    licenseTabs.innerHTML = data.licenseCourses.map(function (course, index) {
      return [
        '<button type="button" role="tab" id="tab-', esc(course.id), '" aria-controls="panel-', esc(course.id),
        '" aria-selected="', index === 0 ? "true" : "false", '" tabindex="', index === 0 ? "0" : "-1", '">',
        tabLabel(course.tab), "</button>"
      ].join("");
    }).join("");

    licensePanels.innerHTML = data.licenseCourses.map(function (course, index) {
      var details = course.details.map(function (detail) {
        return "<div><dt>" + esc(detail[0]) + "</dt><dd>" + escLines(detail[1]) + "</dd></div>";
      }).join("");
      var items = course.items.map(function (item) {
        return "<li>" + esc(item) + "</li>";
      }).join("");
      return [
        '<section class="sub-course-panel" role="tabpanel" id="panel-', esc(course.id), '" aria-labelledby="tab-', esc(course.id), '"',
        index === 0 ? "" : " hidden", ">",
        '<div class="sub-course-copy"><p class="sub-course-ribbon">', esc(course.ribbon), "</p>",
        "<h4>", esc(course.name), "</h4><p>", esc(course.description), "</p>",
        '<dl class="sub-course-details">', details, "</dl><ul>", items, "</ul></div>",
        "</section>"
      ].join("");
    }).join("");

    function activateLicenseTab(nextTab) {
      Array.from(licenseTabs.querySelectorAll('[role="tab"]')).forEach(function (tab) {
        var active = tab === nextTab;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
      });
    }

    licenseTabs.addEventListener("click", function (event) {
      var tab = event.target.closest('[role="tab"]');
      if (tab) activateLicenseTab(tab);
    });

    licenseTabs.addEventListener("keydown", function (event) {
      var list = Array.from(licenseTabs.querySelectorAll('[role="tab"]'));
      var index = list.indexOf(event.target);
      var next;
      if (event.key === "ArrowRight") next = (index + 1) % list.length;
      if (event.key === "ArrowLeft") next = (index - 1 + list.length) % list.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = list.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activateLicenseTab(list[next]);
      list[next].focus();
    });
  }
  var head = "<thead><tr>" + data.comparison.headers.map(function (header) {
    return '<th scope="col">' + esc(header) + "</th>";
  }).join("") + "</tr></thead>";

  function comparisonCell(cell) {
    var text = String(cell);
    var match = text.match(/^([◎○△])\n([\s\S]*)$/);
    if (!match) return esc(text);

    var markClass = match[1] === "◎" ? "double" : match[1] === "○" ? "circle" : "triangle";
    return [
      '<span class="comparison-mark comparison-mark-', markClass, '">', esc(match[1]), "</span>",
      '<span class="comparison-text">', esc(match[2]), "</span>"
    ].join("");
  }

  var body = "<tbody>" + data.comparison.rows.map(function (row) {
    return '<tr><th scope="row">' + esc(row[0]) + "</th>" + row.slice(1).map(function (cell) {
      return "<td>" + comparisonCell(cell) + "</td>";
    }).join("") + "</tr>";
  }).join("") + "</tbody>";
  document.getElementById("comparison-table").innerHTML = head + body;

  document.getElementById("network-stats").innerHTML = data.networkStats.map(function (stat) {
    return [
      '<div class="network-stat"><p><strong>', esc(stat.number), "</strong><span>", esc(stat.unit), "</span></p>",
      "<h3>", esc(stat.label), "</h3></div>"
    ].join("");
  }).join("");

  document.getElementById("graduate-list").innerHTML = data.graduates.map(function (item) {
    if (item.body) {
      return [
        '<article class="graduate-voice-card">',
        '<div class="graduate-voice-person">',
        '<img src="', esc(item.photo), '" alt="', esc(item.name), '">',
'</div>',
        '<div class="graduate-voice-content graduate-voice-article">',
        '<h3>', esc(item.heading), '</h3>',
        '<p class="graduate-voice-profile">', esc(item.profile), '</p>',
        '<div class="graduate-voice-body">',
        item.body.map(function (paragraph) {
          var paragraphHtml = esc(paragraph);
          (item.keywords || []).forEach(function (keyword) {
            var safeKeyword = esc(keyword);
            paragraphHtml = paragraphHtml.split(safeKeyword).join('<strong>' + safeKeyword + '</strong>');
          });
          return ['<p>', paragraphHtml, '</p>'].join("");
        }).join(""),
        '</div>',
        '</div>',
        '</article>'
      ].join("");
    }
    return [
      '<article class="graduate-card">',
      '<div class="graduate-photo" style="', imageStyle(item.image), '" role="img" aria-label="', esc(item.headline), '"></div>',
      '<div class="graduate-copy"><h3>', esc(item.headline), "</h3><p class=\"graduate-meta\">", esc(item.meta), "</p>",
      '<p class="graduate-summary">', esc(item.text), "</p>",
      '<button type="button" aria-expanded="false" aria-controls="graduate-detail-', item.name || '', '">詳しく見る</button>',
      "</div></article>"
    ].join("");
  }).join("");

  document.getElementById("graduate-list").addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    var detail = document.getElementById(button.getAttribute("aria-controls"));
    var open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "閉じる" : "詳しく見る";
    detail.hidden = !open;
  });

  document.getElementById("faq-list").innerHTML = data.faq.map(function (item) {
    return [
      '<details class="faq-item"><summary><span>Q</span>', esc(item.q), "</summary>",
      '<div class="faq-answer"><span>A</span><p>', esc(item.a), "</p></div></details>"
    ].join("");
  }).join("");

  document.getElementById("request-form").addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("form-status").textContent =
      "デモフォームのため送信していません。本番公開時に送信先を接続してください。";
  });
  var mobileFixed = document.querySelector(".mobile-fixed");
  var hero = document.querySelector(".hero");
  if (mobileFixed && hero) {
    var toggleMobileFixed = function () {
      var rect = hero.getBoundingClientRect();
      var threshold = Math.min(window.innerHeight * 0.72, rect.height * 0.72);
      mobileFixed.classList.toggle("is-hidden-on-hero", rect.bottom > threshold);
    };
    toggleMobileFixed();
    window.addEventListener("scroll", toggleMobileFixed, { passive: true });
    window.addEventListener("resize", toggleMobileFixed);
  }

  if (window.location.hash) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        var target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView();
      });
    });
  }
})();
