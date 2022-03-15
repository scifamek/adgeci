import os
import glob
import sys

PREFIX = '../..'
MICROFRONTENDS_PATH = '../front'

argv = sys.argv


def get_microfrontends():
    files = list(
        map(
            lambda x: x.replace('\\', '/'),
            glob.glob(
                '{}/*'.format(MICROFRONTENDS_PATH)
            )
        )
    )
    return (files)


LIBRARIES = {
    'angular-components-library': {
        'path': 'scifamek-utils',
        'command': 'ng build angular-components-library --prod'
    },
    'adgeci-core-utils': {
        'path': 'scifamek-utils',
        'command': 'ng build adgeci-core-utils --prod'
    },
    'crud-builder': {
        'path': 'crud-builder',
        'command': 'ng build crud-builder --prod',
        'dependencies': [
            'angular-components-library'
        ]
    }

}

microfrontends = get_microfrontends()
flag = len(argv) == 2
compiled_libraries = []

def link_library(library, path):
    print()
    print('Linking in {}'.format(path))
    print()
    link_command = 'cd {} && npm link {}'.format(path, library)
    print(link_command)
    os.system(link_command)
    print()

def compile_library(library_config):

    dependencies = library_config['dependencies'] if 'dependencies' in library_config else []
    if(len(dependencies) > 0):
        for dep in dependencies:
            if (compiled_libraries.index(dep) == -1):
                library_temp = LIBRARIES[dep]
                compile_library(library_temp)
            else:
                link_library(dep,'{}/{}'.format(PREFIX,library_config['path']))

    build_command = 'cd {}/{} && {}'.format(PREFIX,
                                            library_config['path'], library_config['command'])
    publish_command = 'cd {}/{}/dist/{} && npm link'.format(PREFIX,
                                                library_config['path'], library)
    print('Compiling {}'.format(library))
    print()
    print(build_command)
    os.system(build_command)
    print(publish_command)
    os.system(publish_command)
    compiled_libraries.append(library)

    link_library(library,'{}/{}'.format(PREFIX,library_config['path']))



for library in LIBRARIES:
    library_config = LIBRARIES[library]
    if(not flag):
        compile_library(library_config)
    for mf in microfrontends:
        link_library(library, mf)


