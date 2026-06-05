(function () {
  const STORAGE_KEY = 'chirpy-sidebar-hidden';
  const BREAKPOINT = 850;

  // 纯粹的状态切换函数，不涉及解绑防闪烁
  function applyState(hidden) {
    if (window.innerWidth >= BREAKPOINT) {
      document.body.classList.toggle('sidebar-hidden', hidden);
    } else {
      document.body.classList.remove('sidebar-hidden');
    }
    localStorage.setItem(STORAGE_KEY, hidden ? '1' : '');
  }

  // 必须等待 DOM 树完全生成，保证 document.body 绝对存在，永不报错
  document.addEventListener('DOMContentLoaded', function () {
    
    // 1. 先应用初始的收起/展开状态
    const isHidden = !!localStorage.getItem(STORAGE_KEY);
    applyState(isHidden);

    // 2. 终极防闪烁杀手锏：利用 requestAnimationFrame 延迟两帧摘掉“静音罩”
    // 第一帧：等待浏览器把收起的样式排版好
    // 第二帧：确认已经画在屏幕上了，再安全移除防闪烁 class。完美避开动画冲突！
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        document.documentElement.classList.remove('sidebar-hidden-early');
      });
    });

    // 3. 绑定左下角收起按钮
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const currentHidden = document.body.classList.contains('sidebar-hidden');
        applyState(!currentHidden);
      });
    }

    // 4. 绑定左边缘展开按钮
    const showBtn = document.getElementById('sidebar-show-btn');
    if (showBtn) {
      showBtn.addEventListener('click', function () {
        applyState(false);
      });
    }

    // 5. 监听屏幕缩放（手机端/电脑端切换）
    window.addEventListener('resize', function() {
      applyState(!!localStorage.getItem(STORAGE_KEY));
    });
  });
})();
