// @ts-check

const fs = require("node:fs");
const path = require("node:path");
const { prettierFormat } = require("@bfchain/devkit");

const packagesRootPath = path.join(process.cwd(), "packages");
const packages = fs.readdirSync(packagesRootPath);

const basePackageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"),
);

for (const package of packages) {
    const packageJsonPath = path.join(packagesRootPath, package, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
        continue;
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    const keywrods = packageJson.name.split("/")[1].split("-");
    packageJson.author = basePackageJson.author;
    packageJson.description = `${basePackageJson.description} ${keywrods.join(" ")}`;
    packageJson.keywords = [...basePackageJson.keywords, ...keywrods];
    /// 写回文件
    fs.writeFileSync(
        packageJsonPath,
        prettierFormat(JSON.stringify(packageJson), {
            parser: "json-stringify",
        }),
    );
    console.log(`percect ${packageJsonPath}`);
}
