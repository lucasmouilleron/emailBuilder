Installation
============
- Node.js : [Install Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
- Grunt-cli and Grunt : ```npm install grunt-cli -g```
- Ruby : [Install ruby with RVM](https://rvm.io/rvm/install)
- Premailer : ```gem install premailer hpricot nokogiri```
- Mandrill (optional, sends test emails) : [Create a Mandrill account](https://mandrillapp.com)
- Litmus (optional, tests email across clients/browsers/devices) : [Create a Litmus account](https://litmus.com) 
- AWS S3 (optional, CDN) : [Create an AWS S3 account](http://aws.amazon.com/s3)

Run
===
- ```cd build```
- ```npm install```
- ```cp config.json.sample config.json```
- Type ```grunt``` and follow instructions

Tasks
=====
- ```grunt build``` : Build the mails to ```dist```
- ```grunt send --email=the_email_file_name_without_extension``` : Send a test email
- ```grunt watchit``` : Watch and build
- ```grunt cdn``` : CDNifies assets and emails (the ```dist``` html files are production ready)

Emails templates
================
- Handlebars format
- Located in ```src/emails```
- As many as you want
- Assets basepath is ```./``` : ```<img src="img/logo.png" height="50" alt="Mailgun">```

Litmus
======
- Create a test project in Litmus
- Change the ```testReciever``` in ```config.json``` to the adress given by Litmus

Credits
=======
Heavily based on [https://github.com/leemunroe/grunt-email-design](https://github.com/leemunroe/grunt-email-design)