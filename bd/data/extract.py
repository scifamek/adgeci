import pandas as pd
import pprint
import json
import uuid
import copy
import re
final_row = 55000
final_column = "A:J"

chunk = 0
size_page = 35

KEYWORD = 'DIA '

pages_to_compute = 5

max_limit = final_row



df = pd.read_excel (r'droopy.xlsx',sheet_name='HISTORIAS CLINICAS',header=None,usecols= final_column,nrows = final_row)
representation = df.to_dict()

def split_name(full_name):
    chunks = full_name.split(' ')
    formatted_chunks = []
    for chunk in chunks:
        formatted_chunks.append(chunk.capitalize())

    response = {
        'first_name' : '',
        'second_name' : '',
        'first_last_name' : '',
        'second_last_name' : ''
    }

    if(len(formatted_chunks) == 1):
        response['first_name']  = formatted_chunks[0]
    elif(len(formatted_chunks) == 2):
        response['first_name']  = formatted_chunks[0]
        response['first_last_name']  = formatted_chunks[1]
    elif(len(formatted_chunks) == 3):
        response['first_name']  = formatted_chunks[0]
        response['second_name']  = formatted_chunks[1]
        response['first_last_name']  = formatted_chunks[2]
    elif(len(formatted_chunks) == 4):
        response['first_name']  = formatted_chunks[0]
        response['second_name']  = formatted_chunks[1]
        response['first_last_name']  = formatted_chunks[2]
        response['second_last_name']  = formatted_chunks[3]
    return response

def normalize(value):
    try:
        return value.capitalize().replace('\u00d1','ñ')
    except:
        return value

def split_age(age):
    chunks = age.split(' ')
    formatted_chunks = []
    for chunk in chunks:
        formatted_chunks.append(chunk.capitalize())

    response = {
        'age' : '',
        'unit_age' : ''
    }

    if(len(formatted_chunks) == 1):
        response['age']  = formatted_chunks[0]
    elif(len(formatted_chunks) == 2):
        response['age']  = formatted_chunks[0]
        response['unit_age']  = formatted_chunks[1]
    return response

def split_date(age:str):
    chunks = age.split('.')
    pattern = r'^([a-zA-Z ]{1,11})([7\/\.\- ]{1,2}([TtOo0-9]{1,2})){0,1}[7\/\.\- ]{1,2}([TtOo0-9]{4,5})'
    response = re.match(pattern,age)
    if(response):
        groups = list(response.groups())
        mistakes = [
            {
                'prev': ' ',
                'after':''
            },
            {
                'prev': 'Noviembe',
                'after':'Noviembre'
            },
            {
                'prev': 'Dic',
                'after':'Diciembre'
            },
            {
                'prev': 'Diciembreiembre',
                'after':'Diciembre'
            },
            {
                'prev': 'Sept',
                'after':'Septiembre'
            },
            {
                'prev': 'Septiembreiembre',
                'after':'Septiembre'
            },
            {
                'prev': 'Septiembreimebre',
                'after':'Septiembre'
            },
            {
                'prev': 'Septiembreembre',
                'after':'Septiembre'
            },
            {
                'prev': 'Nov',
                'after':'Noviembre'
            },
            {
                'prev': 'Noviembreiembre',
                'after':'Noviembre'
            },
            {
                'prev': 'Septimebre',
                'after':'Septiembre'
            },
            {
                'prev': 'Abri',
                'after':'Abril'
            },
            {
                'prev': 'Abrill',
                'after':'Abril'
            },
            {
                'prev': 'Noviembe',
                'after':'Noviembre'
            }

        ]
        for i in mistakes:
            groups[0] = groups[0].replace(i['prev'],i['after'])
            groups[0] = groups[0].replace(i['prev'].capitalize(),i['after'].capitalize()).capitalize()
            groups[0] = groups[0].replace(i['prev'].upper(),i['after'].capitalize()).capitalize()
        # groups[0] = groups[0].capitalize().replace(' ','').replace('Noviembe','Noviembre').replace('Dic','Diciembre').replace('Diciembreiembre','Diciembre').replace('Sept','Septiembre').replace('Septiembreiembre','Septiembre').replace('Septiembreimebre','Septiembre').replace('Septiembreembre','Septiembre').replace('Nov','Noviembre').replace('Noviembreiembre','Noviembre').replace('Septimebre','Septiembre')
        if(groups[2] != None):
            groups[2] = groups[2].replace('t','').replace('o','').replace('T','').replace('O','')
        else:
            groups[2]  = 1
        groups[3] = groups[3].replace('t','').replace('o','').replace('T','').replace('O','')


        MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
        try:
            # print(groups)
            response = {
                'month' : MONTHS.index(groups[0].capitalize())+1,
                'day' :   int(groups[2]) ,
                'year' : int(groups[3])
            }
        except:
            print(groups)

    # print('-_- ',response)
    return response

def split_race(race):
    chunks = race.split('-')
    formatted_chunks = []
    for chunk in chunks:
        formatted_chunks.append(chunk.capitalize())

    response = {
        'race' : '',
        'gender' : ''
    }

    if(len(formatted_chunks) == 1):
        response['race']  = formatted_chunks[0]
    elif(len(formatted_chunks) == 2):
        response['race']  = formatted_chunks[0]
        response['gender']  = formatted_chunks[1]
    return response

def split_several(value):
    chunks = value.split('-')
    if(chunks == None):
        if(value == 'None'):
            return []
        return value
    return chunks
def get_value(row,column,representation,ttl=2):
    if(ttl > 0):
        column_data = representation[column]
        data = column_data[row]
        if(str(data) == 'nan'):
            step_1 = get_value(row-1,column,representation,ttl-1)
            if(str(step_1) != 'nan' and str(step_1) != 'None'):
                return normalize(step_1)
            else:
                step_2 = get_value(row+1,column,representation,ttl-1)
                if(str(step_2) != 'nan' and str(step_2) != 'None'):
                    return normalize(step_2)
        else:
            return normalize(data)

def generate_uuid():
    uuidOne = uuid.uuid1()
    uuidOne = str(uuidOne).replace('-','')
    uuidOne = uuidOne[:24]
    return uuidOne

def add_uuid(obj):
    pet = {}
    tutor = {}
    appointment = {}

    pet_id = generate_uuid()
    tutor_id = generate_uuid()

    tutor['properties'] = obj['tutor']
    pet['properties'] = obj['pet']
    appointment['properties'] = obj['appointment']
    appointment['properties']['pet_id'] = pet_id

    tutor['properties']['pets_id'] = [pet_id]
    tutor['_id'] = {'$oid': tutor_id}

    pet['properties']['tutors_id'] = [tutor_id]
    pet['_id'] = {'$oid': pet_id}

    obj['pet'] = pet
    obj['tutor'] = tutor
    obj['appointment'] = appointment

def get_dates(row, col, rep):
    mark = ''
    response = []
    i = row+1
    mark = rep[col][i]

    while(str(mark) != 'nan'):
        response.append(
            {
                'date': split_date(rep[col][i]),
                'medicine': rep[col+2][i]
            }
        )
        # print(mark,type(mark))
        i+=1
        mark = rep[col][i]
    return response

mask = {
    'day':{
        'row':0,
        'column':1,
        'type' : int,
        'collection': 'appointment'
    },
    'month':{
        'row':0,
        'column':3,
        'type' : str,
        'collection': 'appointment'
    },
    'year':{
        'row':0,
        'column':5,
        'type' : int,
        'collection': 'appointment'
    },
    'code':{
        'row':0,
        'column':9,
        'type' : int,
        'collection': 'appointment'
    },
    'name':{
        'row':2,
        'column': 1,
        'type' : str,
        'collection': 'pet'
    },
    'species':{
        'row':2,
        'column': 4,
        'type' : str,
        'collection': 'pet'
    },
    'race':{
        'row':2,
        'column': 7,
        'type' : str,
        'collection': 'pet',
        'function': split_race
    },
    'full_name':{
        'row':4,
        'column': 2,
        'type' : str,
        'collection': 'tutor',
        'function': split_name
    },
    'age':{
        'row':4,
        'column': 7,
        'type' : str,
        'collection': 'pet',
        'function': split_age
    },
    'address':{
        'row':6,
        'column': 2,
        'type' : str,
        'collection': 'tutor'
    },
    'phones':{
        'row':6,
        'column': 7,
        'type' : str,
        'collection': 'tutor',
        'function': split_several
    },
    'zate':{
        'row':9,
        'column': 0,
        'type' : str,
        'collection': '',
        'break': True
    }
}

COLUMN_KEY = representation[0]
index_row = 0


appointments_results = []
pets_results = []
tutors_results = []
map_results = {
    'appointment': appointments_results,
    'pet': pets_results,
    'tutor': tutors_results
}
result = []
for r in COLUMN_KEY:
    if(index_row < max_limit):
        if(COLUMN_KEY[r] == KEYWORD):
            info = {}
            for attribute in mask:
                element = mask[attribute]
                column = element['column']
                row = index_row+element['row']
                value = str(get_value(row,column,representation))
                if( not 'break' in element):
    
                    if( 'collection' in element and  not element['collection'] in info):
                        info[element['collection']] = {}

                    
                    try:
                        formatted_value = mask[attribute]['type'](value)
                        if('function' in element):
                            formatted_value = element['function'](value) 
                        
                        if(type(formatted_value) == dict):
                            for entry in formatted_value:
                                info[element['collection']][entry] = formatted_value[entry]
                        else:
                            info[element['collection']][attribute] = formatted_value
                    except:
                        info[element['collection']][attribute] = value
                else:
                    date = None
                    line = row
                    column = 0
                    info['appointment']['dates'] = []
                    
                    info['appointment']['dates'] = get_dates(index_row+8,0,representation)
            
            temp = None
            add_uuid(info)

            dates = get_dates(index_row+8,0,representation)
            p = info['appointment']['properties']['pet_id']
            for app in info['appointment']['properties']['dates']:
                if app['date'] != 'None':
                    temp = copy.deepcopy(info)
                    date = (app['date'])
                    print(type(app['medicine']),app['medicine'])
                    if(date != None):
                        temp['appointment']['properties'] = date
                        temp['appointment']['properties']['medicines'] = [] if type(app['medicine']) == float else [app['medicine'].strip()] 
                        temp['appointment']['properties']['pet_id'] = {'$oid':p}
                        temp['appointment']['properties']['appointment_type_id'] = {'$oid': 'f59758c04b1411eba63e70c9'}
                        map_results['appointment'].append(temp['appointment'])
                        info = temp
            del info['appointment']
            for key in info:
                map_results[key].append(info[key])
            result.append(info)
    else:
        break
    index_row+=1
for key in map_results:
    with open('droopy_5e98666701c17a0da56325ec/'+key+'s.json','w+') as target:
        target.write(json.dumps(map_results[key],indent=2))

with open('droopy.json','w+',encoding='utf-8') as target:
    target.write(json.dumps(result,indent=2))
# for page in range(pages_to_compute):
#     current_index = page*size_page
#     print('page',page,current_index)
#     for attribute in mask:
#         element = mask[attribute]
#         column = element['column']
#         row = current_index+element['row']
#         value = get_value(row,column,representation)
#         print('\t',attribute,value,type(value))
#SDGrjv&FyK*lee
