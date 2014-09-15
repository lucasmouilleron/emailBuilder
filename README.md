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
- ```npm install```
- Type ```grunt``` and follow instructions

Tasks
=====
- ```grunt build``` : build the emails from ```src/emails``` to ```dist```
- ```grunt send --template=the_template_name``` : sends a test
- ```grunt watch``` : watch formodification and build
- ```grunt cdn``` : publish assets to CDN (the ```dist``` html files are production ready)

Litmus
======
- Create a test project in Litmus
- Change the ```testReciever``` in ```config.json``` to the adress given by Litmus