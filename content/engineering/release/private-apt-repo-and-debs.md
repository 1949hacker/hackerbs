---
title: 本站上线私有apt源仓库及自制实用deb包
date: '2023-10-18 09:50:41'
tags:
  - apt
  - deb
  - aptdownloader
  - apt源
  - yumdownloader
  - apt包下载工具
aliases:
  - 本站上线私有apt源仓库及自制实用deb包
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/本站上线私有apt源仓库及自制实用deb包.md
---

> [!info] 知识位置
> 体系: 软件分发与包管理
> 层级: 发布
> 前置知识: [[engineering/release/package-binary-as-deb|将二进制可执行程序构建为deb包]]
> 强关联: [[engineering/release/apt-repository-with-gpg-key|如何搭建具有GPGkey验证的可信任apt源]]
> 原始来源: `source/_posts/本站上线私有apt源仓库及自制实用deb包.md`
> 关系规则: 只保留学习或排障上有直接依赖的边，避免为了双链而双链。

---

# 本站apt源添加命令：

```shell
curl -o hackerbs.asc https://apt.ygeit.cn/hackerbs.asc && mv hackerbs.asc /etc/apt/trusted.gpg.d/
echo "deb https://apt.ygeit.cn bookworm main" >> /etc/apt/sources.list
apt update
```

对于支持apt-key的系统，可以使用以下命令添加本站gpg key

```shell
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 630D583FFE07EDA9B9531E029CA58840D67352EE
```

以下是工具介绍



## aptdownloader

如果你用过yumdownloader从yum源下载rpm包，那么看到名字你应该就知道这是一个什么工具了

[github仓库地址:https://github.com/1949hacker/deb](https://github.com/1949hacker/deb)

### 使用说明

`aptdownloader <package name>`

该命令会下载指定的包及其依赖到当前目录中，多个包名用空格分隔，示例：

`aptdownloader docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`

**注意事项：该工具下载的包及其依赖是基于当前系统的，所以你要离线导入deb包的目标系统也必须是相同系统才可！**

### 工具原理

原命令`apt download $(apt-rdepends -p <package name> | grep -v "^ " | sed "s/debcconf-2.0/debconf/g")`

使用python sys传参，subprocess执行命令，简化了原命令的操作方式
