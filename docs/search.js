// search.js — global Cmd/Ctrl+K shortcut for GaaS docs
(function () {
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      window.location.href = 'search.html';
    }
  });
})();
