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

## Troubleshooting

- **Build Fails (Memory)**: Increasing memory to 2GB or 4GB usually fixes Next.js build issues.
- **Database Errors**: Verify your `DATABASE_URL` and `MONGODB_URI` are correct and accessible (allow Northflank IP ranges if using external DBs).
- **Missing AI**: As noted, AI features are disabled. To enable them, restore the `ai/` directory to the repo and uncomment the lines in `Dockerfile` and `start-combined.sh`.
