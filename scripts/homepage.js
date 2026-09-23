/* 首页门户：在文章列表前注入「按主题浏览」导航区（仅 index.html） */
hexo.extend.filter.register('after_render:html', function (str, data) {
  if (typeof str !== 'string') return str;

  var path = '';
  try { path = decodeURIComponent((data && data.path) || ''); } catch (e) { path = (data && data.path) || ''; }
  if (path !== 'index.html') return str;
  if (str.indexOf('hub-topics') !== -1) return str;

  var counts = {};
  try {
    hexo.locals.get('posts').forEach(function (p) {
      (p.categories || []).forEach(function (c) {
        var n = (c && c.name) ? c.name : c;
        if (n) counts[n] = (counts[n] || 0) + 1;
      });
    });
  } catch (e) {}

  var names = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
  if (!names.length) names = ['知识库', '伟大的知识库', '资源', '软件开发', '文学'];

  var total = 0;
  names.forEach(function (n) { total += counts[n] || 0; });

  var items = names.map(function (n) {
    return '<a class="topic" href="categories/' + n + '/">' +
      '<span class="t-name">' + n + '</span>' +
      '<span class="t-count">' + (counts[n] || '') + '</span></a>';
  }).join('');

  var hub = '<section class="hub-topics">' +
      '<div class="hub-head">' +
        '<span class="k">BROWSE</span>' +
        '<h2>按主题浏览</h2>' +
        '<p>共 ' + total + ' 篇文章 · 技术为主，偶有随笔</p>' +
      '</div>' +
      '<div class="topic-grid">' + items + '</div>' +
    '</section>';

  var idx = str.indexOf('id="recent-posts"');
  if (idx === -1) return str;
  var open = str.lastIndexOf('<', idx);
  if (open === -1) return str;
  return str.slice(0, open) + hub + str.slice(open);
});
