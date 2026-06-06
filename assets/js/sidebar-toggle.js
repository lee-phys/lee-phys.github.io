(function () {
  'use strict';

  var STORAGE_KEY = 'chirpy-sidebar-hidden';
  var BREAKPOINT = 850;
  
  /* ─────────────────────────────────────────
   * 终极兜底：超过 3 秒强制恢复可见
   * 防止 JS 报错或 CSS 永远加载不完导致白屏
   * ───────────────────────────────────────── */
  var fallbackTimer = setTimeout(function () {
    document.documentElement.classList.remove('sidebar-hidden-early');
    if (document.body) document.body.style.visibility = 'visible';
  }, 3000);

  /* ─────────────────────────────────────────
   * 工具函数
   * ───────────────────────────────────────── */

  function isDesktop() {
    return window.innerWidth >= BREAKPOINT;
  }

  function shouldHide() {
    return isDesktop() && !!localStorage.getItem(STORAGE_KEY);
  }

  /* ─────────────────────────────────────────
   * 阶段一：在 <head> 中同步执行
   * 此时 document.body 还不存在，只能操作 <html>
   * 目的：在浏览器开始绘制 body 之前就确定好 class
   * ───────────────────────────────────────── */
  if (shouldHide()) {
    // sidebar-hidden-early 由最前面的内联脚本已经加了
    // 这里作为双重保险
    document.documentElement.classList.add('sidebar-hidden-early');
  }

  /* ─────────────────────────────────────────
   * 阶段二：body 就绪后接管
   * ───────────────────────────────────────── */

  function applyState(hidden) {
    if (!document.body) return;

    var shouldApply = isDesktop() ? hidden : false;

    // 先同步写 class，强制重排，再移除防闪烁类
    document.body.classList.toggle('sidebar-hidden', shouldApply);
    void document.body.offsetWidth; // 强制重排，锁定样式

    localStorage.setItem(STORAGE_KEY, hidden ? '1' : '');
  }

  function takeOver() {
    // 清除兜底定时器，正常流程不需要强制恢复
    clearTimeout(fallbackTimer);

    var hidden = shouldHide();

    // 同步应用状态（此时 body 已存在，样式立即生效）
    applyState(hidden);

    // 移除防闪烁类：必须在重排之后、下一帧之前
    // 用 requestAnimationFrame 确保浏览器已提交当前帧的样式
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        // 双 rAF：第一帧提交样式，第二帧才安全移除防闪烁类
        document.documentElement.classList.remove('sidebar-hidden-early');
      });
    });
  }

  function bindEvents() {
    // 按钮点击（事件委托）
    document.addEventListener('click', function (e) {
      if (e.target.closest('#sidebar-toggle')) {
        applyState(!document.body.classList.contains('sidebar-hidden'));
        return;
      }
      if (e.target.closest('#sidebar-show-btn')) {
        applyState(false);
        return;
      }
    });

    // 窗口缩放
    window.addEventListener('resize', function () {
      applyState(!!localStorage.getItem(STORAGE_KEY));
    });
  }

  /* 等待 body 就绪 */
  if (document.body) {
    takeOver();
    bindEvents();
  } else {
    /* 
     * 脚本在 </head> 前执行，body 尚未解析
     * 用最轻量的方式等待：先尝试 DOMContentLoaded，
     * 同时用 MutationObserver 做更早的拦截
     */
    var taken = false;

    function tryTakeOver() {
      if (taken || !document.body) return;
      taken = true;
      takeOver();
      bindEvents();
    }

    // MutationObserver：body 标签一出现就接管
    var observer = new MutationObserver(function (mutations, obs) {
      if (document.body) {
        obs.disconnect();
        tryTakeOver();
      }
    });
    observer.observe(document.documentElement, { childList: true });

    // 保底：DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function () {
      tryTakeOver();
    });
  }
})();
