
import glob
import os
import re
microservices_folder = '../../server/microservices'
lambdas_folder = 'usecases'
MASTER_DATABASE_NAME = 'master'
MONGODB_ATLAS_CLUSTER_URI = 'mongodb+srv://pochecho:sifamek666@information.ekarf.mongodb.net'

lambda_role = "arn:aws:iam::786484964598:role/service-role/getModulesByEnterprise-role-55fbdt4f"

DOC_PATTERN = '\/\*\*([ a-zA-Z0-9\*\n\t\.]+)\*\/'
BODY_LAMBDA = '{return {"statusCode":200,"body":JSON.stringify(event)};}'
CLOUDFORMATION_TEMAPLATE = """
AWSTemplateFormatVersion: '2010-09-09'
Description: Deploy all infrasestructure.
Resources:
"""
lambda_template = """
  {}LF:
    Type: AWS::Lambda::Function
    Properties:
      FunctionName: {}
      Runtime: nodejs12.x
      Environment:
        Variables:
          MASTER_DATABASE_NAME	: {}
          MONGODB_ATLAS_CLUSTER_URI: {}
      Role: {}
      Handler: index.handler
      Code:
        ZipFile: |
          exports.handler = (event, context) => {}
      Description: {}
      TracingConfig:
        Mode: Active
"""


def normalize(x): return x.replace('\\', '/')
def get_name(x): return x.split('/').pop()
def format_name(x): return x.replace('-', '_').upper() +'_'


microservices = list(map(normalize, glob.iglob(f"{microservices_folder}/*")))


def get_description(path):
    if(os.path.isfile(path)):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        description = re.findall(DOC_PATTERN, content)
        if(len(description) > 0):
            description = description[0].replace('\n', '').replace(' * ', '')
            return description
    return ''


cloudformation_file = ''
for microservice in microservices:
    path = f"{microservice}/*"
    lambdas_path = list(map(normalize, list(glob.iglob(path))))
    for lambda_path in lambdas_path:
        lambda_name = get_name(lambda_path)
        index = f"{lambda_path}/index.ts"
        description = get_description(index)
        if(description != ''):
            lambda_body = lambda_template.format(
                format_name(lambda_name),
                lambda_name, MASTER_DATABASE_NAME, MONGODB_ATLAS_CLUSTER_URI, lambda_role, BODY_LAMBDA, description)
            cloudformation_file += lambda_body + '\n'

with open('../infrastructure.yaml', 'w', encoding='utf-8') as f:
    f.write(f"{CLOUDFORMATION_TEMAPLATE}{cloudformation_file}")
