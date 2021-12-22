import sys
import os
import glob

args = sys.argv
lambda_name = args[1]

enviroment = {
    'MASTER_DATABASE_NAME': 'master',
    'MONGODB_ATLAS_CLUSTER_URI': 'mongodb+srv://pochecho:sifamek666@information.ekarf.mongodb.net'
}


def add_parameters(enviroment):
    parameters = []
    char = "\\\""
    for key in enviroment:
        piece = f"{char}{key}{char}:{char}{enviroment[key]}{char}"
        parameters.append(piece)
    return ",".join(parameters)


execution_file = list(glob.iglob(
    f'../output/{lambda_name}/**/index.js', recursive=True)).pop().replace("../", '').replace("\\", "/")
event_file = execution_file.replace(
    "index.js", 'event.json').replace(f"output/{lambda_name}/", "")
print(execution_file)
execution_command = f"cd .. && lambda-local -l {execution_file} -e {event_file} -t 5 -E {{{add_parameters(enviroment)}}}"


os.system(execution_command)
