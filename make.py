import os
import time

files = ["game", "background", "analyzer"]

makefile = open("Makefile", "w")


makestr = ""

for f in files:
	makestr += "%s-min.js: %s.coffee\n" % (f, f)
	makestr += chr(9) + "coffee -c %s.coffee\n" % f
	makestr += chr(9) + "uglifyjs %s.js > %s-min.js\n" % (f, f)
	makestr += "\n"

makestr += "nan: "
for f in files: 
	makestr += " %s-min.js" % f
makestr += "\n"
makestr += chr(9) + "echo built"

makefile.write(makestr)
makefile.close()

while True:
	time.sleep(1)
	for f in files:
		os.system("make nan")
