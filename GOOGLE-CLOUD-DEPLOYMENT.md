# Google Cloud Deployment Guide

## Google Cloud Services Used
- **Cloud Run** - Deploy containerized applications
- **Cloud SQL** - Managed PostgreSQL database
- **Artifact Registry** - Store Docker images
- **GitHub Actions** - CI/CD pipeline

## Step 1: Google Cloud Setup

### 1.1 Create Project
```bash
gcloud projects create book-management-app --name="Book Management"
gcloud config set project book-management-app
```

### 1.2 Enable APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

### 1.3 Create Artifact Registry
```bash
gcloud artifacts repositories create book-app-repo \
    --repository-format=docker \
    --location=us-central1
```

## Step 2: Create PostgreSQL Database

### 2.1 Create Cloud SQL Instance
```bash
gcloud sql instances create book-db-instance \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=your-root-password
```

### 2.2 Create Database and User
```bash
gcloud sql databases create bookdb --instance=book-db-instance

gcloud sql users create bookuser \
    --instance=book-db-instance \
    --password=bookpass
```

### 2.3 Get Connection Details
```bash
gcloud sql instances describe book-db-instance --format="value(connectionName)"
```

## Step 3: Service Account Setup

### 3.1 Create Service Account
```bash
gcloud iam service-accounts create github-actions \
    --description="GitHub Actions Service Account" \
    --display-name="GitHub Actions"
```

### 3.2 Grant Permissions
```bash
gcloud projects add-iam-policy-binding book-management-app \
    --member="serviceAccount:github-actions@book-management-app.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding book-management-app \
    --member="serviceAccount:github-actions@book-management-app.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding book-management-app \
    --member="serviceAccount:github-actions@book-management-app.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### 3.3 Create Key
```bash
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@book-management-app.iam.gserviceaccount.com
```

## Step 4: GitHub Repository Setup

### 4.1 GitHub Secrets
Add these secrets in GitHub repository settings:
- `GCP_PROJECT_ID`: `book-management-app`
- `GCP_SA_KEY`: Content of `key.json` file
- `DB_CONNECTION_NAME`: From step 2.3
- `DB_PASSWORD`: `bookpass`

## Step 5: GitHub Actions Workflows

### 5.1 Backend Workflow
Create `.github/workflows/deploy-backend.yml`

### 5.2 Frontend Workflow  
Create `.github/workflows/deploy-frontend.yml`

## Step 6: Production Configuration

### 6.1 Update Backend application.properties
```properties
spring.datasource.url=jdbc:postgresql:///${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.cloud.gcp.sql.instance-connection-name=${DB_CONNECTION_NAME}
spring.cloud.gcp.sql.enabled=true
```

### 6.2 Update Frontend API Base URL
Update your frontend to use production backend URL.

## Step 7: Deploy Commands

### 7.1 Manual Deploy Backend
```bash
gcloud run deploy book-backend \
    --image us-central1-docker.pkg.dev/book-management-app/book-app-repo/backend:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --add-cloudsql-instances book-management-app:us-central1:book-db-instance \
    --set-env-vars DB_NAME=bookdb,DB_USER=bookuser,DB_PASSWORD=bookpass,DB_CONNECTION_NAME=book-management-app:us-central1:book-db-instance
```

### 7.2 Manual Deploy Frontend
```bash
gcloud run deploy book-frontend \
    --image us-central1-docker.pkg.dev/book-management-app/book-app-repo/frontend:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

## Step 8: Get Service URLs
```bash
gcloud run services describe book-backend --region=us-central1 --format="value(status.url)"
gcloud run services describe book-frontend --region=us-central1 --format="value(status.url)"
```

## Cost Optimization
- Use `db-f1-micro` for development
- Set Cloud Run min instances to 0
- Enable automatic scaling

## Monitoring
- Check Cloud Run logs
- Monitor Cloud SQL performance
- Set up alerts for errors