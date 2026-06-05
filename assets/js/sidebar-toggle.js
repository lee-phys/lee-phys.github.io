(function () {
  const STORAGE_KEY = 'chirpy-sidebar-hidden';

  function applyState(hidden) {
    document.body.classList.toggle('sidebar-hidden', hidden);
    document.documentElement.classList.remove('sidebar-hidden-early');
    localStorage.setItem(STORAGE_KEY, hidden ? '1' : '');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const hidden = !!localStorage.getItem(STORAGE_KEY);
    applyState(hidden);

    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        applyState(!document.body.classList.contains('sidebar-hidden'));
      });
    }

    const showBtn = document.getElementById('sidebar-show-btn');
    if (showBtn) {
      showBtn.addEventListener('click', function () {
        applyState(false);
      });
    }
  });
})();
