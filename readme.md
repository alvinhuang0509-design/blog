# Lewin's Insight

一个基于 Astro + TailwindCSS + TypeScript 构建的个人内容站点，包含：
- 信息安全
- AI
- 个人生活博客

## 开发（测试）

```bash
yarn install
yarn run dev
```

## 构建

```bash
yarn run build
yarn run preview
```

## 发布文章（方案 1：GitHub 网页直接发文）

适合“完全自动发布 + 不想在本地装环境”。流程：在 GitHub 网页新增/编辑 Markdown → `Commit` → 自动触发部署工作流。

### 文章放哪？

- 综合/随笔：`src/content/blog/`
- 信息安全：`src/content/security/`
- AI：`src/content/ai/`
- 生活：`src/content/daily-life/`

注意：
- **文件名不要以 `-` 开头**（`-index.md` 这类是列表页/配置页用的；以 `-` 开头会被当作非公开内容过滤掉）
- 设 `draft: true` 也会被当作草稿不发布
- 日期建议用 `YYYY-MM-DD` 或 ISO 格式（例如 `2026-01-28` / `2026-01-28T10:00:00Z`）

### 最小模板（复制就能用）

Blog（`src/content/blog/xxx.md`）：
```md
---
title: "标题"
date: 2026-01-28
draft: false
---
```

Security（`src/content/security/xxx.md`）：
```md
---
title: "标题"
date: 2026-01-28
draft: false
severity: medium
---
```

AI（`src/content/ai/xxx.md`）：
```md
---
title: "标题"
date: 2026-01-28
draft: false
---
```

Daily Life（`src/content/daily-life/xxx.md`，`date` 必填）：
```md
---
title: "标题"
date: 2026-01-28
draft: false
---
```

### 图片怎么发？

把图片上传到 `public/images/...`，然后在文章里用绝对路径引用，例如：
- `![alt](/images/2026/cover.png)`
- 或在 frontmatter：`image: "/images/2026/cover.png"`

## 部署到服务器 8080（无 Docker / 无 Nginx）

前提：
- 服务器需 Node `>= 22.20.0`（本项目 `package.json` 有 engines 约束）
- 推荐用 `nvm` 安装 Node 22，再用 Yarn 1.22.22

快速上线（前台运行）：
```bash
yarn install
yarn build
yarn preview -- --host 0.0.0.0 --port 8080
```

便捷发布（建议）：
- 使用 `scripts/deploy.sh`：在服务器仓库目录执行 `bash scripts/deploy.sh --pull --install --build`
- 可选：配合 `deploy/systemd-user/lewins-insight.service` 做成 systemd 用户服务常驻，然后每次更新只需要跑 deploy 脚本并重启服务

## 部署到阿里云 ECS（全自动：push 即上线）

你有两种全自动思路：

1) CI 构建（Actions 构建后上传 `dist/`）——ECS 不需要 Node/Yarn（更稳、更省事）

2) ECS 构建（代码在 ECS，Actions 触发后 SSH 上去 `git pull && yarn build`）——你偏好的方式

### 1) ECS 一次性初始化（CentOS 8.5）

1. 安装 Nginx
   ```bash
   sudo dnf install -y nginx
   sudo systemctl enable --now nginx
   ```
2. 创建部署用户（建议）
   ```bash
   sudo useradd -m -s /bin/bash deploy || true
   sudo mkdir -p /home/deploy/.ssh
   sudo chmod 700 /home/deploy/.ssh
   sudo touch /home/deploy/.ssh/authorized_keys
   sudo chmod 600 /home/deploy/.ssh/authorized_keys
   sudo chown -R deploy:deploy /home/deploy/.ssh
   ```
   把你生成的 SSH 公钥追加到：`/home/deploy/.ssh/authorized_keys`

3. 准备站点目录（让后续 SSH 部署用户可写）
   ```bash
   sudo mkdir -p /var/www/lewins-insight
   sudo chown -R deploy:deploy /var/www/lewins-insight
   chmod -R 755 /var/www/lewins-insight
   ```
4. 配置 Nginx（示例配置在 `deploy/nginx/lewins-insight.conf`）
   - 建议放到：`/etc/nginx/conf.d/lewins-insight.conf`
   - `root` 默认指向 `/var/www/lewins-insight/current`（原子切换发布）
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```
5. 阿里云安全组放行 80（需要 HTTPS 再放 443）

### 2) 上 GitHub + 配好 Secrets

1. 把代码推到 GitHub（默认工作流监听 `main` 分支）
2. 在 GitHub 仓库 `Settings -> Secrets and variables -> Actions` 添加：
   - `ECS_HOST`：ECS 公网 IP 或域名
   - `ECS_USER`：登录用户（建议单独建一个 `deploy` 用户）
   - `ECS_SSH_KEY`：该用户的 SSH 私钥（用于 Actions SSH 登录）
   - `ECS_PORT`（可选）：SSH 端口，默认 `22`
3. 二选一启用工作流：
   - CI 构建并上传 `dist/`：`.github/workflows/deploy-ecs.yml`（默认仅支持手动触发，如需 push 自动触发可自行打开 `push`）
     - 可选 Secrets：`ECS_PATH`（默认 `/var/www/lewins-insight/current`）
   - ECS 本机构建并发布（推荐给“代码在 ECS”）：`.github/workflows/deploy-ecs-build-on-server.yml`

### 3) ECS 构建：首次准备（只做一次）

1. ECS 安装构建工具（避免依赖编译时缺东西）
   ```bash
   sudo dnf install -y git rsync make gcc-c++ python3
   ```
2. deploy 用户安装 nvm + Node 22.20.0 + Yarn 1.22.22
   ```bash
   curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   source ~/.bashrc
   nvm install 22.20.0
   nvm use 22.20.0
   corepack enable
   corepack prepare yarn@1.22.22 --activate
   ```
3. clone 仓库到 `~/astroplate` 并确保 `origin` 指向 GitHub
   - 仓库如果是 private，建议在 ECS 上为 `deploy` 用户配置一个 GitHub Deploy Key（用于 `git pull`）
4. 首次手动跑一次（验证环境）
   ```bash
   bash scripts/deploy-ecs.sh --branch main --repo-dir "$HOME/astroplate" --web-root /var/www/lewins-insight
   ```
5. 在 GitHub Secrets 增加（可选，方便自定义）：
   - `DEPLOY_BRANCH`：默认 `main`
   - `REPO_DIR`：默认 `/home/<ECS_USER>/astroplate`
   - `WEB_ROOT`：默认 `/var/www/lewins-insight`

之后每次 `git push` 到 `main`，GitHub Actions 会自动：
- （CI 构建模式）构建并 `rsync dist/` 到 ECS
- （ECS 构建模式）SSH 到 ECS 执行 `scripts/deploy-ecs.sh`（原子切换到 `WEB_ROOT/current`）

## 内容字段（置顶 / 精选 / 热门）

文章 frontmatter 支持以下字段（`ai` / `security` / `daily-life` / `blog` 通用）：

```yaml
# 置顶：用于首页「置顶 / 精选」优先展示
pinned: true
weight: 1 # 数字越小越靠前（可选）

# 精选：用于首页「置顶 / 精选」展示
featured: true

# 热门：用于首页「热门 / 最多阅读」排序（可选）
views: 120
comments: 6

# SEO：文章更新时间（可选）
updated: 2026-01-27T10:00:00Z
```

示例（信息安全文章）：

```yaml
---
title: "零信任安全架构入门"
date: 2024-01-23
updated: 2026-01-27
pinned: true
weight: 1
featured: true
views: 860
comments: 12
draft: false
---
```
