// @ts-check
const fs = require("node:fs");
const path = require("node:path");
const { prettierFormat, console, getProjectPath, CtrlStrings } = require("@bfchain/devkit");

function namePackages(moduleBaseName, opts = {}) {
    const packageBaseName = moduleBaseName.split("/").pop();
    const packagesRoot = path.join(__dirname, "../packages");
    const packages = new Set(fs.readdirSync(packagesRoot));

    const packageVersionCache = Object.create(null);

    //#region 第一步，先确保package.json的正确性
    for (const packagesSortName of packages) {
        const packageJsonPath = path.join(packagesRoot, packagesSortName, "package.json");
        if (!fs.existsSync(packageJsonPath)) {
            packages.delete(packageJsonPath);
            continue;
        }
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
        packageVersionCache[packageJsonPath] = packageJson;
        /// 配置模块名称
        if (packagesSortName === packageBaseName) {
            packageJson.name = moduleBaseName;
        } else {
            packageJson.name = `${moduleBaseName}-${packagesSortName
                .replace(/_/g, "-")
                .replace(/[A-Z]/, (c) => "-" + c.toLocaleLowerCase())}`;
        }
        /// 初始化版本号
        if (!packageJson.version || packagesSortName === packageBaseName) {
            packageJson.version = require(path.join(__dirname, "../lerna.json")).version;
        }
        /// 这里只是简单的初始化，具体还是可以自定义来进行覆盖的
        if (!packageJson.main) {
            packageJson.main = "build/cjs/index.js";
        }
        if (!packageJson.types) {
            packageJson.types = "build/cjs/index.d.ts";
        }
        if (
            !packageJson.module &&
            fs.existsSync(path.join(packagesRoot, packagesSortName, "tsconfig.esm.json"))
        ) {
            packageJson.module = "build/cjs/index.d.ts";
        }
        if (!packageJson.files) {
            packageJson.files = ["build"];
        }
        /// 写回文件
        fs.writeFileSync(
            packageJsonPath,
            prettierFormat(JSON.stringify(packageJson), {
                parser: "json-stringify",
            }),
        );
    }
    //#endregion

    //#region 第二步，校准tsconfig，并基于此修正package.json
    /**typings为默认共享的基础模块 */
    const hasTypings = packageBaseName !== "typings" && packages.has("typings");

    function getPackageJson(packagesSortName = "typings") {
        const packageJsonPath = path.resolve(packagesRoot, packagesSortName, "package.json");
        if (!packageVersionCache[packageJsonPath]) {
            packageVersionCache[packageJsonPath] = require(packageJsonPath);
        }
        return packageVersionCache[packageJsonPath];
    }

    for (const packagesSortName of packages) {
        console.line("\n>>>", packagesSortName);
        const packageJson = getPackageJson(packagesSortName);
        //// tscofnig
        const tsconfigJsonPath = path.join(packagesRoot, packagesSortName, "tsconfig.json");
        const tsconfigJson = JSON.parse(fs.readFileSync(tsconfigJsonPath, "utf8"));
        const oldReferences = tsconfigJson.references || (tsconfigJson.references = []);
        const referenceHashMap = oldReferences.reduce((previous, current) => {
            previous[current.path] = current;
            return previous;
        }, {});
        /// 尝试添加typings的基础依赖
        if (hasTypings && packageJson.name !== moduleBaseName + "-typings") {
            const TYPINGS_TSCONFIG = "../typings/tsconfig.json";
            if (!referenceHashMap[TYPINGS_TSCONFIG]) {
                referenceHashMap[TYPINGS_TSCONFIG] = { path: TYPINGS_TSCONFIG };
            }
        }
        const newReferences = Object.values(referenceHashMap).sort((a, b) =>
            a.path.localeCompare(b.path),
        );
        /// 写入references属性
        tsconfigJson.references = newReferences.length ? newReferences : undefined;

        /// 将tsconfig的依赖（references）反映到package.json中去
        const dependencies = packageJson.dependencies || (packageJson.dependencies = {});
        for (const reference of newReferences) {
            const referenceDir = path.dirname(
                path.join(path.dirname(tsconfigJsonPath), reference.path),
            );
            const packageJson = getPackageJson(referenceDir);
            dependencies[packageJson.name] = "^" + packageJson.version;
        }

        /// 保持文件
        console.info(tsconfigJsonPath, tsconfigJson);
        fs.writeFileSync(
            tsconfigJsonPath,
            prettierFormat(JSON.stringify(tsconfigJson), {
                parser: "json-stringify",
            }),
        );
        fs.writeFileSync(
            path.join(packagesRoot, packagesSortName, "package.json"),
            prettierFormat(JSON.stringify(packageJson), {
                parser: "json-stringify",
            }),
        );
        console.line(CtrlStrings.previousLine());
        console.success(packagesSortName, "=>", packageJson.name);
    }
    //#endregion

    //#region 第三步，如果有单独导出类型文件的需求，那么写入配置文件
    const { standaloneTypeConfigFileName } = opts;
    if (standaloneTypeConfigFileName) {
        standaloneTypeConfigFileName;
        for (const packagesSortName of packages) {
            console.line("\nStandalone Declaration Dir >>>", packagesSortName);
            //// tscofnig.@types.json
            const tsconfigJsonPath = path.join(
                packagesRoot,
                packagesSortName,
                standaloneTypeConfigFileName,
            );
            const tsconfigJson = fs.existsSync(tsconfigJsonPath)
                ? JSON.parse(fs.readFileSync(tsconfigJsonPath, "utf8"))
                : {};
            if (!tsconfigJson.extends) {
                tsconfigJson.extends = "./tsconfig";
            }
            const compilerOptions =
                tsconfigJson.compilerOptions || (tsconfigJson.compilerOptions = {});

            /// 初始化配置declarationDir
            if (!compilerOptions.declarationDir) {
                const packageName = getPackageJson(packagesSortName).name;
                let typesPackageName = packageName;

                if (packageName.startsWith("@") && packageName.includes("/")) {
                    typesPackageName = typesPackageName.slice(1).replac(/\//g, "__");
                }
                compilerOptions.declarationDir = `../@types/${typesPackageName}`;
                compilerOptions.declarations = true;
            }

            /// 如果没有默认的ourDir路径，或者没有 noEmitJs 的声明，那么默认不去生成 js文件
            if (!compilerOptions.ourDir && compilerOptions.noEmitJs === undefined) {
                compilerOptions.noEmitJs = true;
            }

            /// 保持文件
            console.info(tsconfigJsonPath, tsconfigJson);
            fs.writeFileSync(
                tsconfigJsonPath,
                prettierFormat(JSON.stringify(tsconfigJson), {
                    parser: "json-stringify",
                }),
            );

            console.success(
                `Standalone Declaration Dir :${packagesSortName}`,
                "=>",
                path.relative(process.cwd(), compilerOptions.declarationDir),
            );
        }
    }

    //#endregion
}

if (module === process.mainModule) {
    const rootProjectJson = require(getProjectPath("package.json"));
    // let standaloneTypeConfigFileName =
    //   rootProjectJson.standaloneTypeConfigFileName;
    // if (!standaloneTypeConfigFileName) {
    //   if (rootProjectJson.standaloneTypes) {
    //     standaloneTypeConfigFileName =
    //       typeof rootProjectJson.standaloneTypes === "string"
    //         ? rootProjectJson.standaloneTypes
    //         : "tsconfig.@types.json";
    //   }
    // }
    namePackages(rootProjectJson.name, rootProjectJson.bdkMono);
}
