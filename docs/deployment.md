# Run and deploy the dashboard

The image contains the built React frontend, FastAPI backend, and public Titanic CSV. One Python process serves everything. The container runs as a non-root user, loads the data at startup, and includes a health check. Project repository: [mikelamakuach24-droid/titanic-project](https://github.com/mikelamakuach24-droid/titanic-project).

## Run locally

Start Docker Desktop in Linux-container mode. From the project root:

```sh
docker compose up --build
```

Open **http://localhost:8080**. For background mode, add `-d`. Stop and remove this project's container with `docker compose down`. No Python or Node installation is required on the host. Compose also makes the container filesystem read-only.

## Supply Render with a Docker image

Render supports an **Existing Image** deployment from Docker Hub, so connecting Git is optional. You need a Docker Hub account and a **public** repository named `titanic-project`. The image includes the CSV; no Kaggle credentials or separate data upload are required. [Render's image deployment guide](https://render.com/docs/deploying-an-image)

Replace `YOUR_DOCKERHUB_USERNAME` below with your actual Docker Hub username. Build for `linux/amd64`, the platform Render requires, then publish the image:

```sh
docker login
docker build --platform linux/amd64 -t YOUR_DOCKERHUB_USERNAME/titanic-project:1.0.0 .
docker push YOUR_DOCKERHUB_USERNAME/titanic-project:1.0.0
```

In Render, choose **New → Web Service → Existing Image** and supply:

| Setting | Value |
| --- | --- |
| Image URL | `docker.io/YOUR_DOCKERHUB_USERNAME/titanic-project:1.0.0` |
| Registry credentials | Leave empty for your public image. |
| Service name | `titanic-analysis-micheal` (or another available name). |
| Region | Choose the region nearest your audience. |
| Instance type | Free for a portfolio demo; paid for continuous availability. |
| Health check path | `/api/health` |
| Environment variable | `PORT=10000` |
| Docker command override | Leave empty; the image already defines its startup command. |

Click **Deploy Web Service**. Render supplies a public HTTPS URL; open it to see the dashboard. It uses the same origin for `/api`, so no frontend API URL setting is needed. [Render's web service settings](https://render.com/docs/web-services)

Render Free sleeps after 15 minutes without incoming traffic; waking it can take about a minute. Use a paid instance if you need immediate availability. [Free service limits](https://render.com/docs/free)

## Update the deployment

Publish a new version tag, such as `1.0.1`, and change the image URL in Render. Image-backed services require a manual deploy; pushing an image does not automatically update the website. Keep the deployed image available in Docker Hub so Render can pull it again on restarts.

## Small production choices

- `npm ci` uses the frontend dependency lockfile; backend package versions are pinned.
- The multi-stage build keeps Node and frontend build tools out of the runtime image.
- Uvicorn binds to `0.0.0.0` and the `PORT` environment variable, without development reload.
- Only built frontend assets are served; backend files and the CSV are not exposed as file-download routes.
- Replace both source CSV copies together, then rebuild the image when changing the dataset.
