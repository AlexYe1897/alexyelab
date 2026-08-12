---
title: 'Understanding LLM KV Cache Test'

description: 'A beginner-friendly explanation of KV Cache and LLM inference optimization.'

date: '2026-08-11'

tags:
  - AI
  - LLM

category: 'AI Systems'

draft: true
---

## 什么是 KV Cache？

KV Cache 是大语言模型推理优化中的重要技术。

## 为什么需要 KV Cache？

Transformer 在生成文本的时候，会重复计算 Attention。

## KV Cache 做了什么？

它保存之前计算过的 Key 和 Value，避免重复计算。

## 总结

KV Cache 可以降低推理成本，提高生成速度。

## Python Test

```python
def hello():
    print("hello")
```
