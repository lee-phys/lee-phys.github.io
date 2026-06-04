---
title: 量子力学与薛定谔方程测试篇
date: 2026-06-05 10:00:00 +0800
categories: [物理学, 量子力学]
tags: [测试, LaTeX, 物理]
math: true
---

这是一篇用于测试 **Jekyll Theme Chirpy** 博客排版、代码高亮以及 LaTeX 数学公式渲染的测试文章。如果你能看到漂亮的公式和排版，说明你的独立学术博客已经完美运转！

## 1. 经典文本与排版测试

我们用维特根斯坦的名言作为引子。逻辑的清晰性在数理世界中至关重要：

> "What can be said at all can be said clearly, and what we cannot talk about we must pass over in silence." — Ludwig Wittgenstein

---

## 2. LaTeX 数学公式测试 (MathJax)

因为我们在文章开头的 `front matter` 中设置了 `math: true`，Chirpy 会自动加载数学公式渲染引擎。

### 行内公式 (Inline Math)
波动力学中，系统的状态由波函数 $\psi(x, t)$ 描述。根据德布罗意关系，粒子的能量 $E$ 与频率 $\nu$ 的关系为 $E = h\nu$，动量 $p$ 与波长 $\lambda$ 的关系为 $p = \frac{h}{\lambda}$。

### 独立公式块 (Display Math)
一维含时薛定谔方程（Time-dependent Schrödinger Equation）的形式如下：

$$i\hbar \frac{\partial}{\partial t}\psi(x,t) = \left[-\frac{\hbar^2}{2m}\frac{\partial^2}{\partial x^2} + V(x,t)\right]\psi(x,t)$$

如果势能 $V(x)$ 与时间无关，通过分离变量法可以得到定态薛定谔方程：

$$\hat{H}\psi(x) = E\psi(x)$$

其中哈密顿算符 $\hat{H}$ 为：

$$\hat{H} = -\frac{\hbar^2}{2m}\nabla^2 + V(x)$$

---

## 3. 代码高亮测试 (Syntax Highlighting)

以下是一段用于模拟一维无限深势阱中粒子波函数概率密度分布的 Python 代码测试：

```python
import numpy as np

def wave_function(x, n, L):
    """计算一维无限深势阱中的定态波函数"""
    return np.sqrt(2.0 / L) * np.sin(n * np.pi * x / L)

# 参数设置
L = 1.0  # 势阱宽度
n = 1    # 基态
x_vals = np.linspace(0, L, 100)
psi_vals = wave_function(x_vals, n, L)

print(f"成功计算 n={n} 的量子态波函数采样点数: {len(psi_vals)}")
