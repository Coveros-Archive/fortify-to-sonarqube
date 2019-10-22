import { transformIssue } from "../src/lib";
import {CsvIssue, Issue, Severity, Type} from "../src/interfaces";

describe('TransformIssue', () => {
  test('should convert CsvIssue to JSON', () => {
    const csvIssue: CsvIssue = {
      IID: "IID",
      category: "category",
      path: "/path/to/file:100",
      analyzer: "analyzer"
    };

    const expected: Issue = {
      effortMinutes: 0,
      engineId: "fortify",
      primaryLocation: {
        filePath: "/path/to/file",
        message: "category",
        textRange: {
          startLine: 100,
        },
      },
      ruleId: "IID",
      severity: Severity.INFO,
      type: Type.VULNERABILITY,
    };

    const actual = transformIssue(csvIssue);

    expect(expected).toEqual(actual);
  });
});
