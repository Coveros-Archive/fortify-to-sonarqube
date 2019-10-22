import { TextRange } from "./text-range.interface";

export interface Location {
  message: string;
  filePath: string;
  textRange: TextRange;
}
