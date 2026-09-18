这篇记录我在 Debian 上给 v2ray 写 `config.json` 的配置内容，包含一个本地 socks 入站和 shadowsocks 出站。配置里的服务器地址、加密方式、密码和端口都要替换成自己的。

配置文件路径是 `/etc/v2ray/config.json`，用 `vim /etc/v2ray/config.json` 编辑，配置内容如下：

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
