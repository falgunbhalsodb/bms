# Google Cloud Setup Commands

## 1. Create Project & Enable APIs
```bash
gcloud projects create book-management-app --name="Book Management"
gcloud config set project book-management-app

gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com
```

## 2. Create Artifact Registry
```bash
gcloud artifacts repositories create book-app-repo \
    --repository-format=docker \
    --location=us-central1
```

## 3. Create PostgreSQL Database
```bash
gcloud sql instances create book-db-instance \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=your-root-password

gcloud sql databases create bookdb --instance=book-db-instance

gcloud sql users create bookuser \
    --instance=book-db-instance \
    --password=bookpass
```

## 4. Create Service Account
```bash
gcloud iam service-accounts create github-actions \
    --description="GitHub Actions Service Account" \
    --display-name="GitHub Actions"

gcloud projects add-iam-policy-binding book-management-app \
    --member="serviceAccount:github-actions@book-management-app.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding book-management-app \
    --member="serviceAccount:github-actions@book-management-app.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding book-management-app \
    --member="serviceAccount:github-actions@book-management-app.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@book-management-app.iam.gserviceaccount.com
```

## 5. Get Connection Name
```bash
gcloud sql instances describe book-db-instance --format="value(connectionName)"
```

## 6. GitHub Secrets to Add
- `GCP_PROJECT_ID`: `book-management-app`
- `GCP_SA_KEY`: Content of `key.json` file
- `DB_CONNECTION_NAME`: Output from step 5
- `DB_PASSWORD`: `bookpass`

## 7. Manual Deploy (if needed)
```bash
# Backend
gcloud run deploy book-backend \
    --image us-central1-docker.pkg.dev/book-management-app/book-app-repo/backend:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --add-cloudsql-instances book-management-app:us-central1:book-db-instance \
    --set-env-vars DB_NAME=bookdb,DB_USER=bookuser,DB_PASSWORD=bookpass

# Frontend
gcloud run deploy book-frontend \
    --image us-central1-docker.pkg.dev/book-management-app/book-app-repo/frontend:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```