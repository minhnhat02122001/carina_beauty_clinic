#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const MESSAGES_DIR = path.join(__dirname, "..", "..", "..", "src", "messages");

function flattenKeys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flattenKeys(value, fullKey);
    }
    return [fullKey];
  });
}

const files = fs
  .readdirSync(MESSAGES_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

if (files.length < 2) {
  console.log(`Only found ${files.length} message file(s) in ${MESSAGES_DIR} — nothing to compare.`);
  process.exit(0);
}

const keysByLocale = {};
for (const file of files) {
  const locale = path.basename(file, ".json");
  const content = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, file), "utf8"));
  keysByLocale[locale] = new Set(flattenKeys(content));
}

const locales = Object.keys(keysByLocale);
const allKeys = new Set(locales.flatMap((l) => [...keysByLocale[l]]));

let hasMismatch = false;
for (const key of [...allKeys].sort()) {
  const missingFrom = locales.filter((l) => !keysByLocale[l].has(key));
  if (missingFrom.length > 0) {
    hasMismatch = true;
    console.log(`MISSING "${key}" in: ${missingFrom.join(", ")}`);
  }
}

if (!hasMismatch) {
  console.log(`OK — ${locales.join(", ")} have identical key sets (${allKeys.size} keys).`);
  process.exit(0);
}

process.exit(1);
