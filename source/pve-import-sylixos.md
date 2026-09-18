把 SylixOS 的 VMware 版镜像导入 Proxmox VE 上运行，需要先把 vmdk 磁盘转换成 qcow2，再手动调整虚拟机配置。本文记录我完整的操作过程。

## 转换磁盘格式

将 SylixOS 传到服务器，解压 SylixOS VMware 版，找到其中的：

```text
x86_boot.vmdk
x86_main.vmdk
```

将这两个文件上传到服务器，使用 `qemu-img` 命令将 vmdk 虚拟机磁盘转为 qcow2 格式：

```bash
qemu-img convert -f vmdk -O qcow2 x86_boot.vmdk x86_main.qcow2
qemu-img convert -f vmdk -O qcow2 x86_boot.vmdk x86_boot.qcow2
```

## 创建虚拟机

切换到虚拟化服务器 web 界面，创建新虚拟机：

- 操作系统类型：Linux kernel 2.4，不使用任何光盘介质

  ![20230224155828](https://img.hackerbs.com/20230224155828.png)

- 创建 IDE 硬盘，硬盘大小无所谓

  ![20230224155929](https://img.hackerbs.com/20230224155929.png)

- 配置 CPU，内核数量根据自己需求而定，类型为 host

  ![20230224160025](https://img.hackerbs.com/20230224160025.png)

- 修改网络模型，如果网卡不可用，尝试修改为其他模型

  ![20230224160056](https://img.hackerbs.com/20230224160056.png)

## 修改虚拟机配置

创建虚拟机的步骤完毕，现在连接到服务器的 shell，可以使用 web shell 或另行连接：

```bash
# 进入到虚拟机配置文件目录
cd /etc/pve/qemu-server/

# 编辑刚刚创建的ID为125的虚拟机所属配置文件
vim 125.conf
```

原配置文件如下：

![20230224160513](https://img.hackerbs.com/20230224160513.png)

修改第 6 行 ide0 开头的内容如下：

```conf
ide0: nfshare:125/x86_boot.qcow2
ide1: nfshare:125/x86_main.qcow2
```

> [!WARNING] 注意
> 其中，`ide0`、`ide1` 务必不要重复，以免冲突；`nfshare` 为我虚拟化服务器所在的存储名称，实际名称以你为准！

修改完毕后，将刚刚转化完毕的两个 qcow2 文件移动到虚拟机磁盘映像所在目录。

**先删除现有的文件**

![20230224160856](https://img.hackerbs.com/20230224160856.png)

随后打开 web 界面，启动虚拟机即可！
