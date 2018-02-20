# Speech-to-Text-Chatting-Platform
1. Install NodeJS and npm; in Ubuntu 14.04/16.04:

	$ sudo apt-get update
	
	$ sudo apt-get install nodejs
	
	$ sudo apt-get install npm
	
   To check which version of Node.js have been installed, type:
   
	$ nodejs -v

2. Change terminal-home-directory to Speech-to-Text-Chatting-Platform-master. 

	$ cd Speech-to-Text-Chatting-Platform-master
	
	Now, Execute below command to create the node_modules folder from package.json. 
	
	$ npm install -d

3. Execute below command to create certificate:

	$ openssl genrsa -out server-key.pem 1024
	
	$ openssl req -new -key server-key.pem -out server-csr.pem
	
	$ openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem
	

4. Run the program:

	$ cd Speech-to-Text-Chat
	
	$ node speech-to-text.js
	
	If not works, then type:
	
	$ nodejs speech-to-text.js

5. Start client app on Google Chrome by typing:

	https://localhost:8080

