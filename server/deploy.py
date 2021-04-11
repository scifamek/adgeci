import os
import json
from zipfile import ZipFile

LAMBDA_CORE_PATH = 'app/lambdas_core'
LAMBDA_TEMPLATES_PATH = 'app/lambdas_templates'
LAMBDA_REPOSITORIES_PATH = 'app/lambdas_repositories'
LAMBDA_PATH = 'app/lambdas'

CONFIG_PATH = 'config.json'

CORE_FUNCTION_PATTERN = 'CORE_FUNCTION'
REPOSITORIES_PATTERN = 'REPOSITORIES'
SIGNATURE_PATTERN = 'SIGNATURE'

with open(CONFIG_PATH) as file:
    CONFIG_OBJECT = json.load(file)

def list_lambda_functions():
    files = os.listdir(LAMBDA_CORE_PATH)
    return files

def create_lambda_body(lambda_name):
    index_file = '{}/{}/index.js'.format(LAMBDA_CORE_PATH,lambda_name)
    if os.path.isfile(index_file):
        with open(index_file,'r') as file:
            index_content = file.read()
        template = CONFIG_OBJECT[lambda_name]['template']
        repositories = []
        repositoriesFull = []
        enviroment = ''
        for type_repository in CONFIG_OBJECT[lambda_name]['repositories']:
            for repo in CONFIG_OBJECT[lambda_name]['repositories'][type_repository]:
                enviroment += get_single_name(type_repository+'/'+repo) + ','
                repositories.append(repo)
                repositoriesFull.append(type_repository+'/'+repo)
        
        repositoriesContent = copy_repositories(repositoriesFull,lambda_name)

        content_aws = ''
        with open('{}/{}.js'.format(LAMBDA_TEMPLATES_PATH,template),'r') as file:
            content = file.read()
            content = content.replace('<<{}>>'.format(CORE_FUNCTION_PATTERN),index_content)
            content = content.replace('<<{}>>'.format(SIGNATURE_PATTERN),enviroment)

            imports = ''
            for repo in repositoriesFull:
                imports += generate_import(repo)+'\n'
            
            content_aws = content.replace('<<{}>>'.format(REPOSITORIES_PATTERN),imports)
            



        new_path_dir = '{}/{}'.format(LAMBDA_PATH,lambda_name)
        new_path_dir_aws = '{}/{}'.format(new_path_dir,'aws')

        os.makedirs(new_path_dir,0o777,True)
        os.makedirs(new_path_dir_aws,0o777,True)

        with open('{}/index.js'.format(new_path_dir_aws),'w') as file:
            file.write(content_aws)

        content = content.replace('<<{}>>'.format(REPOSITORIES_PATTERN),repositoriesContent)

        with open('{}/index.js'.format(new_path_dir),'w') as file:
            file.write(content)

def get_single_name(name):
    prefix = '$' if 'master' in name else '';

    fragments: list = name.split('/')
    last = fragments.pop()
    last = last.replace('.js','')
    nameParts: list = last.split('_')

    response = nameParts[0]
    for i in range(1,len(nameParts)):
        item:str = nameParts[i]
        response+= item.capitalize()
    return prefix+response
        



def generate_import(repository):
    importStatement = 'var {} = require(\'{}\');'.format(get_single_name(repository),repository)
    return importStatement

def generate_code(repository):
    importStatement = 'var {} = require(\'{}\');'.format(get_single_name(repository),repository)
    return importStatement

def copy_repositories(repositories,path):
    response = ''
    for p in repositories:

        with open('{}/{}'.format(LAMBDA_REPOSITORIES_PATH,p),'r') as file:
            ROUTE = '{}/{}/aws/{}'.format(LAMBDA_PATH,path,p)
            ROUTE_DIR = '/'.join(ROUTE.split('/')[:len(ROUTE.split('/'))-1])
            os.makedirs(ROUTE_DIR,0o777,True)

            with open(ROUTE,'w') as file2:
                content = file.read()
                file2.write(content)
                response += content.replace('\"use strict\"','').replace('var ObjectId = require(\"mongodb\").ObjectId;','').replace('module.exports','const '+get_single_name(p)) + '\n'
    return response
def build_functions():
    functions = list_lambda_functions()
    for function in functions:
        print(function)
        create_lambda_body(function)

def pack_functions():
    functions = list_lambda_functions()
    index_temp = 'index.js'
    for function in functions:
        with ZipFile('{}/{}/{}.zip'.format(LAMBDA_PATH,function,function), 'w') as z:
            index_file = '{}/{}/aws/index.js'.format(LAMBDA_PATH,function)
            with open(index_file) as file:
                with open(index_temp,'w') as temp:
                    temp.write(file.read())
                z.write(index_temp)
                add_node_modules(z,'./node_modules')
                for type_repository in CONFIG_OBJECT[function]['repositories']:
                    for repo in CONFIG_OBJECT[function]['repositories'][type_repository]:
                        ROUTE = type_repository+'/'+repo
                        ROUTE_DIR = '/'.join(ROUTE.split('/')[:len(ROUTE.split('/'))-1])

                        ROUTE_TO_MOVE = '{}/{}/aws/{}'.format(LAMBDA_PATH,function,ROUTE)
                        os.makedirs(ROUTE_DIR,0o777,True)

                        with open(ROUTE_TO_MOVE) as file:
                            with open(ROUTE,'w') as target:
                                target.write(file.read())

                        add_node_modules(z,ROUTE)


    os.remove(index_temp)

def add_node_modules(z,path):
    try:
        files = os.listdir(path)
        for file in files:
            new_path = '{}/{}'.format(path,file)
            if (os.path.isfile(path)):
                z.write(new_path)
            else:
                add_node_modules(z,new_path)
    except:
        z.write(path)

build_functions()
pack_functions()