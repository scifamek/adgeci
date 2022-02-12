import glob
import os

base_command = 'aws lambda update-function-code --function-name  {} --s3-bucket {}'
execution_files = list(map(lambda x: x.replace('\\', '/'),list(glob.iglob(f'../output/**/*.zip', recursive=True))))

def upload_lambda(path):
    name = path.split('/')[2]
    command = base_command.format(name, name)
    print(command)
    print()
    os.system(f'aws s3 --region us-east-1 cp {path} s3://adgeci-lambda-zip-bucket ')
    os.system(command)

for file in execution_files:
    upload_lambda(file)