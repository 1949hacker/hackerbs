这里汇总我在运维中常用的各类软件源配置，涵盖 Debian、Ubuntu、Docker、npm、PyPI、Qt 以及 GitHub Release 镜像，方便直接复制使用。内容持续更新。

**使用源时务必注意版本。**

若你的系统不是最新版，可以使用 *snullp* 大佬开发的[配置生成器](https://mirrors.ustc.edu.cn/repogen/)。

## 操作系统源

### 清华 Debian apt 源（最新 Debian12 bookworm 版）

如需使用中科大源，将 tuna.tsinghua 替换为 ustc 即可，其他源同理。

```conf
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware

deb https://mirrors.tuna.tsinghua.edu.cn/debian-security/ bookworm-security main contrib non-free non-free-firmware
deb-src https://mirrors.tuna.tsinghua.edu.cn/debian-security/ bookworm-security main contrib non-free non-free-firmware
```

### 清华 Ubuntu apt 源（最新 Ubuntu24.04 noble 源）

```conf
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-security main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-security main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-updates main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-updates main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-backports main restricted universe multiverse
deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-backports main restricted universe multiverse

## Not recommended
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-proposed main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-proposed main restricted universe multiverse
```

### 清华 docker ce 源加速手动安装 docker

**因为 `docker.com` 已经上不去了，所以之前写的用脚本自动安装的方式作废。**

直接参照官方安装文档，只需要将官方文档中的 `download.docker.com` 替换成 `mirrors.tuna.tsinghua.edu.cn/docker-ce` 即可。

*补(tu)充(cao)：整个 `*.docker.com` 都被墙了，我真服了，这里只写一下在 Debian 手动安装 docker 的教程，别问我为啥不用 centos，centos 早废了，debian 万岁，debian 天下第一，linux 老祖宗，YYDS。*

```bash
# 直接复制运行该命令，卸载所有冲突的软件包
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done

# 首次安装需要设置apt存储库
# 先刷新下apt源
sudo apt update
# 设置GPG key
sudo apt install -f ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
# 将仓库添加到apt源
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update

# 安装docker
apt install -f docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 软件源

### 中科大 docker hub 源

**国内所有 docker hub 都 GG 了，官方 hub 也 GG 了，参照本站[国内 docker hub 无法使用的解决办法](https://hackerbs.com/%E5%9B%BD%E5%86%85docker-hub%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%E7%9A%84%E8%A7%A3%E5%86%B3%E5%8A%9E%E6%B3%95.html)文章处理。**

使用 `vim /etc/docker/daemon.json` 编辑配置，添加以下内容：

```json
{
  "registry-mirrors": ["https://docker.mirrors.tuna.tsinghua.edu.cn/"]
}
```

用 root 用户或具有 sudo 权限的用户加 sudo 后运行，重启 docker：

```bash
systemctl restart docker
```

### 中科大 npm 源（反代的 https://registry.npmjs.org/）

编辑 `~/.npmrc`：

```ini
registry=https://npmreg.proxy.ustclug.org/
```

临时使用中科大源安装软件包：

```bash
npm --registry https://npmreg.proxy.ustclug.org/ install 包名
```

### ~~清华大学 PyPI 源~~ 阿里云 PyPI 源

中科大 PyPI 源公告：

由于 PyPI 源日益增长的空间与 mirror 磁盘空间非常有限的矛盾和用户报告的 PyPI 源的诸多问题，以及考虑到 PyPI 源的资源占用对其他镜像服务质量的影响，我们暂时移除了对 PyPI 的本地镜像。即日起至新的 PyPI 源镜像方案实施前，本站 PyPI 源的 HTTP 协议访问将重定向到 TUNA PyPI 源；PyPI 源的 RSYNC 同步方式停止提供。

```bash
# 临时使用
pip install -i https://mirrors.aliyun.com/pypi/simple/ package

# 使用清华镜像站来升级 pip
pip install -i https://mirrors.aliyun.com/pypi/simple/ pip -U
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
```

### 中科大 Qt 镜像

[从中科大镜像下载 Qt 在线安装器](https://mirrors.ustc.edu.cn/qtproject/official_releases/online_installers/)

使用以下两种方式之一在安装器中配置使用科大源下载 Qt：

- （推荐）新版本的安装器（4.0.1-1 后）支持 --mirror 命令行参数。在命令行中执行安装器，添加 `--mirror https://mirrors.ustc.edu.cn/qtproject` 参数。例如 Windows 下执行当前目录的安装器的命令为 `.\qt-unified-windows-x86-online.exe --mirror https://mirrors.ustc.edu.cn/qtproject`；
- 或在启动安装器后在设置中禁用默认源，添加新源 `http://mirrors.ustc.edu.cn/qtproject/online/qtsdkrepository/linux_x64/root/qt/`（其他版本注意更改地址）。

### github release 镜像（仅部分仓库）

[清华大学](https://mirrors.tuna.tsinghua.edu.cn/github-release/)

[中科大](https://mirrors.ustc.edu.cn/github-release/)
