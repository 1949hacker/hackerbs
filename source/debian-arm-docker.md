在 Debian x86_64 平台上搭建 Docker 的 ARM 环境，可以直接借助 QEMU 用户模式模拟来实现。本文记录具体的配置与验证方法。

## 安装与启用 QEMU 用户模式

```bash
# 安装QEMU用户模式工具：QEMU将用于在x86_64主机上模拟ARMv8架构
apt install qemu-system binfmt-support qemu-user-static

# 启用QEMU用户模式支持
update-binfmts --enable qemu-arm
update-binfmts --enable qemu-aarch64
```

## 验证环境

使用以上命令便可搭建 Docker 的 arm 环境，再使用如下命令即可测试环境是否可以正常使用：

```bash
# 拉取debian armv8镜像
docker pull arm64v8/debian

# 运行该镜像，使用了--rm参数，会在退出时自动删除容器
# 执行成功便会自动进入容器shell，使用exit即可退出
docker run -it --rm arm64v8/debian /bin/bash
```
