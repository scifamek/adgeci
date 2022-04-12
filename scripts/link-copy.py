import argparse
from os import system, rmdir, remove, path
from shutil import copytree, rmtree
import glob
from pathlib import Path

parser = argparse.ArgumentParser(description='Link a dependency.')
parser.add_argument('-p', help='an integer for the accumulator')
parser.add_argument('-c', help='Compile')

args = vars(parser.parse_args())
p = args['p']
c: str = args['c']

INDEX_FOLDER = '../../scifamek-utils'

NG_BUILD_COMMAND = 'npx ng build'
DIST_FOLDER = 'dist'

ps = [
    {
        'name':'angular-components-library',
        'root': INDEX_FOLDER
    },
    {
        'name':'crud-builder',
        'root': '../../crud-builder'
    }
]
for px in ps:
    p = px['name']
    root = px['root']
    system(f'cd {root} && {NG_BUILD_COMMAND} {p}')

    dest = f'../front/entities/node_modules/{p}'
    try:
        rmtree(dest)

    except Exception as e:
        pass
    copytree(
        f'{root}/{DIST_FOLDER}/{p}',
        dest,
    )