用 Docker Compose 便捷地部署 Nextcloud 及其配套的 MariaDB 和 Redis，并把数据持久存储到本地，本文记录具体的配置文件与自动更新方案。

> [!NOTE] 前置条件
> 安装 docker 的教程在 [apt 等各种源列表（持续更新）](https://hackerbs.com/apt%E7%AD%89%E5%90%84%E7%A7%8D%E6%BA%90%E5%88%97%E8%A1%A8%EF%BC%88%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%EF%BC%89.html)，docker hub 被禁，处理的办法在 [国内 docker hub 无法使用的解决办法](https://hackerbs.com/%E5%9B%BD%E5%86%85docker-hub%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%E7%9A%84%E8%A7%A3%E5%86%B3%E5%8A%9E%E6%B3%95.html)。

新的 docker 已经自带 `docker compose` 命令了，所以不需要再安装 `docker-compose`，且需注意是 `docker空格compose` 而不是以前的 `-`。

## Docker Compose 基础命令

```bash
# 指定配置文件并后台启动
docker compose -f 指定配置文件.yaml up -d

# 停止容器并删除容器
docker compose -f 指定配置文件.yaml down
```

## nextcloud.yaml 配置文件

```yaml
services:
  db:
    image: mariadb:latest
    container_name: nextcloud-db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 设置你的数据库root密码
      MYSQL_DATABASE: 设置你的数据库名
      MYSQL_USER: 设置你的数据库用户名
      MYSQL_PASSWORD: 设置你的数据库用户密码
    volumes:
      - /mnt/nextcloud/db:/var/lib/mysql
      - 你的物理机路径:/var/lib/mysql # 这条是示例，该配置的作用是让数据库的所有文件持久存储到本地的该目录

  redis:
    image: redis:alpine
    container_name: nextcloud-redis
    restart: always

  app:
    image: nextcloud:latest
    container_name: nextcloud-app
    restart: always
    ports:
      - 80:80
    environment:
      MYSQL_HOST: db
      MYSQL_DATABASE: 你的数据库名
      MYSQL_USER: 你的数据库用户名
      MYSQL_PASSWORD: 你的数据库用户密码
      REDIS_HOST: redis
    volumes:
      - /mnt/nextcloud/data:/var/www/html
      - 你的服务器路径:/var/www/html # 这条是示例，该配置的作用是让nextcloud的所有文件持久存储到本地的该目录
    depends_on:
      - db
      - redis
```

## crontab 自动执行

```bash
# 每5分钟执行一次cron
*/5  *  *  *  * docker exec -u www-data nextcloud-app php -f /var/www/html/cron.php

# 每天0点down掉容器然后拉取nextcloud的更新，再启动，然后执行命令行更新
0 0 * * * docker compose -f /mnt/docker-compose.yaml down && docker pull nextcloud && docker compose -f /mnt/docker-compose.yaml up -d && docker exec -it -u 33 nextcloud-app php occ upgrade
```
