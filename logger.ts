import fs from "fs";
import path from "path";

class Logger {
    private infoFilePath: string;
    private errorFilePath: string;

    constructor(logDirectory: string|undefined="./logs") {
        // this.infoFilePath = path.join(logDirectory, "info.log");
        // this.errorFilePath = path.join(logDirectory, "error.log");
        // if (!fs.existsSync(logDirectory))
        //     fs.mkdirSync(logDirectory);
    }

    public info(message: string) {
        // const logEntry = `${new Date().toLocaleString()}: ${message}\n`;
        // fs.appendFileSync(this.infoFilePath, logEntry);
    }

    public error(message: string) {
        // const logEntry = `${new Date().toLocaleString()}: ${message}\n`;
        // fs.appendFileSync(this.errorFilePath, logEntry);
    }
}

export default Logger;