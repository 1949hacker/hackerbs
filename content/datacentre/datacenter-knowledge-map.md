---
title: 数据中心知识体系总览
tags:
  - datacentre
  - 知识图谱
---

# 数据中心知识体系总览

这是数据中心体系的简化版地图，不把所有文章相互打通，只保留能指导学习和排障的路线。

## 主学习路径

1. [[datacentre/os/debian-basics|Debian基础知识【持续更新】]]
2. [[datacentre/os/linux-tips|Linux技巧【持续更新】]]
3. [[datacentre/hardware/motherboard-io|主板与IO接口]]
4. [[datacentre/hardware/storage-interfaces|存储接口与硬盘形态]]
5. [[datacentre/storage/dell-disk-io-alert-troubleshooting|DELL服务器硬盘IO告警排障思路]]
6. [[datacentre/storage/smartctl-disk-troubleshooting-rma|关于服务器硬盘故障但带外没有错误日志的排障与报修笔记]]
7. [[datacentre/virtualization/proxmox-ve-uefi-efi-disk|关于Proxmox-VE系统创建UEFI虚拟机需要单独添加EFI磁盘的问题]]
8. [[datacentre/virtualization/proxmox-ve-batch-operations|Proxmox-VE批量加集群、批量克隆、批量设置并同步时间、批量清除集群残留、批量创建网卡等一站式解决方案！]]

## 排障路径

1. [[datacentre/hardware/storage-interfaces|存储接口与硬盘形态]]
2. [[datacentre/hardware/dell-perc-battery-low|DELL报错The PERC1 battery is low]]
3. [[datacentre/storage/dell-disk-io-alert-troubleshooting|DELL服务器硬盘IO告警排障思路]]
4. [[datacentre/storage/smartctl-disk-troubleshooting-rma|关于服务器硬盘故障但带外没有错误日志的排障与报修笔记]]
5. [[datacentre/storage/server-ssd-fault-self-recovered|记录一次分析【服务器SSD报故障随后自行恢复正常现象】]]
6. [[datacentre/operations/server-stability-benchmark-methods|服务器稳定性及基准测试方法]]

## 实践路径

1. [[datacentre/os/apt-mirror-sources|apt等各种源列表（持续更新）]]
2. [[datacentre/container/docker-hub-workaround-cn|国内docker hub无法使用的解决办法]]
3. [[datacentre/container/debian-x86-64-arm-docker|Debian x86_64平台搭建arm docker环境]]
4. [[datacentre/container/armv8-vsftpd-docker-image|记录一次构建armv8平台vsftpd Docker镜像的过程]]
5. [[datacentre/container/nextcloud-docker-compose|记录用docker部署nextcloud及配套mariadb、redis和持久化存储]]
