(function () {
  const STORAGE_KEY = 'chirpy-sidebar-hidden';
  const BREAKPOINT = 850;

  function applyState(hidden) {
    // 如果是宽屏（桌面端），应用我们自定义的折叠逻辑
    if (window.innerWidth >= BREAKPOINT) {
      document.body.classList.toggle('sidebar-hidden', hidden);
    } else {
      // 移动端：强制清除自定义 class，防止干扰 Chirpy 原生滑动抽屉
      document.body.classList.remove('sidebar-hidden');
    }
    document.documentElement.classList.remove('sidebar-hidden-early');
    localStorage.setItem(STORAGE_KEY, hidden ? '1' : '');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const hidden = !!localStorage.getItem(STORAGE_KEY);
    applyState(hidden);

    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const isCurrentlyHidden = document.body.classList.contains('sidebar-hidden');
        applyState(!isCurrentlyHidden);
      });
    }

    const showBtn = document.getElementById('sidebar-show-btn');
    if (showBtn) {
      showBtn.addEventListener('click', function () {
        applyState(false);
      });
    }

    // 监听窗口尺寸变化：当用户拖拽改变浏览器宽度时，动态修复状态
    window.addEventListener('resize', function() {
      const isHidden = !!localStorage.getItem(STORAGE_KEY);
      applyState(isHidden);
    });
  });
})();
