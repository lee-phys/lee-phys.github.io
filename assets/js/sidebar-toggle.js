(function () {
  const STORAGE_KEY = 'chirpy-sidebar-hidden';
  const BREAKPOINT = 850;

  function applyState(hidden) {
    // 1. 设置主体状态
    if (window.innerWidth >= BREAKPOINT) {
      document.body.classList.toggle('sidebar-hidden', hidden);
    } else {
      document.body.classList.remove('sidebar-hidden');
    }

    // 2. 核心修复：读取一下 offsetHeight，强制浏览器立刻计算当前样式（触发重排）
    // 这样能确保 "收起状态" 被死死锁定，不会跟后续的动画混在一起
    void document.body.offsetHeight;

    // 3. 安全地移除防闪烁标记
    requestAnimationFrame(function () {
      document.documentElement.classList.remove('sidebar-hidden-early');
    });

    // 4. 保存状态
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
