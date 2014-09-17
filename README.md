The email-builder
=================

A grunt based email builder for designing, testing and publishing.

- Multiple campaigns and email ready.
- Relies on the Ink framework from Zurb for templates.
- Saas, handlebars
- Mandrill, AWS S3

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
- ```grunt build``` : Builds a campaign to ```campaign-dist/campaign_name```
- ```grunt watchit``` : Watches and builds a campaign
- ```grunt prod``` : Prepare campaign for prod (CDNfys assets) (the ```campaign-dist/campaign_name``` html files are production ready)
- ```grunt test``` : Sends a test email of a campaign (requires CDN)
- ```grunt send``` : Sends an email of a campaign (requires CDN)

Campaigns
---------
- Archives and templates are located ```campaign-archives``` and ```campaign-archives/_templates```
- Campaigns are located in ```campaigns```
- One campaign can contain more than one email

Templates
---------
- Emails are written with handlebars format
- Assets basepath is ```./``` : ```<img src="logo.png" height="50" alt="Mailgun">``` or ```<link href="main.css" media="all" rel="stylesheet" type="text/css"/>```
- Ink framework from Zurb : [classes and guidelines doc](http://zurb.com/ink/docs.php) : in ```campaigns-archive/zurb-campaign```

Sending
-------
- Email sending is taking care by mandrill, which is great
- Create a manrill account and an API key
- Configure the builder : set ```testSender```, ```testReciever``` and ```mandrillKey``` in ```config.json```
- ```testReciever``` can be an array for multiple receipents

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
