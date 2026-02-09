# Deploying midostore to AWS EC2 (Free Tier)

This guide covers deploying the application to an AWS EC2 instance (t2.micro/t3.micro).

## Prerequisites

- AWS Account.
- AWS CLI configured (optional but helpful).
- SSH key pair.

## 1. Launch EC2 Instance

1. Go to the **EC2 Dashboard** and click **Launch Instance**.
2. **Name**: `midostore-server`.
3. **AMI**: `Amazon Linux 2023`.
4. **Instance Type**: `t2.micro` or `t3.micro` (Free Tier Eligible).
5. **Key pair**: Select your existing key or create a new one.
6. **Network Settings**: Create a security group.
    - Allow SSH (Port 22).
    - Allow Custom TCP (Port 3000) for the application.

## 2. Connect and Setup

SSH into your instance:

```bash
ssh -i "your-key.pem" ec2-user@[EC2_PUBLIC_IP]
```

Run the setup script:

```bash
# Clone the repository (or upload the script)
curl -O https://raw.githubusercontent.com/54ba/midostore/main/scripts/aws_setup.sh
chmod +x aws_setup.sh
./aws_setup.sh

# Log out and log back in
exit
```

## 3. Deploy the Application

1. Clone the repo:

    ```bash
    git clone https://github.com/54ba/midostore.git
    cd midostore
    ```

2. Create `.env` file with your database URLs:

    ```bash
    nano .env
    # Add DATABASE_URL, MONGODB_URI, etc.
    ```

3. Build and Run:

    ```bash
    docker build -t midostore .
    docker run -d -p 3000:3000 --env-file .env midostore
    ```

## 4. Verify

Visit `http://[EC2_PUBLIC_IP]:3000` in your browser.
