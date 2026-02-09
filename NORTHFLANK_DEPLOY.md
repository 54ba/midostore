# Deploying MidoStore to Northflank

This guide outlines how to deploy the `midostore` application to Northflank.

> **Note**: The AI service features have been temporarily disabled for this deployment because the required files (`ai/` directory) are missing from the `main` branch.

## Prerequisites

- A [Northflank](https://northflank.com/) account.
- A [GitHub](https://github.com/) account connected to Northflank.
- Identify your database providers (Northflank Addons or external).

## Step 1: Create a New Service

1. **Dashboard**: Go to your Northflank dashboard and create a new Project (e.g., `midostore-prod`).
2. **Service**: Click **Create New** > **Service** > **Combined Service**.
3. **Repository**: Select **GitHub** and choose `54ba/midostore`.
4. **Branch**: Select `main`.
5. **Build Type**: Select **Dockerfile**.
    - **Context**: `/`
    - **Dockerfile Path**: `Dockerfile`
6. **Resources**:
    - **Plan**: Starter or higher recommended.
    - **CPU**: `1000m` (1 vCPU)
    - **Memory**: `2048Mi` (2 GB) - *Required for Next.js build + runtime*

## Step 2: Configure Environment Variables

Navigate to **Environment** > **Variables** in your service settings. Add the following:

| Key | Value Example | Secret? |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | ✅ Yes |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/db...` | ✅ Yes |
| `NEXT_PUBLIC_NETLIFY_SITE_URL` | `https://your-app-name.northflank.app` | No |
| `NODE_ENV` | `production` | No |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | No |

> **Tip**: You can create PostgreSQL and MongoDB databases directly in Northflank under **Addons** and link them to your service to automatically inject connection strings!

## Step 3: Networking

1. Go to **Networking** > **Ports**.
2. Ensure port `3000` is exposed (HTTP).
3. Enable **Public Access** to generate a URL (e.g., `https://midostore-xyz.northflank.app`).

## Step 4: Deploy

1. Click **Save & Deploy**.
2. Monitor the **Build Logs**. The build process (installing dependencies, building Next.js) may take 3-5 minutes.
3. Once the build succeeds, check **Runtime Logs** to ensure the app starts (look for `Ready in ...`).

### 3. Deploy via Northflank CLI (Verified)

If the automatic build fails or uses buildpacks by mistake, use these commands to correctly configure and redeploy:

#### A. Initial Project Audit

```bash
# Verify project and service existence
northflank list projects
northflank list services --project midostore
```

#### B. Setup Environment Variables

If your service needs the database URLs, set them now:

```bash
northflank update service runtime-environment \
  --projectId midostore \
  --serviceId midostore \
  --input '{"runtimeEnvironment": {"DATABASE_URL": "your_db_url", "MONGODB_URI": "your_mongo_url"}}' \
  --noDefaults
```

#### C. Force Dockerfile Engine

If Northflank is trying to use Buildpacks (Detection phase in logs), you may need to recreate the service with the correct engine:

```bash
# 1. Delete the misconfigured service
northflank delete service --projectId midostore --serviceId midostore --force

# 2. Recreate with Docker Engine
# (Replace projectUrl with your actual repo)
northflank create service combined \
  --projectId midostore \
  --input '{
    "name": "midostore",
    "billing": { "deploymentPlan": "nf-compute-10" },
    "deployment": { "instances": 1, "region": "us-central" },
    "buildEngineConfiguration": { "buildEngine": "docker" },
    "buildSettings": { "dockerfile": { "dockerFilePath": "/Dockerfile", "dockerWorkDir": "/" } },
    "vcsData": { "projectUrl": "https://github.com/54ba/midostore", "projectType": "github", "projectBranch": "main" },
    "ports": [{ "name": "site", "internalPort": 3000, "protocol": "HTTP", "public": true }]
  }' --noDefaults
```

#### D. Monitor Build

```bash
# Get the new build ID
northflank get service builds --projectId midostore --serviceId midostore --output json

# Stream logs
northflank get service build-logs --projectId midostore --serviceId midostore --buildId [BUILD_ID]
```

---

## 🛠️ Troubleshooting

- **409 Conflict**: Only one build can run at a time on free plans. Use `northflank abort service build` to clear old builds.
- **Port Mismatch**: Ensure `internalPort` matches the `EXPOSE` port in your Dockerfile (3000).
- **Missing AI**: This deployment disables the AI service because the `ai/` directory was missing in the repository.
