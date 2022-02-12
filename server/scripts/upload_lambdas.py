import glob
import os
bucket = 'adgeci-lambda-zip-bucket'
base_command = 'aws lambda update-function-code --function-name  {} --s3-bucket s3://{}/{}.zip'
execution_files = list(map(lambda x: x.replace('\\', '/'),list(glob.iglob(f'../output/**/*.zip', recursive=True))))

def upload_lambda(path):
    name = path.split('/')[2]
    command = base_command.format(name,bucket, name)
    print(command)
    print()
    os.system(f'aws s3 --region us-east-1 cp {path} s3://{bucket}')
    os.system(command)

for file in execution_files:
    upload_lambda(file)