---
title: 记录用docker部署nextcloud及配套mariadb、redis和持久化存储
date: '2024-06-13 16:45:32'
tags:
  - nextcloud
  - docker
  - docker compose
  - mariadb
  - redis
aliases:
  - 记录用docker部署nextcloud及配套mariadb、redis和持久化存储
origin:
  repository: 'https://github.com/1949hacker/blog.git'
  path: source/_posts/记录用docker部署nextcloud及配套mariadb、redis和持久化存储.md
---

> [!info] 知识位置
> 体系: 容器与镜像体系
> 层级: 实践
> 前置知识: [[datacentre/container/docker-hub-workaround-cn|国内docker hub无法使用的解决办法]]
> 强关联: [[datacentre/os/apt-mirror-sources|apt等各种源列表（持续更新）]]
> 原始来源: `source/_posts/记录用docker部署nextcloud及配套mariadb、redis和持久化存储.md`
> 关系规则: 只保留学习或排障上有直接依赖的边，避免为了双链而双链。

---

# 使用docker compose便捷的部署nextcloud及其配套的mariadb和redis并实现数据持久存储在本地的办法

**安装docker的教程在[[datacentre/os/apt-mirror-sources|apt等各种源列表（持续更新）]]，docker hub被禁，处理的办法在[[datacentre/container/docker-hub-workaround-cn|国内docker hub无法使用的解决办法]]**

新的docker已经自带`docker compose`命令了，所以不需要再安装`docker-compose`，且需注意是`docker空格compose`而不是以前的`-`

## docker compose基础命令如下：



```shell
# 指定配置文件并后台启动
docker compose -f 指定配置文件.yaml up -d

# 停止容器并删除容器
docker compose -f 指定配置文件.yaml down
```

## nextcloud.yaml配置文件如下

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

## crontab自动执行

```shell
# 每5分钟执行一次cron
*/5  *  *  *  * docker exec -u www-data nextcloud-app php -f /var/www/html/cron.php

# 每天0点down掉容器然后拉取nextcloud的更新，再启动，然后执行命令行更新
0 0 * * * docker compose -f /mnt/docker-compose.yaml down && docker pull nextcloud && docker compose -f /mnt/docker-compose.yaml up -d && docker exec -it -u 33 nextcloud-app php occ upgrade
```
