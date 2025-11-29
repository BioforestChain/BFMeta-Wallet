# BFMeta-Wallet（中文）
英文版请参见 [README](README.md)。

## 简介
BFMeta 桌面钱包：账户管理、转账、签名及链交互。

## 快速开始
1) 安装依赖：`pnpm install`
2) 开发运行：`pnpm dev`
3) 构建：`pnpm build`（如有平台脚本按需使用）
4) 连接主网前，请在应用配置中设置节点地址和网络参数。

## 贡献
- 产品级应用：界面文案保持中英双语；避免 `any`/`@ts-ignore`。
- UI 与服务逻辑分层，复用共享 hooks/utils，遵循 DRY。
- 新增功能（转账、导入密钥、设置）需补最小回归测试。
- 分支：`feature/<scope>` / `fix/<issue>`；提交保持简洁。
