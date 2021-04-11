import os

name_project = 'adgeci'
user = 'pochecho'
password = 'sifamek666'
host = 'information.ekarf.mongodb.net'
db = 'master_configuration'
current_path = os.getcwd()

databases = os.listdir('../data')
for database in databases:
    if (os.path.isdir('../data/{}'.format(database))):
        files = os.listdir('../data/{}'.format(database))
        for file in files:
            col = file.split('.')[0]
            command = 'mongoimport --uri "mongodb+srv://{}:{}@{}/{}" --collection  {} --drop --jsonArray --file ..\\data\\{}\\{}'.format(user,password,host,database,col,database,file)
            print()
            print(command)
            print()
            os.system(command)