import json
import time
import boto3
import os
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
from botocore.vendored import requests

service = 'es'
region = 'us-east-1'

host = 'https://vpc-photos-izpznsdep6xaxblvpn3cghm6a4.us-east-1.es.amazonaws.com'
index = 'photo_index'

url = host + '/' + index + '/_search'
headers = {
    "Content-Type": "application/json",
}

def lambda_handler(event, context):
    # TODO implement
    logger.info("event:{}".format(event))
    userId = "wl2655"
    
    text = event['queryStringParameters']['q'] #get text input from lex
    logger.info("raw text:{}".format(text))
    if text in ["use_voice"]:
        logger.info("using voice!!!!!!!!!!!!!!!!!!!!11")
        text = use_voice()
    logger.info("text:{}".format(text))
    
    
    client = boto3.client('lex-runtime')
    response = client.post_text(
        botName='SearchBot',
        botAlias='SearchBot',
        sessionAttributes={
        },
        requestAttributes={
        },
        userId=userId,
        inputText=text
    )
    print(response)
    logger.info("response:{}".format(response))
            
            
    response_slots = response['slots'] #gives labels from lex 
    
    logger.info("slots:{}".format(response_slots))
    word_list = list()
    for key, value in response_slots.items():
        if value:
            word_list.append(value)
    word_list = set(word_list) #INPUT VAR for ES
    logger.info("word_list:{}".format(word_list))
    
    result = []
    for word in word_list:
        query = {
            "size": 5,
            "query": {
                "multi_match": {
                    "query": word,
                    "fields": ["labels"]
                }
            }
        }
        
        r = requests.get(url, headers=headers, data=json.dumps(query)).json()
        logger.info("r:{}".format(r))
        result += [item['_source']['objectKey'] for item in r['hits']['hits']]
        logger.info("result form elasticsearch:{}".format(result))
    result = list(set(result))
    res = {}
    for each_res in result:
        logger.info(each_res)    
        res[each_res] = 'https://nyu-cc-photo-album-photo.s3.amazonaws.com/' + each_res
    
    logger.info("res:{}".format(res))
    
    return {
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin' : '*', 
        },
        'body': json.dumps(res)
    }

def use_voice():
    transcribe = boto3.client('transcribe')
    job_name = str(time.time())
    job_uri = "https://nyu-cc-photo-album-photo.s3.amazonaws.com/undefined1.wav"
    transcribe.start_transcription_job(
        TranscriptionJobName=job_name,
        Media={'MediaFileUri': job_uri},
        MediaFormat='wav',
        LanguageCode='en-US'
    )
    logger.info("voice uploaded")
    while True:
        status = transcribe.get_transcription_job(TranscriptionJobName=job_name)
        logger.info(status['TranscriptionJob']['TranscriptionJobStatus'])
        if status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
            break

    logger.info("status:{}".format(status))
    if status['TranscriptionJob']['TranscriptionJobStatus'] in ['FAILED']:
            response = transcribe.delete_transcription_job(TranscriptionJobName=job_name)
            raise Exception("failed")
    else:
        url = status['TranscriptionJob']['Transcript']['TranscriptFileUri']
        logger.info("transcribe url:{}".format(url))
        r = requests.get(url)
        res = r.json()
        logger.info("json file:{}".format(res))
        txt = res['results']['transcripts'][0]['transcript']
        logger.info("translated txt:{}".format(txt))
        response = transcribe.delete_transcription_job(TranscriptionJobName=job_name)
        logger.info("cleaned up")
    
    return txt
