import AppSetting from "./AppSetting";

AppSetting.Port += 1;
let expire = AppSetting.Signature.Expire;
let date = new Date(expire!);
date.setSeconds(date.getSeconds() + 7200);
AppSetting.Signature.Expire = date.toLocaleString();
AppSetting.save();