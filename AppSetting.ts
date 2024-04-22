import FileHelper from "./FileHelper";

//与腾讯的客服机器人进行API交互的签名信息
//参考 
/**
 * 与腾讯的客服机器人进行API交互的签名信息
 * - 参考 [微信官方文档>接入智能对话api](https://developers.weixin.qq.com/doc/aispeech/confapi/INTERFACEDOCUMENT.html)
 */
class WechatBotSignature {
    Value?: string;
    Expire?:string
}

/**
 * 程序配置，配置文件为当前目录下的 [appsettings.json](./appsettings.json).
 * 
 * Port：此程序监听的端口，接收外部发送的请求.
 * 
 * Token：Wechaty项目需要的Token 
 * - 参考 http://pad-local.com/.
 * 
 * Signature：与腾讯客服机器人交互所需的签名信息
 */
class AppSetting {
    static Port: number;
    static ApiUrl: string;
    static Token: string;
    static Signature: WechatBotSignature = new WechatBotSignature();
    private static _fileHelper: FileHelper;

    static {
        this.init();
    }

    private static init() {
        this._fileHelper = new FileHelper("appsettings.json");
        let jsonObj = this._fileHelper.GetJsonObjectFromFile();
        this.Port = jsonObj.Port;
        this.Token = jsonObj.Token;
        this.ApiUrl = jsonObj.ApiUrl;
        this.Signature.Value = jsonObj.Signature.Value;
        this.Signature.Expire = jsonObj.Signature.Expire;
    }

    public static save() {
        this._fileHelper.SetJsonObjectToFile(this.asJsonObject());
    }
    
    public static asJsonObject() {
        return {
            "Port": this.Port,
            "ApiUrl":this.ApiUrl,
            "Token": this.Token,
            "Signature": this.Signature
        };
    }
}



export default AppSetting;