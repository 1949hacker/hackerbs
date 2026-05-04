---
title: 记录一下我的Debian配置v2ray config.json
date: '2024-06-13 16:41:09'
tags:
  - debian
  - v2ray
  - v2ray客户端
  - config.json
  - legacy-blog
  - 知识图谱
  - datacentre-security
aliases:
  - 记录一下我的Debian配置v2ray-config-json
  - 记录一下我的Debian配置v2ray config.json
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/记录一下我的Debian配置v2ray-config-json.md
---
> [!info] 知识关系
> 所属体系: [[datacentre/_index|数据中心与基础设施]] / [[datacentre/security/_index|安全与访问控制]]
> 主题节点: 记录一下我的Debian配置v2ray config.json
> 推荐前置: [[datacentre/os/debian-basics|Debian基础知识【持续更新】]]
> 相关主题: [[datacentre/security/linux-ssh-log-intrusion-hardening|Linux查询ssh日志判断是否被入侵及加强ssh安全的办法]]
> 原始来源: `source/_posts/记录一下我的Debian配置v2ray-config-json.md`
> 从旧博客迁移；已按知识图谱结构重新归档。

---

# 配置内容如下

`vim /etc/v2ray/config.json`

```json
{
  "log": {
    "access": "",
    "error": "",
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "tag": "socks",
      "port": 10808,
      "listen": "127.0.0.1",
      "protocol": "socks",
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ],
        "routeOnly": false
      },
      "settings": {
        "auth": "noauth",
        "udp": true,
        "allowTransparent": false
      }
    }
  ],
  "outbounds": [
    {
      "tag": "proxy",
      "protocol": "shadowsocks",
      "settings": {
        "servers": [
          {
            "address": "你的服务器地址",
            "method": "加密方式",
            "ota": false,
            "password": "你的密码",
            "port": 服务器端口,
            "level": 1
          }
        ]
      },
      "streamSettings": {
        "network": "tcp"
      },
      "mux": {
        "enabled": false,
        "concurrency": -1
      }
    },
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {}
    },
    {
      "tag": "block",
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "http"
        }
      }
    }
  ]
}
```
