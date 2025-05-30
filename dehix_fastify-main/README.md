# Dehix Fastify Backend

## Introduction

**Dehix Fastify Backend** is a high-performance, scalable backend service built using **Fastify**, a fast and lightweight Node.js framework. The project is designed to deliver RESTful APIs for managing application functionalities while ensuring speed, reliability, and low overhead.

This backend is integrated with **AWS Elastic Beanstalk** for seamless deployment and uses modern development practices like continuous integration and continuous deployment (CI/CD). The architecture is built to support dynamic scaling, ensuring performance under varying loads.

---

## Features

- **Fast and Lightweight APIs**: Built with Fastify, optimized for speed.
- **Scalable Infrastructure**: Deployed on AWS Elastic Beanstalk with S3 for artifact storage.
- **Efficient CI/CD Pipeline**: Automated build, artifact generation, and deployment using GitHub Actions.
- **Environment-Specific Configurations**: Supports dev, staging, and production environments.

---

## API Overview

### Base URL

The base URL for the APIs depends on the deployment environment:

- **Development**: `http://localhost:3000`
- **Staging**: `https://devapi.dehix.org`
- **Production**: `https://api.dehix.org`

---

## Development Setup

To set up the development environment for the Dehix Fastify Backend:

1. Clone the repository:

   ```bash
   git clone https://github.com/dehixorg/dehix-fastify.git
   cd dehix-fastify
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. The server will start on `http://localhost:3000` by default.

---

## Build and Deployment

### CI/CD Pipeline

The CI/CD pipeline automates the build and deployment process. It is defined in `.github/workflows/deploy.yaml`.

### Pipeline Flow

1. **Trigger**: The pipeline is triggered by push events on the `develop` branch.
2. **Build Steps**:
   - **Checkout Code**: Pulls the latest code from the repository.
   - **Install Node.js and Python**: Sets up the runtime environment for the build process.
   - **Install Dependencies**: Runs `npm install` to resolve dependencies.
   - **Build Script**: Executes `scripts/build.py` to prepare a deployable ZIP file.
   - **Run Development Server** (optional): Installs and starts the development server (`npm run dev`) for testing purposes.
3. **Deployment Steps**:
   - **AWS Credentials**: Configures AWS access using GitHub secrets.
   - **Upload to S3**: Uploads the ZIP file to the S3 bucket (`beanstalk-fastify-builds`).
   - **Elastic Beanstalk**:
     - Creates a new application version.
     - Updates the environment with the new version.

### Configuration Details

- **AWS Secrets**:

  - `AWS_ACCESS_KEY`: AWS Access Key ID.
  - `AWS_SECRET_KEY`: AWS Secret Access Key.
  - `AWS_REGION`: AWS Region (e.g., `ap-south-1`).
  - `FIREBASE_DEV_JSON`: Firebase json.

- **Elastic Beanstalk**:

  - Application Name: `dehix-fastify`
  - Environment Name: `dehix-fastify-env`

- **S3 Bucket**:
  - Bucket Name: `beanstalk-fastify-builds`

---

## Build Script

The `scripts/build.py` script prepares the deployment package:

- Installs production dependencies (`npm install`).
- Builds the project using `npm run build`.
- Copies necessary configuration files to the build directory.
- Creates a ZIP file for deployment.
- Cleans up temporary files.
