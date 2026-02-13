/* eslint-disable no-console */

/**
 * Guard script for monorepo usage.
 * Expo must be started from the `mobile/` project root, not the workspace root.
 */
const path = require("path");

const cwd = process.cwd();
const expected = path.resolve(__dirname, "..");

if (path.resolve(cwd) !== expected) {
  console.error(
    [
      "",
      "[Safyr mobile] Mauvais dossier de lancement.",
      `- CWD actuel: ${cwd}`,
      `- Attendu  : ${expected}`,
      "",
      "Lancez Expo comme ceci:",
      "  cd mobile && npx expo start",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

