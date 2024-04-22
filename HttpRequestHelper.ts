/**
 * 提交请求工具类
 */
class HttpRequestHelper {
    private static headers: Headers = new Headers({
        "Content-Type": "application/json",
    });
    static {

    }

    public static Post(url: string, data: any, headers: Headers | undefined=undefined) {
        if (headers)
            this.headers = headers;
        // 将数据转换为JSON字符串
        const postData = JSON.stringify(data);
        // 发送POST请求
        return fetch(url, {
            method: "POST",
            headers: this.headers,
            body: postData,
        }).then((response) => {
            if (response.ok) {
                if (response.arrayBuffer.length > 0)
                    return response.json(); // 如果返回数据不是JSON，可以省略这一步
                else
                    return "";
            }
            throw new Error("Network response was not ok.");
        }).catch((error) =>
            console.error(
                "There has been a problem with your fetch operation:",
                error
            )
        );
    }
}

export default HttpRequestHelper;