#!/usr/bin/env python3

import argparse
import json
import os
import sys

import requests

def main():
    default_auth_file = os.path.join(os.path.dirname(__file__), 'auth.txt')
    default_code_dir = os.path.dirname(__file__)

    parser = argparse.ArgumentParser()
    parser.add_argument(
        '-a','--auth-file',
        default=default_auth_file,
        help="Text file with screeps email/password on first two lines",
    )
    parser.add_argument(
        '-d','--code-directory',
        default=default_code_dir,
        help="Directory containing screeps code",
    )
    parser.add_argument(
        '-b','--branch',
        default='default',
        help="Screeps branch to push to",
    )

    args = parser.parse_args()



    with open(args.auth_file) as f:
        username = f.readline().strip()
        password = f.readline().strip()

    upload_screeps(username = username,
                   password = password,
                   code_dir = args.code_directory,
                   branch = args.branch)

screeps_api_endpoint = 'https://screeps.com/api/user/code'

def upload_screeps(username, password, code_dir, branch='default'):
    modules = {}
    for filename in os.listdir(code_dir):
        if filename.lower().endswith('.js'):
            module_name = filename[:-3]
            module_contents = open(os.path.join(code_dir, filename)).read()
            modules[module_name] = module_contents

    data = {'branch': branch,
            'modules': modules}

    requests.post(screeps_api_endpoint, json=data, auth=(username,password))

if __name__=='__main__':
    main()
