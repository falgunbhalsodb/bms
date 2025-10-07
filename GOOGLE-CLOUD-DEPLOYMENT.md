# Step 1: Google Cloud Setup

## 1.1 Create Project and Set Active Project
    
    Go to the Google Cloud Console.
    
    Click the project selector at the top (next to "Google Cloud").
    
    Click "New Project".
    
    Enter the Project name: Book Management and set the Project ID to book-management-app (if available).
    
    Click "CREATE".
    
    Once created, ensure the book-management-app project is selected in the project selector.

## 1.2 Enable APIs

    Navigate to Navigation Menu (☰) -> APIs & Services -> Dashboard.

    Click "+ ENABLE APIS AND SERVICES".

    Search for and enable the following APIs one by one:

        - Cloud Build API
        - Cloud Run API
        - Artifact Registry API
        - Cloud SQL Admin API
        - Compute googleapi

## 1.3 Create Artifact Registry

    Navigate to Navigation Menu (☰) -> Artifact Registry -> Repositories.
    
    Click "+ CREATE REPOSITORY".

    Format: Select Docker.

    Name: book-app-repo

    Location: Select asia-south1.
    
    Click "CREATE".

# Step 2: Create PostgreSQL Database

## 2.1 Create Cloud SQL Instance

    Navigate to Navigation Menu (☰) -> Databases -> SQL.

    Click "+ CREATE INSTANCE".
    
    Choose PostgreSQL.
    
    Instance ID: book-db-instance

    Set password for the postgres user: Enter your-root-password (or a secure password you'll remember) ( [I+en7m(O";"Du"N ).

    Database version: Choose PostgreSQL 15 (or the latest version).
    
    Choose a region and zone: Select the asia-south1 region.
    
    Customize your instance (Show configuration options):
    
    Under Machine type, select db-f1-micro (1 shared vCPU, 0.6 GB RAM) for cost optimization.
    
    Click "CREATE INSTANCE". This may take a few minutes.

## 2.2 Create Database and User
    
    Once the instance (book-db-instance) is ready, click on its name to view details.
    
    Go to the Databases tab.
    
    Click "+ CREATE DATABASE".
    
    Database name: bookdb
    
    Click "CREATE".
    
    Go to the Users tab.

    Click "+ CREATE USER ACCOUNT".
    
    User name: bookuser

    Password: bookpass ( l+.-{e3adsh@J_/S ) ( IqeQSyp5%Ung}B@( )
    
    Click "CREATE".

## 2.3 Get Connection Details

    While on the Overview page for the book-db-instance, locate the Connection name field.

    The format is: project-id:region:instance-id.

    For this guide, it will be similar to: book-management-app:asia-south1:book-db-instance. Save this value for Step 4.

# Step 3: Service Account Setup

## 3.1 Create Service Account
    
    Navigate to Navigation Menu (☰) -> IAM & Admin -> Service Accounts.
    
    Click "+ CREATE SERVICE ACCOUNT".
    
    Service account name: github-actions
    
    Description: GitHub Actions Service Account

    Click "CREATE AND CONTINUE".

## 3.2 Grant Permissions
    
    In the Grant this service account access to project step:
    
    Click "+ ADD ANOTHER ROLE" and select the following roles one by one:

    Cloud Run Admin (roles/run.admin)
    
    Artifact Registry Writer (roles/artifactregistry.writer)
    
    Service Account User (roles/iam.serviceAccountUser)
    
    Cloud Runner Invoker ()
    
    Click "DONE".

## 3.3 Create Key and Download
        
    In the list of Service Accounts, click on the newly created github-actions account.

    Go to the Keys tab.
    
    Click "ADD KEY" -> "Create new key".
    
    Key type: Select JSON.  
    
    Click "CREATE". The key.json file will be downloaded to your computer. Save the content of this file for Step 4.

# Step 4: GitHub Repository Setup (Secrets)

    Access your GitHub repository's Settings -> Secrets and variables -> Actions.
    
    Click "New repository secret" for each of these and paste the corresponding value:

        Secret Name         |   Value
        --------------------|-----------------------------------------------------
        GCP_PROJECT_ID      |   book-management-app
        GCP_SA_KEY          |   book-management-474312-eea95f759ff9.json
        DB_CONNECTION_NAME  |   book-management-app:asia-south1:book-db-instance
        DB_PASSWORD         |   bookpass
        DB_NAME             |   bookdb
        DB_USER             |   bookuser
        REGION              |   asia-south1
        -------------------------------------------------------------------------

# Step 5: GitHub Actions Workflows

## 5.1 Backend Workflow & Dockerfile
    
    Create `.github/workflows/deploy-backend.yml`

## 5.2 Frontend Workflow & Dockerfile  
    
    Create `.github/workflows/deploy-frontend.yml`

# Step 6: Production Configuration

## 6.1 Update Backend application.properties

        spring.datasource.url=jdbc:postgresql:///${DB_NAME}
        spring.datasource.username=${DB_USER}
        spring.datasource.password=${DB_PASSWORD}
        spring.cloud.gcp.sql.instance-connection-name=${DB_CONNECTION_NAME}
        spring.cloud.gcp.sql.enabled=true


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