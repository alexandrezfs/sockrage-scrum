sockrage-scrum
==============

[NodeJS] A scrum meeting session manager built using Sockrage.

##Requirements
+ Your must have a SOCKRAGE instance running somewhere.
Read more about Sockrage, the real-time server that provides stockage.

https://github.com/ultrasupernew/sockrage

+ NodeJS > v0.8
+ MongoDB
+ NPM

##Installation
    git clone https://github.com/alexzhxin/sockrage-scrum && cd sockrage-scrum
    sudo npm install
    cd public && sudo bower install
    
##Configuration
The configuration file is located in public/js/config.js.
Please configure the following variables :

    sockrage_addr : your_sockrage_addr
    scrum_item_collection : your_sockrage_reference_name
    
##Running
    node app.js
