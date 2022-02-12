import glob
import os

base_command = 'aws lambda update-function-code --function-name  {} --zip-file {}'
execution_files = list(map(lambda x: x.replace('\\', '/'),list(glob.iglob(f'../output/**/*.zip', recursive=True))))

def upload_lambda(path):
    name = path.split('/')[2]
    command = base_command.format(name, path)
    print(command)
    print()
    os.system(command)

for file in execution_files:
    upload_lambda(file)