import json
import logging
import boto3
import sys
from botocore.vendored import requests


service = 'es'
credentials = boto3.Session().get_credentials()
region = 'us-east-1'
host = 'https://vpc-photos-izpznsdep6xaxblvpn3cghm6a4.us-east-1.es.amazonaws.com'
index = 'photo_index'
type = 'Photo'
url = host + '/' + index + '/' + type + '/'
headers = { "Content-Type": "application/json" }

def lambda_handler(event, context):
    # TODO implement
    bucket_name,image_key,event_time = get_info(event)

    img_idx = {'S3Object': {'Bucket': bucket_name, 'Name': image_key}} #input for rekognition json format

    img_labels = get_label(img_idx) #list of labels
    
    img_json = make_json(bucket_name,image_key,event_time,img_labels) #json to upload to ES
    
    r = requests.post(url, json=img_json, headers=headers)

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


def get_info(event):
    record = event['Records'][-1]
    bucket_name = record['s3']['bucket']['name']
    image_key = record['s3']['object']['key'].replace('+', ' ')
    event_time = record['eventTime']
    return bucket_name,image_key,event_time


def get_label(img_idx):
    print('Start labeling')
    rekog_client = boto3.client('rekognition')
    print('Start rekognition')
    rekog_response = rekog_client.detect_labels(Image = img_idx, MaxLabels=100, MinConfidence=50)
    print('Here...1')
    labels = rekog_response['Labels']
    img_labels = []
    for label in labels:
        img_labels.append(label["Name"])
    print('Here...2')
    return img_labels

def make_json(bucket_name,image_key,event_time,img_labels):
    json = {
        "objectKey": image_key,
        "bucket": bucket_name,
        "createdTimestamp": event_time,
        "labels": img_labels
    }
    return json

