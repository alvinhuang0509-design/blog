---
title: "AI 安全与数学 可视化的测试"
description: "测试 LaTeX 公式和 Mermaid 流程图"
date: 2024-01-23
categories: ["AI", "Testing"]
tags: ["Demo"]
related_papers:
  - title: "Attention Is All You Need"
    url: "https://arxiv.org/abs/1706.03762"
---

## 1. 数学公式 (LaTeX)

我们来看一下 Transformer 的注意力机制公式：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

行内公式测试：$e^{i\pi} + 1 = 0$。

## 2. 流程图 (Mermaid)

这是一个神经网络的简单示意图：

```mermaid
graph LR
    A[Input Layer] --> B[Hidden Layer 1]
    B --> C[Hidden Layer 2]
    C --> D[Output Layer]
    B -.-> E[Dropout]
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
```

