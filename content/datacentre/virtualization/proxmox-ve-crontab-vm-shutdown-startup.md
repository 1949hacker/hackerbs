---
title: 直接编写crontab使用一行命令完成Proxmox-VE所有虚拟机的安全关机和依次开机
date: '2024-09-12 17:14:48'
tags:
  - NAS
  - DDNS
  - 存储
  - zfs
  - RAID
  - 磁盘阵列
  - legacy-blog
  - 知识图谱
  - datacentre-virtualization
aliases:
  - 直接编写crontab使用一行命令完成Proxmox-VE所有虚拟机的安全关机
  - 直接编写crontab使用一行命令完成Proxmox-VE所有虚拟机的安全关机和依次开机
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/直接编写crontab使用一行命令完成Proxmox-VE所有虚拟机的安全关机.md
---
> [!info] 知识关系
> 所属体系: [[datacentre/_index|数据中心与基础设施]] / [[datacentre/virtualization/_index|虚拟化与 Proxmox 体系]]
> 主题节点: 直接编写crontab使用一行命令完成Proxmox-VE所有虚拟机的安全关机和依次开机
> 推荐前置: [[datacentre/virtualization/proxmox-ve-batch-operations|Proxmox-VE批量加集群、批量克隆、批量设置并同步时间、批量清除集群残留、批量创建网卡等一站式解决方案！]]
> 相关主题: [[datacentre/virtualization/proxmox-ve-uefi-efi-disk|关于Proxmox-VE系统创建UEFI虚拟机需要单独添加EFI磁盘的问题]]
> 原始来源: `source/_posts/直接编写crontab使用一行命令完成Proxmox-VE所有虚拟机的安全关机.md`
> 从旧博客迁移；已按知识图谱结构重新归档。

---

```shell
# 依次关机
i=$(qm list)&&vmid=$(echo "$i" | awk '{if (NR>1) {print $1}}')&&for i in $vmid;do qm shutdown $i;done

#依次开机，间隔一分钟
i=$(qm list)&&vmid=$(echo "$i" | awk '{if (NR>1) {print $1}}')&&for i in $vmid;do qm start $i&&sleep 60s;done
```
