# BFMeta-Wallet（中文）
英文版请参见 [README](README.md)。

## 简介
BFMeta 桌面钱包 monorepo，提供账户/密钥管理、转账、签名、多链适配与网络切换。

## 架构
- 工作区 `packages/`
  - `wallet`：钱包 UI 与应用壳
  - 链适配器：`bcf`、`bsc`、`eth`、`tron`
  - 共享库：`helpers`、`typings`、`test`
- 工具链：`lerna.json`、`pnpm-workspace.yaml`、`tsconfig*.json`
- 配置：`config/`；脚本：`scripts/`

## 快速开始
```bash
pnpm install
pnpm dev      # 开发
pnpm build    # 全量构建
```
连接主网前，请在 `config/` 或环境变量中设置节点地址、网络参数。

## 贡献规范
- 生态产品（Layer 2A，GPLv3）：TypeScript 严格，避免 `any`/`@ts-ignore`。
- UI 与业务分层：UI 负责展示，逻辑放共享 helpers/适配器（SRP/DRY）。
- 涉及转账/密钥/设置的改动需在 `packages/test` 补回归用例。
- 分支：`feature/<scope>`、`fix/<issue>`；提交用简短动词短语。
