---
title: 关于磁盘残留lvm的解决办法
date: '2024-11-28 10:28:48'
tags:
  - Linux
  - lvm
  - 磁盘
  - 解决办法
  - dmsetup
  - legacy-blog
  - 知识图谱
  - datacentre-storage
aliases:
  - 关于磁盘残留lvm的解决办法
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/关于磁盘残留lvm的解决办法.md
---
> [!info] 知识关系
> 所属体系: [[datacentre/_index|数据中心与基础设施]] / [[datacentre/storage/_index|存储与数据可靠性体系]]
> 主题节点: 关于磁盘残留lvm的解决办法
> 推荐前置: [[datacentre/os/linux-tips|Linux技巧【持续更新】]]
> 相关主题: [[datacentre/storage/smartctl-disk-troubleshooting-rma|关于服务器硬盘故障但带外没有错误日志的排障与报修笔记]] / [[datacentre/virtualization/proxmox-ve-uefi-efi-disk|关于Proxmox-VE系统创建UEFI虚拟机需要单独添加EFI磁盘的问题]]
> 原始来源: `source/_posts/关于磁盘残留lvm的解决办法.md`
> 从旧博客迁移；已按知识图谱结构重新归档。

---

很多时候从其他机器拿过来的盘通常是没有经过格式化的，这样就会出现一些残留的lvm信息，导致无法正常使用。

出现该残留lvm的原因是因为设备映射器device mapper正在管理该磁盘，所以wipefs -a -f和dd if=/dev/zero of=/dev/disk命令无法清除该lvm

```shell
# lsblk显示如下
nvme0n1					disk
└storage-data			lvm

# ls -l /dev/mapper查询device mapper管理的磁盘信息
lrwxrwxrwx 1 root root 		7 Nov 28 18:04 storage-data ->../dm-0

#dmsetup remove删除
dmsetup remove /dev/mapper/storage-data
```
