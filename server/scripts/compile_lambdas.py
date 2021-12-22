import glob
import os
import sys

microservices_folder = '../microservices'
lambdas_folder = 'usecases'

index_template = """
exports.handler = async (event, context, callback) => {
context.callbackWaitsForEmptyEventLoop = false;
if (atlas_connection_uri == null) {
atlas_connection_uri = URI;
}
const response = await processEvent(event, context, callback);
callback(null, response);
};
"""
def normalize(x): return x.replace('\\', '/')

microservices = list(map(normalize, glob.iglob(f"{microservices_folder}/*")))


for microservice in microservices:
    path = f"{microservice}/*"
    lambdas_path = list(map(normalize, list(glob.iglob(path))))
    for lambda_path in lambdas_path:
        tsconfig_path = f"tsconfig.json"
        if(os.path.isfile(f'{lambda_path}/{tsconfig_path}')):
            command = f'cd {lambda_path} && npx tsc -p {tsconfig_path}'
            print(command)
            os.system(command)
