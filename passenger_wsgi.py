#!/usr/bin/python
'''
An API for the noun project
written in bottle

'''
import os, sys

cmd_folder = os.path.dirname(os.path.abspath(__file__))
if cmd_folder not in sys.path:
  sys.path.insert(0, cmd_folder)

import bottle
from bottle import static_file, route, run, request, post, get
import re
import urllib2 as URL

@get('/')
def index():
	site = open('index.html','r')
	return site

@route('/static/:filename')
def server_static(filename):
	return static_file(filename, root='./static/')

@post('/')
def query_submit():
	query = request.forms.get('query')
	site = open('index.html','r')
	a = site.read()
	q2 = re.sub("[^\w\s\-\?\!\.\,]","",query)
	b = a.replace("id = 'inpt' VALUE = ''","id = 'inpt' VALUE='"+q2+"'")
	return b

@route('/api/:word')
def getIcon(word):
	search_query = "http://thenounproject.com/noun/"+word+"/"
	result= {}
	try:
		response = URL.urlopen(search_query)
	except(URL.HTTPError):
       		result['status']='Fail'
		result['data']='No icon, Make one :)'
		return result
	
	html = response.read()

	#search for .svg, if there is none, then there were no matches
	if(html.find(".svg")!=1):
		#return the correct svgs
	        #matches = re.search('/site_media/svg/.*(\.(?i)(svg))$',html)
	        matches = re.search('[^\s^\']+(\.(?i)(svg))',html)
		img = matches.group(0)
		link = "http://thenounproject.com"+img
		result['status']='Success'
		result['data']=link
		return result

#return icon only

@route('/icon/:word')
def showIcon(word):
	search_query = "http://thenounproject.com/noun/"+word+"/"
	result= {}
	try:
		response = URL.urlopen(search_query)
	except(URL.HTTPError):
       		result['status']='Fail'
		result='No icon, Make one :)'
		return result
	
	html = response.read()

	#search for .svg, if there is none, then there were no matches
	if(html.find(".svg")!=1):
		#return the correct svgs
	        #matches = re.search('/site_media/svg/.*(\.(?i)(svg))$',html)
	        matches = re.search('[^\s^\']+(\.(?i)(svg))',html)
		img = matches.group(0)
		link = "http://thenounproject.com"+img
		result="<a href='"+link+"'><img src='"+link+"' title='"+word+"'></a>"
		return result




def application(environ, start_response):
  return  bottle.default_app().wsgi(environ, start_response)

if __name__=="__main__":
  bottle.debug(True)
  bottle.run(reloader=True)



