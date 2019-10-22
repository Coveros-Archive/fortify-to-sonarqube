import * as fs from "fs";
import {Issue} from "../interfaces";

export async function outputJson(issues: Issue[], outputPath: string): Promise<void> {
  const issueString = JSON.stringify({ issues }, null, 2);
  const writeStream = fs.createWriteStream(outputPath);

  return new Promise(((resolve, reject) => {
    writeStream.write(issueString, "UTF8");
    writeStream.end();
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  }));
}
