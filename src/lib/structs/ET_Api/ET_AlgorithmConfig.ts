import type { ET_Algorithms } from "./ET_Algorithms";
import type { BlobConfig } from "./ET_BlobConfig";
import type { LeapConfig } from "./ET_LeapConfig";
import type { ET_HSFConfig } from "./ET_HSFConfig";

// The main AlgorithmConfig interface

export interface ET_AlgorithmConfig {
  algorithm_order: ET_Algorithms[]; // Default: ["LEAP", "BLOB", "HSRAC", "RANSAC", "HSF", "AHSF"]
  blob: BlobConfig;
  leap: LeapConfig;
  hsf: ET_HSFConfig;
}
