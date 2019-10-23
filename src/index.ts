#!/usr/bin/env node

import * as program from "commander";
import {CsvIssue} from "./interfaces";
import {outputJson, parseCsv, transformIssue} from "./lib";

async function main(inputPath: string, outputPath: string) {
  let csvIssues: CsvIssue[];

  try {
    csvIssues = await parseCsv(inputPath);
  } catch (err) {
    console.error("Error parsing csv: ", err);
    throw err;
  }
  const issues = csvIssues.map(transformIssue);
  try {
    await outputJson(issues, outputPath);
  } catch (err) {
    console.error("Failed to output json file: ", err);
    throw err;
  }
}

program
  .option("-i, --input [path]", "Fortify CSV file: [path]")
  .option("-o, --output [path]", "Outputted JSON file: [path]")
  .parse(process.argv);

if (!program.input) {
  console.error("Input file required");
  process.exitCode = 1;
} else if (!program.output) {
  console.error("Output file required");
  process.exitCode = 1;
} else {
  main(program.input, program.output)
    .then(() => console.log(`Transformation complete, file located at ${program.output}`))
    .catch(console.error);
}
