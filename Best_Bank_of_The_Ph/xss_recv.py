import socket

PORT = 8080

ssocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
ssocket.bind(('', PORT))
ssocket.listen(10)

print("Starting to receive requests at PORT {}:".format(PORT))
while True:
	try:
		client, client_addr = ssocket.accept()
		print("""
			-------------------------------------
			{}
			--------------------------------------
		""".format(client.recv(1024)))
	except Exception as ex:
		print("EXITING PROGRAM")
		break
		
ssocket.close()