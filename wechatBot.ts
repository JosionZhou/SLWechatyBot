import bodyParser from "body-parser";
import express from "express";
import { Express } from "express-serve-static-core";

/**
 * 腾讯微信机器人
 */

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.post("/", function (req: any, res: any) {
//   // 拿到请求体
//   console.log(req.body);
//   res.send("hello");
// });
// app.listen(8888, () => {
//   console.log("listen to port:8888");
// });
let token = "Y0GvsD4drcaykR4InVVmwVFsRfr5HT";

let request = require("request");
let signature = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIxMjN0ZXN0YWJjIiwiaWF0IjoxNzEyMzkyMDgwLCJleHAiOjE3MTIzOTkyODB9.fJka7aZrUHzvlOjQwGy8IMuYbdG9Af-D60XIZoLFKqg";
// request(
//     {
//         url: `https://chatbot.weixin.qq.com/openapi/sign/${token}`,
//         method: "POST",
//         json: true,
//         headers: {
//             "content-type": "application/json",
//         },
//         body: { userid: '123testabc' },
//     },
//     function (error: any, response: any, body: any) {
//         console.log("body:", body);
//     }
// );
type QueryResultCallback = (answer: string) => void;

export function QueryWechatBot(queryString: string,callback:QueryResultCallback) {
    let result: string="";
    request(
        {
            url: `https://chatbot.weixin.qq.com/openapi/aibot/${token}`,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: { signature: signature, query: queryString, env: "debug" },
        },
        function (error1: any, response1: any, body1: any) {
            console.log("body:", body1);
            if (body1.ans_node_id != 0) {
                callback(body1.answer);
            }
        }
    );
}
