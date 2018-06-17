from autobahn.asyncio.websocket import WebSocketServerProtocol, \
	WebSocketServerFactory

import asyncio
import json
import random
import math

MAX_PLAYER = 100
MAP_SIZE = 1000
FOODS_COUNT = 3
BODY_COUNT = 5
BODY_LENGTH = 1
SPEED = 10

clients = {}
foods = []
empty_ids = list(range(MAX_PLAYER))

def random_point():
	return random.randrange(-MAP_SIZE/2, MAP_SIZE/2), random.randrange(-MAP_SIZE/2, MAP_SIZE/2)

def init_foods():
	for i in range(FOODS_COUNT):
		foods.append(random_point())

def random_body():
	body = []
	body.append(random_point())
	angle = random.random()*2*math.pi
	dx = math.cos(angle) * BODY_LENGTH
	dy = math.sin(angle) * BODY_LENGTH
	for i in range(1, BODY_COUNT):
		body.append((body[0][0] + dx * i, body[0][1] + dy * i))
	return body

def random_id():
	if len(empty_ids) > 0:
		return empty_ids.pop(0)
	else:
		return -1

def explicit_snapshot(_id):
	txt = '['
	first = True
	for x in clients:
		if x != _id:
			if not first:
				txt += ','
			first = False
			txt += clients[x].snapshot()
	txt += ']'
	return txt

class MyServerProtocol(WebSocketServerProtocol):

	ingame = False
	body = []
	id = -1

	def onConnect(self, request):
		pass

	def onOpen(self):
		pass

	def onMessage(self, payload, isBinary):
		msg = payload.decode('utf8')

		if not self.ingame: # its a name coming from client
			self.id = random_id()
			if (self.id == -1):
				self.sendClose()

			self.name = msg
			self.body = random_body()
			self.sendMessage(('{"f":' + json.dumps(foods) + ',"b":' + json.dumps(self.body) + ',"l":' + str(BODY_LENGTH) + ',"i":' + str(self.id) + ',"s":' + str(SPEED) + ',"sh":' + explicit_snapshot(self.id) + "}").encode("utf8"), False)

			self.ingame = True
			clients[self.id] = (self)
			print(self.name + " joined game")
			print("empty slots: " + str(len(empty_ids)))
			print(explicit_snapshot(-1))

		# broadcast
		'''for x in clients:
			if x != self:
				x.sendMessage(payload, isBinary)'''

	def onClose(self, wasClean, code, reason):
		if self.ingame:
			clients.pop(self.id)
			empty_ids.append(self.id)
			print(self.name + " exited game")
			print("empty slots: " + str(len(empty_ids)))

	def snapshot(self):
		return '{"i":' + str(self.id) + ',"n":"' + str(self.name) + '","b":' + json.dumps(self.body) + '}'


if __name__ == '__main__':
	
	init_foods()
	print("foods init.")
	print(json.dumps(foods))

	factory = WebSocketServerFactory(u"ws://127.0.0.1:9000")
	factory.protocol = MyServerProtocol

	loop = asyncio.get_event_loop()
	coro = loop.create_server(factory, '0.0.0.0', 9000)
	server = loop.run_until_complete(coro)

	try:
		loop.run_forever()
	except KeyboardInterrupt:
		pass
	finally:
		server.close()
		loop.close()
