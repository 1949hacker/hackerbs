/* 服务端声部判定：仅给"文学/随笔"类页面加 <html data-mood="essay">，其余不加（默认=深色技术声部） */
var LITERARY = /随笔|文学|哲学|思想|散文|诗歌|札记|文摘/;
hexo.extend.filter.register('after_render:html', function (str, data) {
  if (typeof str !== 'string' || str.indexOf('<html') === -1) return str;
  if (str.indexOf('data-mood=') !== -1) return str;

  var path = '';
  try { path = decodeURIComponent((data && data.path) || ''); } catch (e) { path = (data && data.path) || ''; }

  var names = '';
  try {
    var page = (data && data.page) || (this && this.page);
    var cats = page && page.categories;
    if (cats && typeof cats.forEach === 'function') {
      cats.forEach(function (c) { if (c && c.name) names += ' ' + c.name; });
    }
  } catch (e) {}

  if (LITERARY.test(path + ' ' + names)) {
    return str.replace('<html', '<html data-mood="essay"');
  }
  return str;
});
