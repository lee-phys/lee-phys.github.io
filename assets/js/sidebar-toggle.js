(function () {
  const STORAGE_KEY = 'chirpy-sidebar-hidden';
  const BREAKPOINT = 850;

  function applyState(hidden) {
    if (!document.body) return;

    if (window.innerWidth >= BREAKPOINT) {
      document.body.classList.toggle('sidebar-hidden', hidden);
    } else {
      document.body.classList.remove('sidebar-hidden');
    }
    localStorage.setItem(STORAGE_KEY, hidden ? '1' : '');

    // 强制重排：让浏览器立即计算并锁定 body.sidebar-hidden 的样式
    void document.body.offsetHeight;
  }

  /* 无缝接管状态，并安全地摘掉防闪烁遮罩 */
  function takeOverAndCleanUp() {
    applyState(!!localStorage.getItem(STORAGE_KEY));

    // 重排后再等一帧，确保样式完全生效，然后移除 html 上的预防类
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('sidebar-hidden-early');
    });
  }

  /* 使用 MutationObserver 监听 body 元素出现 */
  const observer = new MutationObserver((mutations, obs) => {
    if (document.body) {
      obs.disconnect();
      takeOverAndCleanUp();
    }
  });

  if (document.body) {
    // body 已存在时直接接管
    takeOverAndCleanUp();
  } else {
    // 否则死盯 DOM 变化，直到 body 出现
    observer.observe(document.documentElement, { childList: true });
  }

  /* 事件代理：处理收起/展开按钮点击 */
  document.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('#sidebar-toggle');
    if (toggleBtn) {
      const currentHidden = document.body.classList.contains('sidebar-hidden');
      applyState(!currentHidden);
      return;
    }

    const showBtn = e.target.closest('#sidebar-show-btn');
    if (showBtn) {
      applyState(false);
      return;
    }
  });

  /* 响应窗口尺寸变化 */
  window.addEventListener('resize', () => {
    applyState(!!localStorage.getItem(STORAGE_KEY));
  });
})();
