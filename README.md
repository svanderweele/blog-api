# Blogging API

## Overview

This project is a robust Blogging API built to deliver high performance and reliability. It includes a wide range of features, from authentication and authorization to caching and API versioning.

## Features

- **Error Handling:** We have implemented robust error handling to avoid unexpected responses.
- **Code Quality Checks:** We use Husky to ensure our code meets quality standards and that our unit tests are functioning as expected.
- **Unit Tests:** These ensure that all functionalities are covered and working as expected.
- **Github Actions:** This helps us enforce code style and ensure that tests are working.
- **Authentication:** User authentication is a key feature of our API.
- **Authorization:** We have implemented authorization to restrict access to certain endpoints based on user permissions.
- **Caching Layer:** We use both in-memory and Redis for caching, with functionality for cache busting.
- **API Versioning:** Our API supports versioning (e.g., /v1/blogs).
- **Health Checks:** We actively monitor the health of our API.
- **Logging System:** We have integrated our API with the ELK stack for efficient logging.

## TODO

We have several enhancements in the pipeline:

- Integrate with Grafana
- Improve documentation (https://docs.nestjs.com/recipes/documentation)
- Add Swagger Docs
- Swap to using MongoDB with custom queries
- Learn more about database performance
- Deploy via Serverless
    - Lambda
    - PostgresDB (DocumentDB)
    - SecretManager

We welcome any contributions and feedback. Please feel free to reach out or open an issue. Thank you!
