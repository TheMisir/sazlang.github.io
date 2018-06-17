from autobahn.asyncio.websocket import WebSocketServerProtocol, \
	WebSocketServerFactory

import asyncio
import json
import random
import math

MAX_PLAYER = 100
MAP_SIZE = 1000
FOODS_COUNT = 50
PLAYER_SIZE = 50
SPEED = 10

clients = {}
foods = []
empty_ids = list(range(MAX_PLAYER))

def random_point():
	return random.randrange(-MAP_SIZE/2, MAP_SIZE/2), random.randrange(-MAP_SIZE/2, MAP_SIZE/2)

def init_foods():
	for i in range(FOODS_COUNT):
		foods.append(random_point())

def random_id():
	if len(empty_ids) > 0:
		return empty_ids.pop(0)
	else:
		return -1

def explicit_snapshot(_id):
	txt = '{'
	first = True
	for x in clients:
		if x != _id:
			if not first:
				txt += ','
			first = False
			txt += '"' + str(x) + '":' + clients[x].snapshot()
	txt += '}'
	return txt

class MyServerProtocol(WebSocketServerProtocol):

	ingame = False
	position = []
	size = PLAYER_SIZE
	speed = SPEED
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
			self.position = random_point()
			self.ingame = True
			clients[self.id] = (self)

			self.sendMessage(('{"f":' + json.dumps(foods) + ',"p":' + explicit_snapshot(-1) + ',"i":' + str(self.id) + "}").encode("utf8"), False)

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
		return '{"n":"' + str(self.name) + '","p":' + json.dumps(self.position) + ',"s":"' + str(self.size) + '"}'


if __name__ == '__main__':
	
	init_foods()
	print("foods init.")

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
