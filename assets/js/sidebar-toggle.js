(function () {
  const STORAGE_KEY = 'chirpy-sidebar-hidden';
  const BREAKPOINT = 850;

  function applyState(hidden) {
    if (!document.body) return; // 绝对防御：确保 body 存在，永不报错罢工
    
    if (window.innerWidth >= BREAKPOINT) {
      document.body.classList.toggle('sidebar-hidden', hidden);
    } else {
      document.body.classList.remove('sidebar-hidden');
    }
    localStorage.setItem(STORAGE_KEY, hidden ? '1' : '');
  }

  /* ========================================================
     1. 无缝接管状态：使用 MutationObserver 毫秒级拦截
     ======================================================== */
  const observer = new MutationObserver(function(mutations, obs) {
    if (document.body) {
      applyState(!!localStorage.getItem(STORAGE_KEY));
      obs.disconnect(); // body 出现并处理完后，立刻停止监听，节省性能
      
      // 两帧之后安全摘掉 head.html 里的防闪烁遮罩
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          document.documentElement.classList.remove('sidebar-hidden-early');
        });
      });
    }
  });
  
  if (document.body) {
    // 兜底：如果这段脚本加载时 body 居然已经存在了，那就直接执行
    applyState(!!localStorage.getItem(STORAGE_KEY));
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        document.documentElement.classList.remove('sidebar-hidden-early');
      });
    });
  } else {
    // 如果脚本在 <head> 里，就开始死盯页面的渲染
    observer.observe(document.documentElement, { childList: true });
  }

  /* ========================================================
     2. 终极事件监听：事件代理
     ======================================================== */
  document.addEventListener('click', function(e) {
    // 匹配收起按钮
    const toggleBtn = e.target.closest('#sidebar-toggle');
    if (toggleBtn) {
      const currentHidden = document.body.classList.contains('sidebar-hidden');
      applyState(!currentHidden);
      return;
    }

    // 匹配展开按钮
    const showBtn = e.target.closest('#sidebar-show-btn');
    if (showBtn) {
      applyState(false);
      return;
    }
  });

  /* ========================================================
     3. 监听屏幕缩放（响应式兼容）
     ======================================================== */
  window.addEventListener('resize', function() {
    applyState(!!localStorage.getItem(STORAGE_KEY));
  });

})();
