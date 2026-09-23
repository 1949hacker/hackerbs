/* 阅读引擎：左目录轨 / 右侧页边注 / 阅读模式 / 代码块头部条 / 进度 */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  var root = document.documentElement;

  ready(function () {
    var art = document.querySelector('#article-container');
    var isPost = !!art;

    /* ---------- 1) 左侧目录轨（仅文章页） ---------- */
    if (isPost) {
      var tocCard = document.querySelector('#card-toc') ||
                    document.querySelector('#toc') ||
                    document.querySelector('.toc');
      if (tocCard) {
        var rail = document.createElement('aside');
        rail.id = 'rail-left';
        rail.appendChild(tocCard);
        document.body.appendChild(rail);
        document.body.classList.add('post-rails');
      }
    }

    /* ---------- 2) 右侧页边注（自动生成：脚注 / 图注 / 本页命令） ---------- */
    if (isPost) {
      var notes = [];

      (function collectFootnotes() {
        var lis = document.querySelectorAll('.footnotes li, .footnote li, li[id^="fn:"]');
        Array.prototype.forEach.call(lis, function (li, i) {
          var t = (li.textContent || '').replace(/\s+/g, ' ').replace(/↩|↵/g, '').trim();
          if (t) notes.push({ b: '注' + (i + 1), t: t.slice(0, 160) });
        });
      })();

      (function collectFigures() {
        var imgs = art.querySelectorAll('img');
        Array.prototype.forEach.call(imgs, function (im, i) {
          if (i > 7) return;
          var cap = im.getAttribute('alt') || im.getAttribute('title') || '';
          if (!cap || cap.length < 2) return;
          if (/^\d+$/.test(cap)) return;
          notes.push({ b: '图' + (i + 1), t: cap.slice(0, 120) });
        });
      })();

      (function collectCommands() {
        var seen = {};
        var codes = art.querySelectorAll('code');
        Array.prototype.forEach.call(codes, function (c) {
          if (c.closest('pre') || c.closest('figure.highlight')) return;
          var t = (c.textContent || '').trim();
          if (!t || t.length < 2 || t.length > 42) return;
          if (seen[t]) return;
          seen[t] = 1;
          notes.push({ b: '⌘', t: t });
        });
        notes.length; // keep
      })();

      if (notes.length) {
        var rr = document.createElement('aside');
        rr.id = 'rail-right';
        var head = document.createElement('div');
        head.className = 'rail-title';
        head.textContent = '页边注';
        rr.appendChild(head);
        notes.slice(0, 16).forEach(function (n) {
          var d = document.createElement('div');
          d.className = 'mnote';
          var b = document.createElement('span');
          b.className = 'mn-badge';
          b.textContent = n.b;
          var t = document.createElement('span');
          t.className = 'mn-body';
          t.textContent = n.t;
          d.appendChild(b);
          d.appendChild(t);
          d.addEventListener('click', function () { d.classList.toggle('open'); });
          rr.appendChild(d);
        });
        document.body.appendChild(rr);
      }
    }

    /* ---------- 3) 代码块：语言标签 + 复制按钮 ---------- */
    Array.prototype.forEach.call(document.querySelectorAll('figure.highlight'), function (fig) {
      var lang = '';
      (fig.className || '').split(/\s+/).forEach(function (c) {
        if (c && c !== 'highlight' && !lang) lang = c;
      });
      var bar = document.createElement('div');
      bar.className = 'cb-bar';
      var lb = document.createElement('span');
      lb.className = 'cb-lang';
      lb.textContent = lang || 'code';
      var btn = document.createElement('button');
      btn.className = 'cb-copy';
      btn.type = 'button';
      btn.textContent = '复制';
      btn.addEventListener('click', function () {
        var pre = fig.querySelector('td.code pre') || fig.querySelector('pre');
        var txt = pre ? pre.innerText : '';
        var done = function () {
          btn.textContent = '已复制';
          btn.classList.add('ok');
          setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('ok'); }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(done, done);
        } else { done(); }
      });
      bar.appendChild(lb);
      bar.appendChild(btn);
      fig.insertBefore(bar, fig.firstChild);
    });

    /* ---------- 4) 顶部进度条 + 阅读模式 + 目录轨刻度 ---------- */
    var prog = document.createElement('div');
    prog.className = 'read-progress';
    document.body.appendChild(prog);

    function upd() {
      var h = root.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      p = Math.max(0, Math.min(100, p));
      prog.style.width = p + '%';
      root.style.setProperty('--p', p.toFixed(1) + '%');
      if (window.scrollY > 140) root.classList.add('reading');
      else root.classList.remove('reading');
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();

    /* ---------- 5) 首页列表显现（仅首页，避免正文闪动） ---------- */
    if (!isPost && 'IntersectionObserver' in window) {
      var els = document.querySelectorAll('#recent-posts .recent-post-item');
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('reveal-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
      Array.prototype.forEach.call(els, function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = Math.min(i * 40, 220) + 'ms';
        io.observe(el);
      });
    }

    /* ---------- 6) 清理历史遗留的调色板状态（配色已统一为单套暖色系） ---------- */
    root.removeAttribute('data-palette');
    try { localStorage.removeItem('hb_palette'); } catch (e) {}
  });
})();
