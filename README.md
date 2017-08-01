
Digiturno client
===================

Requeriments
-------------
In orden to run this application you must have already installed in you system:

-  [nw SDK version](https://nwjs.io/downloads/)
-  [mongodb](https://www.mongodb.com/download-center?jmp=nav#community) (it should be runing as a service)
-  Setup static ip address 


Instalation
-------------
- Clone repository

   `git clone https://github.com/H4ckdo/digiturno-client.git` 

- Inside the repository that just donwload, Install dependencies 
```sh
cd /digiturno-client
npm i
npm i --only-dev
```
Then copy the [nw SDK version](https://nwjs.io/downloads/) the you should be download before and put into /digiturno-client, then rename the [nw SDK version](https://nwjs.io/downloads/) folder to nwjs.

Run application
-------------

- run nw
```sh
# as long the server is running you should be able to start the project
npm run start
``` 

- Build assets and watch for changes

```sh
npm run webpack:watch
``` 

-  Build assets

```sh
npm run webpack:build
``` 
