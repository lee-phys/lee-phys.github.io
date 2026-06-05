(function () {
  const STORAGE_KEY = 'chirpy-sidebar-hidden';
  const BREAKPOINT = 850;

  function applyState(hidden) {
    if (window.innerWidth >= BREAKPOINT) {
      document.body.classList.toggle('sidebar-hidden', hidden);
    } else {
      document.body.classList.remove('sidebar-hidden');
    }
    
    // 强制浏览器重排，锁定状态
    void document.body.offsetHeight; 
    
    // 移除防闪烁 class，恢复所有动画
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
