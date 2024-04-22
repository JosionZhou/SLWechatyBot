/**
 * 枚举微信消息类型，目前暂时只定义两种
 * @param Text 文本信息
 * @param Url 链接信息
 */
export enum WechatMessageType{
    Text = 1,
    Url
}

/**
 * Url类型的消息对象
 * @param Description 描述信息
 * @param ThumbnailUrl 显示的缩略图
 * @param Title 标题
 * @param Url 点击消息跳转到的页面Url
 */
type WechatUrlMessage = {
    Description: string;
    ThumbnailUrl: string;
    Title: string;
    Url: string
}

/**
 * 微信消息内容对象
 * 
 */
type WechatMessage = {
    MessageType: WechatMessageType;
    TextMessage?: string;
    UrlMessage?: WechatUrlMessage;
}

/**
 * 回复微信消息的数据对象
 * @param SayType 回复消息的类型 0：对单人回复  1：对群回复
 * @param CustomerName 客户名，对单人回复时使用
 * @param RoomName 群名，对群回复时使用
 * @param Message 回复的消息内容
 */
export type SayToWechatData = {
    SayType: number;
    CustomerName?: string;
    RoomName?: string;
    Message: WechatMessage;
}