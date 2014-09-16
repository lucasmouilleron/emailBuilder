The email-builder
=================

A grunt based email builder for designing, testing and publishing.

Relies on the Ink framework from Zurb for templates.

Installation
------------
- Node.js : [Install Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
- Grunt-cli and Grunt : ```npm install grunt-cli -g```
- Ruby : [Install ruby with RVM](https://rvm.io/rvm/install)
- Premailer : ```gem install sass premailer hpricot nokogiri```
- Mandrill (optional, sends test emails) : [Create a Mandrill account](https://mandrillapp.com)
- Litmus (optional, tests email across clients/browsers/devices) : [Create a Litmus account](https://litmus.com) 
- AWS S3 (optional, CDN) : [Create an AWS S3 account](http://aws.amazon.com/s3)

Run
---
- ```cd build```
- ```npm install```
- ```cp config.json.sample config.json```
- Type ```grunt``` and follow instructions

Tasks
-----
- ```grunt build``` : Build the mails to ```dist```
- ```grunt send --email=the_email_file_name_without_extension``` : Send a test email
- ```grunt watchit``` : Watch and build
- ```grunt cdn``` : CDNifies assets and emails (the ```dist``` html files are production ready)

Emails templates
----------------
- Handlebars format
- Based on the Ink framework from Zurb : [classes and guidelines doc](http://zurb.com/ink/docs.php)
- Located in ```src/emails```
- As many as you want (for better performane, remove the templates you don't want to use)
- Assets basepath is ```./``` : ```<img src="img/logo.png" height="50" alt="Mailgun">``` or ```<link href="css/main.css" media="all" rel="stylesheet" type="text/css"/>```

Sending
-------
- Email sending is taking care by mandrill, which is great
- Create a manrill account and an API key
- Configure the builder : set ```testSender```, ```testReciever``` and ```mandrillKey``` in ```config.json```

CDN
---
- Uses AWS S3 as a CDN
- Configure the builder : set ```awsKey```, ```awsSecretAccessKey``` and ```awsBucket``` in ```config.json```
- Create the bucket on S3 (the name you defined in ```awsBucket```)

Litmus
------
- Create a test project in Litmus
- Change the ```testReciever``` in ```config.json``` to the adress given by Litmus

Credits
-------
- Heavily based on [https://github.com/leemunroe/grunt-email-design](https://github.com/leemunroe/grunt-email-design)
- Thanks to the guys at [Zurb](http://zurb.com/)