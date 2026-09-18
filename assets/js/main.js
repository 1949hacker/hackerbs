/* hackerbs.com — 站点交互脚本（零依赖） */
(function () {
  "use strict";

  var THEME_KEY = "hbs-theme";

  /* ---------- 主题切换 ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", t === "dark" ? "切换到浅色" : "切换到深色");
      var sun = btn.querySelector(".i-sun");
      var moon = btn.querySelector(".i-moon");
      if (sun && moon) {
        sun.style.display = t === "dark" ? "none" : "block";
        moon.style.display = t === "dark" ? "block" : "none";
      }
    }
  }

  function initTheme() {
    var saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (e) {}
    applyTheme(saved || "dark");
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme");
        var next = cur === "dark" ? "light" : "dark";
        applyTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {}
      });
    }
  }

  /* ---------- 移动端菜单 ---------- */
  function initMenu() {
    var btn = document.getElementById("menu-btn");
    var nav = document.getElementById("site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  /* ---------- 阅读进度 ---------- */
  function initProgress() {
    var bar = document.getElementById("reading-progress");
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var scrollTop = h.scrollTop || document.body.scrollTop;
      var height = h.scrollHeight - h.clientHeight;
      bar.style.width = height > 0 ? (scrollTop / height) * 100 + "%" : "0%";
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- 目录高亮 ---------- */
  function initToc() {
    var toc = document.getElementById("toc");
    if (!toc) return;
    var links = toc.querySelectorAll("a[href^='#']");
    if (!links.length) return;

    var targets = [];
    links.forEach(function (a) {
      var el = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
      if (el) targets.push({ el: el, link: a });
    });
    if (!targets.length) return;

    function update() {
      var pos = window.scrollY + 120;
      var current = null;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.offsetTop <= pos) current = targets[i];
      }
      if (!current) current = targets[0];
      links.forEach(function (a) {
        a.classList.remove("active");
      });
      current.link.classList.add("active");
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- 代码复制 ---------- */
  function initCopy() {
    document.querySelectorAll(".code-block .copy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pre = btn.closest(".code-block").querySelector("pre");
        if (!pre) return;
        var text = pre.innerText;
        var done = function () {
          var old = btn.textContent;
          btn.textContent = "已复制";
          btn.classList.add("done");
          setTimeout(function () {
            btn.textContent = old;
            btn.classList.remove("done");
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {});
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            done();
          } catch (e) {}
          document.body.removeChild(ta);
        }
      });
    });
  }

  /* ---------- 回到顶部 ---------- */
  function initToTop() {
    var btn = document.getElementById("to-top");
    if (!btn) return;
    function update() {
      if (window.scrollY > 600) btn.classList.add("show");
      else btn.classList.remove("show");
    }
    window.addEventListener("scroll", update, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    update();
  }

  /* ---------- 搜索 ---------- */
  function initSearch() {
    var input = document.getElementById("search-input");
    var out = document.getElementById("search-results");
    if (!input || !out) return;

    var index = null;
    var loading = false;

    function load(cb) {
      if (index) return cb(index);
      if (loading) return;
      loading = true;
      fetch("data/search-index.json")
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          index = data;
          loading = false;
          cb(index);
        })
        .catch(function () {
          loading = false;
          out.innerHTML = '<p class="empty">索引加载失败，请检查 data/search-index.json</p>';
        });
    }

    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    function highlight(text, q) {
      var safe = esc(text);
      if (!q) return safe;
      var idx = text.toLowerCase().indexOf(q.toLowerCase());
      if (idx < 0) return safe;
      return (
        esc(text.slice(0, idx)) +
        "<em>" +
        esc(text.slice(idx, idx + q.length)) +
        "</em>" +
        esc(text.slice(idx + q.length))
      );
    }

    function render(q) {
      load(function (data) {
        var query = q.trim().toLowerCase();
        if (!query) {
          out.innerHTML =
            '<p class="empty">输入关键词开始搜索，支持标题、摘要、分类与标签。</p>';
          return;
        }
        var hits = [];
        data.forEach(function (item) {
          var hay = (
            item.title +
            " " +
            item.summary +
            " " +
            item.category +
            " " +
            (item.tags || []).join(" ")
          ).toLowerCase();
          if (hay.indexOf(query) >= 0) hits.push(item);
        });
        if (!hits.length) {
          out.innerHTML = '<p class="empty">没有找到与 “' + esc(q) + '” 相关的内容。</p>';
          return;
        }
        out.innerHTML = hits
          .map(function (h) {
            return (
              '<a class="result" href="' +
              h.url +
              '"><span class="rt">' +
              highlight(h.title, q) +
              '</span><span class="rd">' +
              esc(h.summary || "") +
              '</span><span class="rm">' +
              h.date +
              " · " +
              esc(h.category) +
              " · " +
              (h.tags || []).map(esc).join(" / ") +
              "</span></a>"
            );
          })
          .join("");
      });
    }

    var timer = null;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      var v = input.value;
      timer = setTimeout(function () {
        render(v);
      }, 130);
    });

    var q = new URLSearchParams(location.search).get("q");
    if (q) {
      input.value = q;
      render(q);
    } else {
      load(function () {});
    }
  }

  /* ---------- 启动 ---------- */
  function boot() {
    initTheme();
    initMenu();
    initProgress();
    initToc();
    initCopy();
    initToTop();
    initSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
