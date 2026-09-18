查询服务器是否被暴力破解、以及如何加固 SSH，是每台暴露在公网的 Linux 主机都要面对的问题。这里记录我用 `journalctl` 排查 SSH 登录日志、判断是否被入侵的办法，以及我日常用来加强 SSH 安全的几项配置。

## 查询 SSH 登录日志的办法

`journalctl _COMM=sshd` 可以查看 sshd 所有日志。

```bash
# 查询ssh登陆失败总次数
journalctl _COMM=sshd | grep Failed |wc -l

#查询ssh登陆成功总次数
journalctl _COMM=sshd | grep Accepted |wc -l

#查询被多少不同IP爆破了
journalctl _COMM=sshd | grep "Failed" | awk '{print $(NF-3)}' | sort -u | wc -l

# 列出爆破你的IP
journalctl _COMM=sshd | grep "Failed" | awk '{print $(NF-3)}' | sort -u

# 列出成功登陆的IP
journalctl _COMM=sshd | grep -E "Accepted" | awk '{match($0, /([0-9]+\.){3}[0-9]+/); print substr($0, RSTART, RLENGTH)}' | sort -u
```

## 加强 SSH 安全的办法

### 禁用 root 密码登录

编辑 `/etc/ssh/sshd_config` 文件，默认会有 `PermitRootLogin prohibit-password`。

保持默认的 `prohibit-password` 可使 root 用户密码登录时一直提示密码错误，而不是直接提示禁止密码登录，起到迷惑入侵者的作用。

还可配置 `PasswordAuthentication no` 使普通用户也无法通过密码登录并提示需要 publickey。

### 修改 SSH 服务端口

编辑 `/etc/ssh/sshd_config` 文件，将默认的 `# Port 22` 修改为 `Port 20022` 或其他符合规定的端口。

修改端口后 SSH 连接时需要使用 `-p 20022` 指定端口；使用 scp 上传文件时也需要在 scp 命令后紧跟着使用 `-P 20022` 指定端口。

### SSH 连接时使用指定的 key 进行验证

SSH 客户端在连接服务器时可以使用 `-i` 参数使用指定的 id_rsa 私钥进行连接。

> [!WARNING] 私钥权限
> id_rsa 私钥文件权限需为 600，也就是仅所有者可读写。

使用 root 指定私钥访问 20022 端口的服务器示例：

```bash
ssh -i ./myKeys/id_rsa -p 20022 root@192.168.2.254
```

修改 `sshd_config` 文件后需要重启 SSH 服务，Debian 通常使用 `systemctl restart ssh` 即可。
