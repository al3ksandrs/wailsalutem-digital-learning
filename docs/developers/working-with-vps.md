# Working with VPS

This document outlines the procedures for connecting to, managing, and deploying updates to the Virtual Private Server (VPS) hosting the production environment.

## Prerequisites

Before attempting to access the server, ensure you have the following credentials and software installed:

*   **Server IP Address:** Provided by the hosting provider.
*   **SSH Credentials:** Username (typically `root` or a specific user) and Password (or Private Key file).
*   **Required Software:**
    *   **PuTTY:** For SSH terminal access (command line execution).
    *   **WinSCP:** For SFTP file transfer (uploading configuration files and secrets).

---

## 1. Connecting via SSH (PuTTY)

PuTTY is used to execute commands directly on the server.

1.  Open PuTTY.
2.  In the **Host Name (or IP address)** field, enter the server IP address: `<SERVER_IP_ADDRESS>`.
3.  Ensure the **Port** is set to `22` and **Connection type** is `SSH`.
4.  Click **Open**.
5.  A terminal window will appear prompting for **login as:**. Enter the username (e.g., `root`).
6.  Enter the password when prompted.
    *   *Note: The cursor will not move while typing the password for security reasons.*

### Common Server Commands

**List all files in the current directory:**
```
ls -la
```

**Change directory:**
```
cd <directory_name>
```

**Check running Docker containers:**
```
docker-compose ps
```

---

## 2. File Transfer (WinSCP)

WinSCP is used to upload updated configuration files, secrets, or initialization scripts from your local machine to the VPS.

1.  Open WinSCP.
2.  In the **Login** dialog:
    *   **File Protocol:** SFTP
    *   **Host name:** `<SERVER_IP_ADDRESS>`
    *   **User name:** `<USERNAME>`
    *   **Password:** `<PASSWORD>`
3.  Click **Login**.
4.  The interface is split into two panels:
    *   **Left Panel:** Your local machine files.
    *   **Right Panel:** The remote server files.
5.  Navigate to the project folder on the right panel (e.g., `/home/project-name/server`).
6.  Drag and drop files from left to right to upload/overwrite them.

### Critical Files to Manage
*   `docker-compose.yml`: Upload this whenever the container configuration changes (e.g., changing image versions or ports).
*   `secrets/`: Ensure the `.txt` files in this folder on the server match the required credentials.

---

## 3. Deployment Workflow

When moving changes from development to production, follow this specific workflow to ensure data integrity.

### Step 1: Update Configuration
If you have modified `docker-compose.yml` locally, use WinSCP to upload the new file to the server, overwriting the existing one.

### Step 2: Update Secrets (If applicable)
If database credentials have changed, update the text files in the `secrets/` directory via WinSCP.

### Step 3: Apply Changes
1.  Open PuTTY and log in.
2.  Navigate to the project directory:
    ```
    cd /path/to/your/project/server
    ```
3.  Restart the Docker containers to apply changes:
    ```
    docker-compose up -d
    ```

Docker will detect the configuration change and recreate only the necessary containers. Data in the volume will be preserved.

---

## 4. Maintenance and Troubleshooting

### Verifying Service Status
To check if the production database is running correctly:
```
docker-compose ps
```
The **State** should be `Up`. If the State is `Exit` or `Restarting`, view the logs to diagnose the issue:
```
docker-compose logs --tail=100
```

### Data Safety Warning
> **Do not execute the following command on the VPS:**
>
> ```
> docker-compose down -v
> ```
>
> *   The `-v` flag deletes the persistent volume (`pgdata`).
> *   Running this on production will result in **permanent data loss**.
> *   To stop the server safely without deleting data, use `docker-compose down`.

### Connection Issues
If the application cannot connect to the VPS database:

1.  Verify the container is running using:
    ```
    docker ps
    ```
2.  Ensure the server firewall (e.g., UFW) allows traffic on the designated port (default `5432`).
3.  Check that the secrets files on the server contain the correct credentials and do not contain hidden whitespace or newline characters.