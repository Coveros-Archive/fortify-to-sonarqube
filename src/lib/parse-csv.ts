import * as csvParse from "csv-parse";
import * as fs from "fs";

import {CsvIssue} from "../interfaces";

export async function parseCsv(path: string): Promise<CsvIssue[]> {
  const parser = csvParse({
    columns: true,
    from_line: 2,
    trim: true,
  });

  fs.createReadStream(path).pipe(parser);

  return new Promise((resolve, reject) => {
    const output: CsvIssue[] = [];

    parser.on("readable", () => {
      let record = parser.read();
      while (record != null) {
        output.push(record);
        record = parser.read();
      }
    });

    parser.on("error", reject);

    parser.on("end", () => {
      resolve(output);
    });
  });
}
