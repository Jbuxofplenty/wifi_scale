"""
Author: Josiah Buxton
Description: Helper function to convert a private key denoted as hex to a format
which can be inserted into a C program

openssl ec -in <private-key.pem> -noout -text
"""

import argparse
parser = argparse.ArgumentParser()
   
parser.add_argument('-i', '--input', type=str, required=True, 
    help="private key to convert to hexadecimal notation for insertion into a C program")
args = parser.parse_args()

split_private_key = args.input.split(':')
output = ""
for i, hex_num in enumerate(split_private_key):
  output += f"0x{hex_num}, "
  if not (i + 1) % 15:
    output += '\n'
print(output)