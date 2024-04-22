import fs from "fs";
import path from "path";

class FileHelper {
    private fileName: string="";
    private filePath: string="";
    private encoding: BufferEncoding="utf8";
    constructor(fileName: string, filePath: string | undefined = undefined, encoding: BufferEncoding | undefined = undefined) {
        if(fileName)
            this.fileName = fileName;
        if(filePath)
            this.filePath = filePath!;
        if(encoding)
            this.encoding = encoding!;
    }

    /**
     * 从json文件获取json对象
     * @returns 
     */
    public GetJsonObjectFromFile() {
        try {
            if (!this.fileName)
                throw new Error("文件名不能为空！");
            const data = fs.readFileSync(path.join(this.filePath,this.fileName), this.encoding);
            const jsonObj = JSON.parse(data);
            console.log("ReadJsonText:", JSON.stringify(jsonObj));
            return jsonObj;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * 把json保存到指定文本文件
     * @param jsonObj 
     */
    public SetJsonObjectToFile(jsonObj:any) {
        let jsonText = JSON.stringify(jsonObj);
        console.log("WriteJsonText:", jsonText);
        fs.writeFileSync(path.join(this.filePath, this.fileName),jsonText,this.encoding);
    }
}

export default FileHelper;