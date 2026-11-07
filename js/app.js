/* Boot and routing. */
(function () {
  'use strict';
  const BB = window.BB;
  const { h } = BB;

  function guard(fn) {
    return (...args) => {
      try {
        const node = fn(...args);
        if (node) BB.ui.mount(node);
      } catch (e) {
        console.error(e);
        BB.ui.mount(h('div.callout.bad', h('strong', 'Something went wrong on this page.'), ' Please reload. If it keeps happening, export your progress from the About page and report the problem. ', h('a', { href: '#/' }, 'Go home')));
      }
    };
  }
  const page = (nav, title, crumb, fn) => guard((params, query, path) => { BB.ui.setPage(nav, typeof title === 'function' ? title(params) : title, typeof crumb === 'function' ? crumb(params) : crumb); return fn(params, query, path); });

  BB.route('/', page('home', 'Home', 'Home', () => BB.pages.home()));
  BB.route('/learn', page('learn', 'Learn', 'Learn', (p) => BB.pages.learn(p)));
  BB.route('/learn/:f', page('learn', 'Learn', (p) => { const f = BB.foundations.find((x) => x.id === p.f); return f ? f.short + ': ' + f.title : 'Learn'; }, (p) => BB.pages.learn(p)));
  BB.route('/lesson/:id', page('learn', (p) => (BB.lessonMeta[p.id] || {}).title || 'Lesson', (p) => (BB.lessonMeta[p.id] || {}).title || 'Lesson', (p) => BB.lessonPage(p.id)));
  BB.route('/courses', page('courses', 'Course companion', 'Course companion', () => BB.pages.courses()));
  BB.route('/labs', page('labs', 'Interactive labs', 'Interactive labs', () => BB.pages.labs()));
  BB.route('/labs/mission/:id', page('labs', 'Terminal mission', 'Terminal mission', (p) => BB.pages.missionPage(p)));
  BB.route('/labs/trace/:id', page('labs', 'Be the computer', 'Be the computer', (p) => BB.pages.tracePage(p)));
  BB.route('/labs/:id', page('labs', 'Lab', 'Interactive labs', (p) => BB.pages.labPage(p)));
  BB.route('/practice', page('practice', 'Placement practice', 'Placement practice', () => BB.practice.hub()));
  BB.route('/practice/session', page('practice', 'Practice session', 'Practice session', () => BB.practice.sessionView()));
  BB.route('/practice/results', page('practice', 'Results', 'Results', () => { const r = BB.store.state.lastResult; return r ? BB.practice.resultsView(r) : BB.practice.hub(); }));
  BB.route('/review', page('review', 'Review queue', 'Review queue', () => BB.practice.reviewView()));
  BB.route('/progress', page('progress', 'Progress', 'Progress', () => BB.practice.progressView()));
  BB.route('/glossary', page('glossary', 'Glossary', 'Glossary', (p, q) => BB.pages.glossaryPage(p, q)));
  BB.route('/notebook', page('notebook', 'My explanations', 'My explanations', () => BB.pages.notebook()));
  BB.route('/plan', page('plan', 'Study plan', 'Study plan', () => BB.pages.plan()));
  BB.route('/about', page('about', 'About', 'About, data and help', () => BB.pages.about()));

  function boot() {
    BB.store.load();
    BB.ui.applyTheme();
    BB.ui.buildShell();
    if (!BB.store.available) setTimeout(() => BB.ui.toast('This browser is blocking storage: progress will not be saved. See About to export.', 6000), 400);
    if (BB.store.error) setTimeout(() => BB.ui.toast(BB.store.error, 6000), 400);
    BB.on('storage-error', (m) => BB.ui.toast(m, 6000));
    BB.on('progress', () => BB.ui.applyNav());
    // The skip link must move focus without changing the hash: "#main" is not a route and would reload the home page.
    const skip = document.querySelector('.skip-link');
    if (skip) skip.addEventListener('click', (e) => {
      e.preventDefault();
      const main = document.getElementById('main');
      if (main) { main.focus(); main.scrollIntoView({ block: 'start' }); }
    });
    window.addEventListener('hashchange', BB.dispatch);
    BB.dispatch();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
