import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { bench, describe } from "vitest";

import {
  getAjvValidator,
  checkFrontMatter,
} from "../scripts/front-matter_utils.js";

const SAMPLES_DIRECTORY = new URL(
  "../tests/front-matter_test_files/",
  import.meta.url,
);

const config = JSON.parse(
  fs.readFileSync(fileURLToPath(new URL("config.json", SAMPLES_DIRECTORY))),
);
const validator = getAjvValidator(config.schema);

function getPath(filePath) {
  return fileURLToPath(new URL(filePath, SAMPLES_DIRECTORY));
}

// Markdown fixtures exercising the different code paths of the linter.
const SAMPLES = [
  "double_quotes.md",
  "single_quotes.md",
  "attribute_order.md",
  "values.md",
  "prettify.md",
  "unknown_attribute.md",
].map(getPath);

describe("front-matter linter", () => {
  bench("getAjvValidator (schema compilation)", () => {
    getAjvValidator(config.schema);
  });

  bench("checkFrontMatter - validate all samples", async () => {
    const options = { config, validator, fix: false };
    for (const filePath of SAMPLES) {
      await checkFrontMatter(filePath, options);
    }
  });

  bench("checkFrontMatter - fix and prettify all samples", async () => {
    const options = { config, validator, fix: true };
    for (const filePath of SAMPLES) {
      await checkFrontMatter(filePath, options);
    }
  });
});
