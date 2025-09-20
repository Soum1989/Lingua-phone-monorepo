#!/bin/bash

echo "Checking Google Cloud authentication status..."
echo

echo "Running: gcloud auth list"
gcloud auth list
echo

echo "Running: gcloud config list"
gcloud config list
echo

echo "If you see your account listed above and a project configured, you're authenticated."
echo "If not, please run 'gcloud auth login' to authenticate."
