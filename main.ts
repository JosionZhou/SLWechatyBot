import {log, ScanStatus, Wechaty, WechatyBuilder} from "wechaty";
import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import { dingDongBot, getMessagePayload, LOGPRE } from "./helper";
import Logger from "./logger";
import FileHelper from "./FileHelper";
import AppSetting from "./AppSetting";
import { SayToWechatData, WechatMessageType } from "./SayToWechatData";
import HttpRequestHelper from "./HttpRequestHelper";

/****************************************
 * 去掉注释，可以完全打开调试日志
 ****************************************/
// log.level("silly");
const fileHelper = new FileHelper("config.json");
const puppet = new PuppetPadlocal({
  token: AppSetting.Token,
});
const logger = new Logger();

/**
 * 使用Wechaty创建微信登录二维码，并且进行消息收发；
 * 项目参考地址 @see{@link https://github.com/wechaty/wechaty}
 */
class WechatyBot {
  private static instance: WechatyBot;
  private bot: Wechaty;
  private constructor() {
    this.bot = WechatyBuilder.build({
      name: "SLWechatyBot",
      puppet,
    })
      .on("scan", (qrcode, status) => {
        if (status === ScanStatus.Waiting && qrcode) {
          let codeUrl = encodeURIComponent(qrcode);
          const qrcodeImageUrl = [
            "https://wechaty.js.org/qrcode/",
            codeUrl,
          ].join("");

          //把登录二维码推送到SL服务器
          let url = `${AppSetting.ApiUrl}/WechatyBot/SetScanCode?codeText=${codeUrl}`;
          HttpRequestHelper.Post(url, null);

          log.info(LOGPRE, `onScan: ${ScanStatus[status]}(${status})`);

          console.log(
            "\n=================================================================="
          );
          console.log("\n* Two ways to sign on with qr code");
          console.log("\n1. Scan following QR code:\n");

          require("qrcode-terminal").generate(qrcode, { small: true }); // show qrcode on console

          console.log(
            `\n2. Or open the link in your browser: ${qrcodeImageUrl}`
          );
          console.log(
            "\n==================================================================\n"
          );
          logger.info(`获取微信登录二维码成功.链接：${url}`);
        } else {
          log.info(LOGPRE, `onScan: ${ScanStatus[status]}(${status})`);
          logger.info(`二维码扫描状态：${ScanStatus[status]}(${status})`);
        }
      })

      .on("login", async (user) => {
        log.info(LOGPRE, `${user} login`);
        logger.info(`微信账号[${user}]登录成功`);
      })

      .on("logout", (user, reason) => {
        log.info(LOGPRE, `${user} logout, reason: ${reason}`);
        logger.info(`微信账号[${user}]退出成功`);
      })

      .on("message", async (message) => {
        // console.log("接收消息：", message);
        log.info(LOGPRE, `on message: ${message.toString()}`);
        // logger.info(`OnMessage:${message.toString()}`);

        // await getMessagePayload(message);

        // await dingDongBot(message);
        // console.log("RoomName:",message.room()?.toString());
        //if (this.bot.currentUser.id!=message.payload?.talkerId && message.room()?.payload?.topic == "IT_测试问题件处理") {
          // console.log("CurrentUserId:", this.bot.currentUser.id);
          // console.log("messageSenderId:", message.payload?.talkerId);

          // console.log("消息内容：",message.text());
          //接收消息自动提交到微信客服机器人
          // let querybot = require("./wechatbot");
          // let result = await querybot.QueryWechatBot(message.text(), (answer:string) => { 
          //微信客服机器人回复的内容，再回复到客户
          //   message.say(answer);
          // });
          // console.log("WechatBotQueryResult:",result);
          
          
          // let testObj:SayToWechatData = {
          //   SayType: 1,
          //   RoomName: "IT_测试问题件处理",
          //   Message: {
          //     MessageType: WechatMessageType.Url,
          //     UrlMessage: {
          //         Description: `您好,单号:123456789,有问题:[待提供发票]需要处理。`,
          //         ThumbnailUrl: "https://www.sl56.com/images/index-code.png",
          //         Title: "问题件自助处理",
          //         Url: "https://www.sl56.com/Problem/Link?data=5Nv2TmwC6cvH7nIwKgZHDE3oUv6WUGe5",
          //     }
          //   },
          // };
          // this.say(testObj);
        //}
      })

      .on("room-invite", async (roomInvitation) => {
        log.info(LOGPRE, `on room-invite: ${roomInvitation}`);
      })

      .on("room-join", (room, inviteeList, inviter, date) => {
        log.info(
          LOGPRE,
          `on room-join, room:${room}, inviteeList:${inviteeList}, inviter:${inviter}, date:${date}`
        );
      })

      .on("room-leave", (room, leaverList, remover, date) => {
        log.info(
          LOGPRE,
          `on room-leave, room:${room}, leaverList:${leaverList}, remover:${remover}, date:${date}`
        );
      })

      .on("room-topic", (room, newTopic, oldTopic, changer, date) => {
        log.info(
          LOGPRE,
          `on room-topic, room:${room}, newTopic:${newTopic}, oldTopic:${oldTopic}, changer:${changer}, date:${date}`
        );
      })

      .on("friendship", (friendship) => {
        log.info(LOGPRE, `on friendship: ${friendship}`);
      })

      .on("error", (error) => {
        log.error(LOGPRE, `on error: ${error}`);
        logger.error(`Error:${error}`);
      });
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new WechatyBot();
    }
    return this.instance;
  }

  public run() {
    this.bot.start().then(() => {
      log.info(LOGPRE, "started.");
      logger.info("SLWechatyBot-开始启动");
    });
  }

  /**
   * 向微信发送消息
   * @param reqData 要发送微信消息的对象
   * @returns 
   */
  public async say(reqData: SayToWechatData) {
    let sayMessage: any = null;
    switch (reqData.Message.MessageType) {
      case WechatMessageType.Text:
        sayMessage = reqData.Message.TextMessage;
        break;
      case WechatMessageType.Url:
        sayMessage = new this.bot.UrlLink({
          description: reqData.Message.UrlMessage?.Description,
          thumbnailUrl: reqData.Message.UrlMessage?.ThumbnailUrl,
          title: reqData.Message.UrlMessage?.Title,
          url:reqData.Message.UrlMessage?.Url
        });
        break;
    }
    if (reqData.SayType == 1) {
      let room = await this.bot.Room.find({ topic: reqData.RoomName });
      let allRooms = await this.bot.Room.findAll();
      if (!this.bot.isLoggedIn) {
        throw new Error("未成功登录，消息发送失败");
      }
      if (room) {
        // let url = new this.bot.UrlLink({
        //   description: `您好,单号:123456789,有问题:[待提供发票]需要处理。`,
        //   thumbnailUrl: "https://www.sl56.com/images/index-code.png",
        //   title: "问题件自助处理",
        //   url: "https://www.sl56.com/Problem/Link?data=5Nv2TmwC6cvH7nIwKgZHDE3oUv6WUGe5",
        // });
        let result = await room.say(sayMessage);
        return result;
      } else {
        console.log("allRoomsCount:", allRooms.length);
        console.log("allRooms:", allRooms);
        throw new Error(`找不到群名称为:[${reqData.RoomName}]的群聊`);
      }
    } else {
      let customerConcat = await this.bot.Contact.find({ name: reqData.CustomerName });
      if (customerConcat) {
        let result = await customerConcat.say(sayMessage);
        return result;
      } else {
        throw new Error(`找不到名称为:[${reqData.CustomerName}]的联系人`);
      }
    }
  }

  private exit() {
    process.exit();
  }
}
export default WechatyBot;