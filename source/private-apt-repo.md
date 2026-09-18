这篇文章给出本站私有 apt 源的添加命令，并介绍仓库里自制的 aptdownloader 工具——一个像 `yumdownloader` 一样、把指定包及其依赖下载到本地的小程序。

## 本站apt源添加命令：

```bash
curl -o hackerbs.asc https://apt.ygeit.cn/hackerbs.asc && mv hackerbs.asc /etc/apt/trusted.gpg.d/
echo "deb https://apt.ygeit.cn bookworm main" >> /etc/apt/sources.list
apt update
```

对于支持 apt-key 的系统，可以使用以下命令添加本站 gpg key。

```bash
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 630D583FFE07EDA9B9531E029CA58840D67352EE
```

以下是工具介绍。

## aptdownloader

如果你用过 yumdownloader 从 yum 源下载 rpm 包，那么看到名字你应该就知道这是一个什么工具了。

[github仓库地址](https://github.com/1949hacker/deb)

### 使用说明

`aptdownloader <package name>`

该命令会下载指定的包及其依赖到当前目录中，多个包名用空格分隔，示例：

`aptdownloader docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`

> [!WARNING] 注意事项
> 该工具下载的包及其依赖是基于当前系统的，所以你要离线导入 deb 包的目标系统也必须是相同系统才可！

### 工具原理

原命令 `apt download $(apt-rdepends -p <package name> | grep -v "^ " | sed "s/debcconf-2.0/debconf/g")`

使用 python sys 传参，subprocess 执行命令，简化了原命令的操作方式。
