import sys
import importlib
from pathlib import Path
from inspect import getmembers, isfunction
import json


class MyErr(Exception):
	def __init__(self, msg) -> None:
		super().__init__(msg)
		self.msg = msg

	def __str__(self) -> str:
		return "ERROR:\n" + self.msg


def get_dirname(*s) -> str:
	dirname = "_".join(s).lower() # Directory name given via argv
	if not Path(dirname).exists():
		raise MyErr(f"Directory '{dirname}' couldn't be found")
	return dirname


# Assumes directory for dirname exists
def get_modname_from_dirname(dirname: str) -> str:
	# Find filename of python file in specified directory
	# dirname, 'master' or 'main' are preferred over other names
	filename = None
	for p in Path(dirname).glob('*.py'):
		if filename is None or p.name.lower().startswith((dirname, "main", "master")):
			filename = p.name
	if filename is None:
		raise MyErr(f"Couldn't find a python file in the directory '{dirname}'")
	filename = '.'.join(filename.split('.')[:-1])
	# Load python file as module
	return dirname + '.' + filename


def get_func_from_modname(modname: str, dirname: str):
	try:
		mod = importlib.import_module(modname)
	except:
		raise MyErr(f"Module '{modname}' couldn't be found.")
	# Get functions in module
	funcs = [x for x in getmembers(mod) if isfunction(x[1])]
	# Each entry in funcs is a tuple of the form (name, func-ptr)
	# Find function to run
	# Functions with names specified in the "startswith" function are prefered
	f = None
	for ftup in funcs:
		if ftup[0].lower().startswith((dirname, "".join(dirname.split('_')), 'main', 'master', 'run')):
			f = ftup[1]
		elif f == None:
			f = ftup[1]
	if f is None:
		raise MyErr(f"No applicable function was found in the module: '{modname}'\nFunctions: {funcs}")
	return f


# Assumes directory for dirname exists
def read_tests(dirname: str) -> list:
	testFile = None
	for p in Path(dirname).glob('*.json'):
		if p.name.lower().startswith(("example", "test")):
			testFile = p
	if testFile is None:
		raise MyErr(f"No test-file (.json) was found in '{dirname}'")
	testData = json.loads(testFile.read_text('utf-8'))
	tests = []
	for t in testData:
		inp, out = (None, None)
		if isinstance(t, list):
			inp = t[0]
			out = t[1]
		elif isinstance(t, dict):
			inp = t["in"]
			out = t["out"]
		else:
			raise MyErr(f"Each test should be stored as a list or dict in the testFile '{testFile.name}' in the directoy '{dirname}'.")
		tests.append({"in": inp, "out": out})
	return tests


# Assumes that x & y are of the same type
def cmp_out(x, y) -> bool:
	if isinstance(x, list) or isinstance(x, tuple):
		if len(x) != len(y):
			return False
		for i in range(len(x)):
			if not cmp_out(x[i], y[i]):
				return False
		return True
	elif isinstance(x, dict):
		x_keys = x.keys()
		if len(x_keys) != len(y.keys()):
			return False
		for k in x_keys:
			try:
				if not cmp_out(x[k], y[k]):
					return False
			except:
				return False
		return True
	else:
		return x == y


def run_tests(f, tests: list):
	for t in tests:
		if type(t["in"]) is list:
			res = f(*t["in"])
		else:
			res = f(t["in"])
		if not cmp_out(res, t["out"]):
			return (res, t)
	return None


def run_tests_with_print(f, tests: list, taskname: str):
	res = run_tests(f, tests)
	if res is None:
		print(f"All tests passed for task '{taskname}'")
	else:
		print(f"TEST FAILED")
		print(f"Input: {res[1]['in']}")
		print(f"Expected Output: {res[1]['out']}")
		print(f"Actual Output: {res[0]}")


if __name__ == '__main__':
	try:
		dirname = get_dirname(*sys.argv[1:])
		modname = get_modname_from_dirname(dirname)
		func = get_func_from_modname(modname, dirname)
		tests = read_tests(dirname)
		run_tests_with_print(func, tests, dirname)
	except MyErr as err:
		print(err)