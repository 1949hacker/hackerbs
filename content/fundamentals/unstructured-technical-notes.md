---
title: 未整理的随手技术笔记（实时更新，各种乱七八糟的技术都会记录在这儿）
date: '2024-04-02 16:34:01'
tags:
  - IT技术
  - 知识库
  - 随手记
  - Linux
  - NAS
  - 存储
  - 网络
  - 虚拟化
  - Shell
aliases:
  - 未整理的随手技术笔记（实时更新，各种乱七八糟的技术都会记录在这儿）
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/未整理的随手技术笔记（实时更新，各种乱七八糟的技术都会记录在这儿）.md
---

> [!info] 知识位置
> 体系: 基础知识与术语
> 层级: 写作
> 强关联: [[datacentre/os/linux-tips|Linux技巧【持续更新】]] / [[engineering/tools/vscode-markdown-plugins|vscode编写markdown的插件推荐]]
> 原始来源: `source/_posts/未整理的随手技术笔记（实时更新，各种乱七八糟的技术都会记录在这儿）.md`
> 关系规则: 只保留学习或排障上有直接依赖的边，避免为了双链而双链。

---

## 以下是乱七八糟的各种没时间整理的随手技术笔记，你可以通过页面搜索关键词查询可能是你用得上的东西，也可以通过底部联系方式询问我

点击阅读全文查看


### CentOS 7批量给eth0网卡添加IP

```shell
# 通过变量d实现改一个128使所有D段地址同步修改
d=128 && echo -e "IPADDR2=43.225.58.$d\nPREFIX2=27\nIPADDR3=69.165.77.$d\nPREFIX3=27\nIPADDR4=103.42.29.$d \nPREFIX4=27\nIPADDR5=220.158.194.$d \nPREFIX5=27\nIPADDR6=220.158.195.$d \nPREFIX6=27\nIPADDR7=107.151.236.$d \nPREFIX7=27\nIPADDR8=107.151.237.$d \nPREFIX8=27\nIPADDR9=198.44.163.$d \nPREFIX9=27\n" >> /etc/sysconfig/network-scripts/ifcfg-eth0 && systemctl restart network
```
