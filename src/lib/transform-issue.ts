import {CsvIssue, Issue, Severity, Type} from "../interfaces";

export function transformIssue(csvIssue: CsvIssue): Issue {
  const [filePath = "", lineNumber = "0"] = csvIssue.path.split(":");

  return {
    effortMinutes: 0,
    engineId: "fortify",
    primaryLocation: {
      filePath,
      message: csvIssue.category,
      textRange: {
        startLine: parseInt(lineNumber, 10),
      },
    },
    ruleId: csvIssue.IID,
    severity: Severity.INFO,
    type: Type.VULNERABILITY,
  };
}
