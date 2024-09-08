#!/usr/bin/env bash

aws configure set aws_access_key_id $BASIN_ACCESS_KEY --profile basin
aws configure set aws_secret_access_key $BASIN_SECRET_KEY --profile basin
aws configure set region us-east-1 --profile basin
aws configure set s3.endpoint_url http://127.0.0.1:8014 --profile basin
aws s3 mb s3://encrypted --profile basin