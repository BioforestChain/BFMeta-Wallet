// @ts-check

const fs = require("node:fs");
const path = require("node:path");

const rootPath = path.join(process.cwd(), "/packages");

const js = process.env.js === "true" ? true : false;

function getAllFile(targetPath, allFileName) {
    if (!fs.existsSync(targetPath)) {
        return;
    }
    let files = fs.readdirSync(targetPath);
    for (const file of files) {
        if (file.includes("build")) {
            continue;
        }
        const curPath = path.join(targetPath, file);
        if (fs.statSync(curPath).isDirectory()) {
            // 递归获取文件夹
            getAllFile(curPath, allFileName);
        }
        const condition = js ? file.endsWith(".ts") || file.endsWith(".js") : file.endsWith(".ts");
        if (condition) {
            allFileName[allFileName.length] = curPath;
        }
    }
}

function listAllFile(dirPaths) {
    for (const dirPath of dirPaths) {
        const targetPath = path.join(rootPath, dirPath);

        const allFileName = [];

        getAllFile(targetPath, allFileName);

        const result = allFileName.map((fileName) =>
            fileName.substr(targetPath.length + 1).replaceAll("\\", "/"),
        );

        const tsconfigPath = `${targetPath}/tsconfig.json`;

        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath).toString());

        tsconfig.files = result;

        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4));
    }
}

listAllFile(fs.readdirSync(rootPath));
