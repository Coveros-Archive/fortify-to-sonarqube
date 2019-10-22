import { Location } from "./location.interface";

export enum Type {
  BUG = "BUG",
  VULNERABILITY = "VULNERABILITY",
  CODE_SMELL = "CODE_SMELL",
}

export enum Severity {
  BLOCKER = "BLOCKER",
  CRITICAL = "CRITICAL",
  MAJOR = "MAJOR",
  MINOR = "MINOR",
  INFO = "INFO",
}

export interface Issue {
  effortMinutes?: number;
  engineId: string;
  primaryLocation: Location;
  ruleId: string;
  severity: Severity;
  secondaryLocations?: Location[];
  type: Type;
}
