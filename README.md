
Digiturno
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

   `git clone https://github.com/H4ckdo/digiturno.git` 

- Inside the repository that just donwload, Install dependencies 
```sh
cd /digiturno
npm i
npm i --only-dev
```
- Add env variables
 
```sh
nano ~/.bashrc
#inside .bashrc add:
export NW_SDK='~/path/to/nw_sdk/nw' #note that NW_SDK must point to nw application
export SADDRESS='my static ip address'
``` 

```sh 
#Then save the file and reaload the terminal then type:
echo $NW_SDK | bash #Test the variable it should fire up node-webkit
``` 


Run application
-------------

- Lift server
```sh
# as long the mongod server is running you should be able to lift the server
npm run lift
``` 
- run nw
```sh
# as long the server is running you should be able to start the project
npm run start
``` 

-  Watch for changes

```sh
npm run webpack:watch
``` 

-  Build assets

```sh
npm run webpack:build
``` 
