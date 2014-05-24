import os
import time

files = ["game", "backgound", "analyzer"]

while True:
	time.sleep(1000)
	for f in files:
		os.system("coffee -c %s.coffee" % f)
		os.system("uglifyjs %s.js -o %s-min.js" % (f, f))