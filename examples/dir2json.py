import json
import os
import codecs
import io

def read_file(fn):
	f = io.open(fn, mode="r", encoding="utf-8")
	return f.read()
    #with open(fn, 'r') as file:
    #    return file.read()

result = {}

for x in os.listdir():
	abs_path = os.path.abspath(x)
	if x[-4:] == '.saz' and  os.path.isfile(abs_path):
		result[x.split('.')[1]] = read_file(abs_path)

#jresult = json.dumps(result, ensure_ascii=False)

with io.open('output.json', 'w', encoding='utf8') as json_file:
    json.dump(result, json_file, ensure_ascii=False)

#print(jresult)