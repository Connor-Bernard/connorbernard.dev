from os import scandir, system, path
from sys import stderr
from re import split as resplit, search as research
from requests import post
from functools import reduce
from termcolor import colored
from json import dumps as serialize, loads as deserialize
from json.decoder import JSONDecodeError
from tabulate import tabulate

# TODO: Pass in document root file.

MINIFIER_POST_URL = 'https://www.toptal.com/developers/javascript-minifier/api/raw'
CONFIG_FILE_PATH = '../json/minifyConfig.json'
INITIAL_CONFIG_DATA = {
    'outputFileName': 'output',
    'filesToConcatenate': []
}

config = None
failed_files = []

def exit_with_file_errors():
    """Exits with error code 1 if a file failed at some point.
    """
    exit(int(bool(len(failed_files))))

def print_as_table(prompt):
    """Prints input and a box around a input.

    Args:
        prompt (string): Text to be printed in a box.
    """
    print(tabulate([[prompt]], tablefmt='grid'))

def print_success(msg):
    """Prints a success message.

    Args:
        msg (string): Success message.
    """
    print(colored('SUCCESS:', 'black', 'on_green') + ' ' + colored(msg, 'green'))

def print_warning(msg):
    """Prints a warning message.

    Args:
        msg (string): Warning message.
    """
    print(colored('WARNING:', 'black', 'on_yellow') + ' ' + colored(msg, 'yellow'))

def print_error(msg):
    """Prints an error message.

    Args:
        msg (string): Error message.
    """
    print(colored('ERROR:', 'white', 'on_red') + ' ' + colored(msg, 'red'), file=stderr)

def await_user_acknowledgment():
    """Prevents further program execution until the user has pressed 'Enter'.
    """
    input('Press \'Enter\' to continue.\n')

def save_config():
    """Serializes and stores the config in the config file.
    """
    if config is None:
        print_warning('Could not load config.')
        exit(1)
    with open(CONFIG_FILE_PATH, 'w') as config_file:
        config_file.write(serialize(config))

def update_output_file_name(file_stub):
    """Updates the config with a new output file name.

    Args:
        file_stub (string): updated file name (no file extension).
    """
    config['outputFileName'] = file_stub
    save_config()

def add_file_to_config(file_stub):
    """Marks a file for concatenation in the config.

    Args:
        file_stub (string): file name to be marked (no file extension).
    """
    config['filesToConcatenate'].append(file_stub)
    save_config()

def remove_file_from_config(file_stub):
    """Unmarks a file for concatenation in the config.

    Args:
        file_stub (string): file name to be unmarked (no file extension).
    """
    config['filesToConcatenate'].remove(file_stub)
    save_config()

def concatenate_files(file_stubs):
    """Concatenates the files marked for concatenation in the config.

    Args:
        file_stubs (List<string>): list of files to be concatenated (no file extension).
    """
    failed_files = []
    concatenated_content_string = ''
    for file_stub in file_stubs:
        try:
            with open(f'{file_stub}.js', 'r') as file_content:
                concatenated_content_string += file_content.read()
        except FileNotFoundError:
            failed_files.append(f'{file_stub}.js')
            print_warning(f'Could not find file: {file_stub}.js.')
    with open(f'{config["outputFileName"]}.js', 'w') as output_file:
        output_file.write(concatenated_content_string)

def compress_all_uncompressed_files():
    """Compresses all .js files in the current directory to .min.js files.
    """
    failed_files = []
    with scandir('.') as current_dir:
        for file in current_dir:
            if not file.is_file():
                continue
            if research('(\.min\.js)|(\.py)$', file.name): # min or py file
                continue
            if file.name.split('.')[0] in config['filesToConcatenate']:
                continue
            if len(file.name) <= 4 or not file.name[-3:] == '.js':
                continue
            minified_content = None
            with open(file.name, 'r') as file_content:
                print(f'Minimizing {file.name}...')
                minified_content = post(MINIFIER_POST_URL, {'input': file_content.read()}).text
                if not minified_content:
                    failed_files.append(file.name)
                    print_warning(f'Failed to minimize {file.name}.')
                    break
            file_name_array = resplit('(\.)', file.name) # split; preserve separators
            file_name_array.insert(-1, 'min.')
            min_file_name = reduce(lambda a, b: a + b, file_name_array)
            with open(min_file_name, 'w') as min_file_content:
                min_file_content.write(minified_content)
        if not failed_files:
            print_success(f'Successfully minimized all files.')
        else:
            print_warning(f'Failed to minify {repr(failed_files)[1:-1]}.')

def show_menu():
    """Prints the main menu to stdio.
    """
    system('clear')
    menu_prompt = colored('Your current config concatenates these files:', 'yellow') + '\n'
    for file_stub in config['filesToConcatenate']:
        menu_prompt += f'- {file_stub}\n'
    menu_prompt += '\n' + colored('Your output file is currently:', 'yellow') + ' ' + config["outputFileName"] + '\n'
    print_as_table(menu_prompt)
    print()
    print(colored('-- OPTIONS --', 'yellow'))
    print('[1] Add a file to the concatenation list.')
    print('[2] Remove a file from the concatenation list.')
    print('[3] Change the output file name.')
    print('[4] Concatenate files.')
    print('[5] Compress all uncompressed files in this directory.')
    print('[0] Exit.')
    print()
    opt = input('Option: ')
    system('clear')
    match opt:
        case '0':
            exit_with_file_errors()
        case '1':
            print_as_table(colored('Enter the stub of the file to add to the concatenation list.', 'light_cyan') + '\n')
            file_stub = input('File stub: ')
            if not path.exists(f'{file_stub}.js'):
                print_warning('File not found.')
                await_user_acknowledgment()
                return
            if file_stub in config['filesToConcatenate']:
                print_warning('File already marked for concatenation.')
                await_user_acknowledgment()
                return
            add_file_to_config(file_stub)
        case '2':
            file_prompt = colored('Enter the option of the file you\'d like to remove from the concatenation list', 'light_cyan') + '\n\n'
            for i, file_stub in enumerate(config['filesToConcatenate']):
                file_prompt += f'[{i}] {file_stub}\n'
            print_as_table(file_prompt)
            try:
                opt = int(input('Selection: '))
                remove_file_from_config(config['filesToConcatenate'][opt])
            except (ValueError, IndexError):
                print_warning(f'Option {opt} invalid.')
                await_user_acknowledgment()
                return
        case '3':
            print_as_table(colored('Enter the new concatenated file name stub.', 'light_cyan') + '\n')
            newFileName = input('File stub: ')
            update_output_file_name(newFileName)
        case '4':
            concatenate_files(config['filesToConcatenate'])
            if failed_files:
                print_warning(f'Failed to concatenate {repr(failed_files[1:-1])}.')
                await_user_acknowledgment()
        case '5':
            compress_all_uncompressed_files()
            exit_with_file_errors()
        case _:
            print_warning('Invalid option.')
            await_user_acknowledgment()

if __name__ == '__main__':
    try:
        with open(CONFIG_FILE_PATH, 'r') as config_file:
            config = deserialize(config_file.read())
    except FileNotFoundError:
        print_warning('Could not find config.  Would you like to set up a new one?')
        if input('(y/n): ').lower() not in ['y', 'yes']:
            exit(1)
        config = INITIAL_CONFIG_DATA
        with open(CONFIG_FILE_PATH, 'w') as config_file:
            config_file.write(serialize(INITIAL_CONFIG_DATA))
    except JSONDecodeError:
        print_error('Config file is misformed or corrupted.  Would you like to reset it?')
        if input('(y/n): ').lower() not in ['y', 'yes']:
            exit(1)
        config = INITIAL_CONFIG_DATA
        with open(CONFIG_FILE_PATH, 'w') as config_file:
            config_file.write(serialize(INITIAL_CONFIG_DATA))
    while True:
        show_menu()
