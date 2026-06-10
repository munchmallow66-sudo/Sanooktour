# Deployment & DevOps Guide

This guide details how to run, configure, and deploy the **Web Tour (Sanook on Tour)** application.

---

## 📋 Table of Contents
1. [Environment Variables](#1-environment-variables)
2. [Local Deployment (Docker Compose)](#2-local-deployment-docker-compose)
3. [Production Deployment to Vercel (Recommended)](#3-production-deployment-to-vercel-recommended)
4. [Production Deployment to a VPS (Docker Container)](#4-production-deployment-to-a-vps-docker-container)
5. [CI/CD Pipeline (GitHub Actions)](#5-cicd-pipeline-github-actions)

---

## 1. Environment Variables

Create a `.env` file in the root of the project (ignored by Git and Docker context) and configure the following variables:

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL (or local Postgres) connection string | `postgresql://user:password@host/db?sslmode=require` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Storage Account Name | `dwc2k...` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `44658...` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret Key | `p96zIf...` |

---

## 2. Local Deployment (Docker Compose)

The application includes a `docker-compose.yml` file that runs both the Next.js app and a local PostgreSQL database container. The app automatically connects to the database, creates tables, and seeds mock data.

### Prerequisites
- Docker and Docker Compose installed on your system.

### Running the Stack
1. Ensure your local `.env` contains your Cloudinary credentials.
2. Build and start the containers:
   ```bash
   docker compose up --build
   ```
3. Once running, access the site at: [http://localhost:3000](http://localhost:3000)
4. The database is exposed locally on port `5432` with username `postgres`, password `postgres_password`, and database name `webtour` for easy connection using external tools (like DBeaver or pgAdmin).

### Stopping the Stack
To stop and clean up the containers:
```bash
docker compose down
```
*(Add `-v` to also clear persistent database volumes if you want a clean database seed on the next start).*

---

## 3. Production Deployment to Vercel (Recommended)

Vercel is the native platform for Next.js and provides zero-config deployments, automatic CDN caching, and edge function support.

### Steps:
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Log in to [Vercel](https://vercel.com) and click **"Add New"** > **"Project"**.
3. Import your repository.
4. Expand **Environment Variables** and add the following keys from your `.env` file:
   - `DATABASE_URL` (Point to your production Neon Postgres Database)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Click **"Deploy"**. Vercel will build the application and provide a production domain.

---

## 4. Production Deployment to a VPS (Docker Container)

You can run the production Docker container on any VPS (DigitalOcean, AWS EC2, Linode, Hetzner, etc.) or container platforms like Render, Coolify, or CapRover.

### Option A: Raw Docker Run
To build and run the production image manually on your server:

1. Build the production Docker image:
   ```bash
   docker build -t web-tour-app .
   ```
2. Run the container and pass your environment variables:
   ```bash
   docker run -d \
     -p 80:3000 \
     -e DATABASE_URL="postgresql://username:password@neon-host/db?sslmode=require" \
     -e CLOUDINARY_CLOUD_NAME="your_cloud_name" \
     -e CLOUDINARY_API_KEY="your_api_key" \
     -e CLOUDINARY_API_SECRET="your_api_secret" \
     --name web-tour \
     --restart always \
     web-tour-app
   ```

### Option B: Coolify / CapRover (PaaS Platforms)
If using self-hosted platforms like Coolify:
1. Select **"Docker Image"** or **"Dockerfile"** as the build source.
2. Point to your repository branch.
3. Configure the environment variables in the Coolify project settings interface.
4. Deploy. The platform will automatically build the `Dockerfile` using the standalone configuration, map port `3000`, and set up Let's Encrypt SSL certificates automatically.

---

## 5. CI/CD Pipeline (GitHub Actions)

A CI/CD workflow is located at `.github/workflows/ci-cd.yml`. It triggers automatically when you:
- Push changes to the `main` or `master` branch.
- Open a Pull Request targeting those branches.

### Workflow Jobs:
1. **Lint Verification**: Executes `npm run lint` to check for syntax/formatting issues.
2. **Build Verification**: Compiles the Next.js production build using a mock database environment to ensure that the code is free of compilation errors.
