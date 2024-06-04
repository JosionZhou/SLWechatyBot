import http from "http";
import WechatyBot from "./main";
import querystring from "querystring";
import util from "util";
import express from "express";
import bodyParser from "body-parser";
import { Express } from "express-serve-static-core";
import AppSetting from "./AppSetting";
import { SayToWechatData } from "./SayToWechatData";
import Logger from "./logger";

const wechatyBot = WechatyBot.getInstance();
const exp: Express = express();
const logger: Logger = new Logger();
class app {
    constructor() { }
    public start() {
        //监听Get
        // http.createServer(function (request, response) {
        //     // 发送 HTTP 头部
        //     // HTTP 状态值: 200 : OK
        //     // 内容类型: text/plain
        //     response.writeHead(200, { "Content-Type": "text/plain" });

        //     // 发送响应数据 "Hello World"
        //     response.end("Hello World\n");
        // }).listen(8888);

        // 终端打印如下信息
        // console.log("Server running at http://127.0.0.1:8888/");

        // http.createServer(function (req, res) {
        //     // 定义了一个post变量，用于暂存请求体的信息
        //     var postData:any;

        //     // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        //     req.on("data", function (chunk) {
        //         postData += chunk;
        //     });

        //     // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
        //     req.on("end", function () {
        //         let post = querystring.parse(postData);
        //         res.end(util.inspect(post));
        //         console.log("postData:", postData);
        //         wechatyBot.say("", "").then(res => {
        //             console.log("发送消息结果Id:", res?.id);
        //             console.log("postJson:",post);
        //         });
        //     });
        // }).listen(8888);
        exp.use(bodyParser.urlencoded({ extended: true }));
        exp.use(bodyParser.json());

        exp.post("/", function (req: any, res: any) {
            // 拿到请求体
            //console.log(req.body);
            try {
                let sayData: SayToWechatData = req.body;
                let sayDataStr = JSON.stringify(sayData);
                //logger.info(`开始通知消息：${sayDataStr}`);
                wechatyBot.say(sayData).then(sayResult => {
                    if (sayResult) {
                        //logger.info(`消息发送成功：MessageId.${sayResult.id},消息内容${sayDataStr}`);
                        //console.log(`消息发送成功：MessageId.${sayResult.id}`);
                        res.send({
                            Success: true,
                            Id: sayResult.id
                        });
                    } else {
                        //logger.info(`消息发送失败：${sayResult}`);
                        console.log(`消息发送失败：${sayResult}`);
                    }
                }).catch(err => {
                    //logger.info(`消息发送失败：${err},消息内容${sayDataStr}`);
                    console.log(`消息发生失败：${err}`);
                    // logger.error(err+"");
                    res.send({
                        Success: false,
                        Message: err + ""
                    });
                });
            } catch (err) {
                logger.error(err + "");
            }
        });
        exp.listen(AppSetting.Port, () => {
            logger.info(`服务启动成功.正在监听端口：${AppSetting.Port}`);
            console.log(`服务启动成功.正在监听端口：${AppSetting.Port}`);
        });

        wechatyBot.run();

        process.on('SIGINT', () => {
            console.log('手动退出程序');
            logger.info("手动退出程序");
            // 在这里处理SIGINT信号，进行清理工作
            process.exit(); // 可选，如果你需要强制立即退出的话
        });
    }
}
const server = new app();
server.start();