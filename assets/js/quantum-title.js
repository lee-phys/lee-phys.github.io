(function () {
  const longName = "Where the Wavefunction Collapses";
  const shortName = "[Ψ] Collapses";
  const blurName = "Ψ | Superposition State...";

  // 智能计算当前标签页在“被观测”时应该显示什么
  function getFocusTitle() {
    let currentTitle = document.title;
    if (currentTitle.includes(longName)) {
      return currentTitle.replace(longName, shortName).replace(" - ", " | ");
    }
    if (currentTitle === blurName) {
      return window.backupFocusTitle || shortName;
    }
    return currentTitle;
  }

  // 核心修复：定义一个“量子态初始化”函数
  function initQuantumState() {
    // 只有在没备份过的情况下才备份，防止把 blurName 备份进去
    if (!window.backupFocusTitle || window.backupFocusTitle === blurName) {
      window.backupFocusTitle = getFocusTitle();
    }
    
    // 加载完成的那一刻，严格判断观测者（你）在不在场！
    if (document.hidden) {
      document.title = blurName; // 如果你此时在别的标签页，保持叠加态
    } else {
      document.title = window.backupFocusTitle; // 只有你盯着它加载完，才坍缩
    }
  }

  // 无论页面是在前台还是后台加载，都让它经过一次“观测判断”
  document.addEventListener("DOMContentLoaded", initQuantumState);
  window.addEventListener("load", initQuantumState);

  // 核心：监听浏览器的可见性（是否被观测）
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      // 没人看它：回到未定义、不确定的波函数叠加态
      document.title = blurName;
    } else {
      // 受到观测：波函数瞬间坍缩，展现确定现实
      if (!window.backupFocusTitle) window.backupFocusTitle = shortName; // 终极兜底
      document.title = window.backupFocusTitle;
    }
  });

  // 脚本刚加载时也立刻执行一次判断，防止网速慢时的标题闪烁
  initQuantumState();
})();
