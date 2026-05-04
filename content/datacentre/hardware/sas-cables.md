---
title: SAS线缆与服务器连接接口
tags: [SAS, 服务器硬件, 数据中心]
---

> [!info] 知识位置
> 体系: 服务器硬件体系
> 层级: 基础
> 前置知识: [[datacentre/hardware/storage-interfaces|存储接口与硬盘形态]]
> 关系规则: 只保留学习或排障上有直接依赖的边，避免为了双链而双链。

---

# SAS线缆与服务器连接接口

本文整理服务器与数据中心中常见的 SAS 线缆规范及其工程应用，内容完整迁移自原博客《IT基础知识百科》中 SAS 部分。

---

## 常见的 SAS 线缆

参考资料：https://cs-electronics.com/

---

### SFF-8643 / Mini SAS HD

通常 JBOD 磁盘柜使用，在机箱外部连接的有保护壳的是 SFF-8644。

![SFF-8644](https://img.hackerbs.com/2022-10-25-10-45-40.png)

---

### SFF-8087 / Mini SAS

![SFF-8087](https://img.hackerbs.com/2022-10-25-10-46-10.png)

---

### SFF-8654 / Slim SAS

YGR-822 平台大量使用 SlimSAS 用于 PCIe 扩展连接。

![SFF-8654](https://img.hackerbs.com/2022-10-25-10-44-50.png)

---

## 工程备注

- SFF-8644 常用于外接存储（JBOD）
- SFF-8087 多用于老一代服务器内部连接
- Slim SAS 常见于高密服务器与 PCIe 扩展场景
