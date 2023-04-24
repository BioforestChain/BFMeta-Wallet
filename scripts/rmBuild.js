// @ts-check
const fs = require("node:fs");
const path = require("node:path");
const rootPath = path.resolve(__dirname, "../packages");

const packages = fs.readdirSync(rootPath);

for (const package of packages) {
    const targetPath = path.join(rootPath, package, "build");
    if (fs.existsSync(targetPath)) {
        fs.rmSync(targetPath, { recursive: true });
    }
}
