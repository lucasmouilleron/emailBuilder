Installation
============
- Node.js : [Install Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
- Grunt-cli and Grunt : ```npm install grunt-cli -g```
- Ruby : [Install ruby with RVM](https://rvm.io/rvm/install)
- Premailer : ```gem install premailer hpricot nokogiri```
- [Mandrill](https://mandrillapp.com) (optional) : Sends the email
- [Litmus](https://litmus.com) (optional) : Tests the email across all clients/browsers/devices
- [AWS S3](http://aws.amazon.com/s3) (optional) : Uses AWS S3 as a CDN

Run
===
- ```cd build```
- ```npm install```
- Type ```grunt``` and follow instructions

Tasks
=====
- ```grunt build``` : Build the mails to ```dist```
- ```grunt send --template=the_template_name``` : Send a test email
- ```grunt watchit``` : Watch and build
- ```grunt cdn``` : CDNfys assets and emails (the ```dist``` html files are production ready)

Litmus
======
- Create a test project in Litmus
- Change the ```testReciever``` in ```config.json``` to the adress given by Litmus