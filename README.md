# SL使用Wechaty推送问题件信息

## 编译镜像

```Shell
docker build -t slwechatybot .
```

## 启动容器

### 开发环境

```Shell
docker run -d -p 8888:8888 --restart always --name wechatybot  --add-host api.sl56.com:192.168.6.8 slwechatybot
```

```Shell
docker run -d -p 8888:8888 --name wechatybot  --add-host api.sl56.com:192.168.6.8 slwechatybot
```

### 正式环境

```Shell
docker run -d -p 8888:8888 --restart always --name wechatybot slwechatybot
```
