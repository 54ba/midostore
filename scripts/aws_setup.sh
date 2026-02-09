#!/bin/bash
# aws_setup.sh - Setup midostore on Amazon Linux 2023

echo "--- 1. Updating System Packages ---"
sudo yum update -y

echo "--- 2. Installing Docker ---"
sudo yum install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

echo "--- 3. Configuring 2GB Swap file ---"
# Create a 2GB swap file to help with build process (Memory limit workaround)
sudo dd if=/dev/zero of=/swapfile bs=128M count=16
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab

echo "--- Setup Complete! ---"
echo "Please LOG OUT and LOG IN again to apply docker group changes."
