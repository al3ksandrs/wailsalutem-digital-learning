# Working with Docker

This project utilizes Docker and Docker Compose to containerize the PostgreSQL database. This ensures consistency across development environments and simplifies the deployment process to the project's Virtual Private Server (VPS).

## Project Configuration

We utilize a specific configuration to manage security and data persistence across both local and production environments.

### Docker Secrets
To maintain security standards, credentials are not hardcoded into the `docker-compose.yml` file. We utilize Docker Secrets to manage sensitive information.

1.  **File Location:** Secrets are stored in the `server/secrets/` directory (e.g., `postgres_password.txt`, `postgres_user.txt`).
2.  **Mechanism:**
    *   Docker mounts these files into the container at `/run/secrets/`.
    *   The `docker-compose.yml` environment variables use the `_FILE` suffix (e.g., `POSTGRES_PASSWORD_FILE`). This instructs the PostgreSQL image to read the password from the mounted file rather than a plain text environment variable.

### Data Persistence and Initialization
*   **Named Volume (`pgdata`):** Mapped to `/var/lib/postgresql/data`. This ensures that database data persists even if the container is stopped or restarted.
*   **Initialization (`./init`):** Mapped to `/docker-entrypoint-initdb.d`. Any SQL scripts placed in the local `server/init/` directory will execute automatically **only** when the database is created for the first time.

---

## Local Development Environment

Follow these instructions to run the database on your local machine for development and testing.

### Basic Commands
Run these commands from the `server/` directory where `docker-compose.yml` is located.

**Builds and starts the containers in the background (detached mode):**
```
docker-compose up -d
```

**Stops and removes the containers:**
```
docker-compose down
```

**Stops containers and removes the database volume (resets all data):**
```
docker-compose down -v
```

**Follow the logs of the running containers (Ctrl+C to exit):**
```
docker-compose logs -f
```

**Lists currently running services and their status:**
```
docker-compose ps
```

### Manual Local Test Setup
1.  Navigate to the `server` directory.
2.  Ensure the `secrets/` folder contains the necessary `.txt` files with valid credentials.
3.  Start the container:
    ```
    docker-compose up -d
    ```
4.  **Verification:**
    *   The database will be accessible at `localhost:5432`.
    *   You may verify the connection using the provided script: `npm run test-db-connection`.
    *   Alternatively, use a database client (e.g., DBeaver) using the credentials found in your secrets files.

---

## VPS (Live Environment)

The production database runs on a Virtual Private Server (VPS). While the underlying Docker configuration is identical to the local version, the management workflow differs.

### VPS Deployment Overview
The `docker-compose.yml` and the `secrets/` folder are transferred to the VPS. The Docker engine on the VPS manages the live production database.

*   **File Transfer:** Updates to the configuration or secrets are uploaded via secure file transfer (e.g., WinSCP).
*   **Command Execution:** Docker commands are executed on the server via a SSH terminal session (e.g., PuTTY).

### Connecting to the Live Environment
When the application is running in the live environment, it connects to the Docker container internal to the VPS network.

**To verify the Live VPS status manually:**
1.  Connect to the VPS via SSH.
2.  Navigate to the project directory on the server.
3.  Ensure the postgres service is up by running:
    ```
    docker-compose ps
    ```
4.  If the service is down, restart it using:
    ```
    docker-compose up -d
    ```

> **Note:** Unlike the local environment, you should avoid using `docker-compose down -v`.

---

## Troubleshooting

### Port Conflicts
*   **Error:** `Bind for 0.0.0.0:5432 failed: port is already allocated`
*   **Solution:** This indicates a local PostgreSQL instance is already running on your machine. Stop the local service or modify the port mapping in `docker-compose.yml`.

### Initialization Scripts Not Running
*   **Cause:** Init scripts only execute on a fresh volume. Otherwise, they are skipped.
*   **Solution:** To re-run initialization scripts locally, you must clear the existing volume:
    ```
    docker-compose down -v
    docker-compose up -d
    ```