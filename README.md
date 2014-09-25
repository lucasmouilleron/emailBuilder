The emailBuilder
=================

A grunt based email builder for designing, testing and publishing.

- Multiple campaigns and email
- Templates : Ink from Zurb, Mailchimp blueprints
- Saas, handlebars, inlining
- Mandrill, AWS S3

Installation
------------
- Node.js : [Install Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
- Grunt-cli and Grunt : `npm install grunt-cli -g`
- Ruby : [Install ruby with RVM](https://rvm.io/rvm/install)
- Premailer : `gem install sass premailer hpricot nokogiri`
- Mandrill (optional, sends test emails) : [Create a Mandrill account](https://mandrillapp.com)
- Litmus (optional, tests email across clients/browsers/devices) : [Create a Litmus account](https://litmus.com) 
- AWS S3 (optional, CDN) : [Create an AWS S3 account](http://aws.amazon.com/s3)

Run
---
- `cd build`
- `npm install`
- `cp campaigns/config.json.sample campaigns/config.json`
- Type `grunt` and follow instructions

Tasks
-----
- `grunt build` : Builds a campaign to `campaign-dist/campaign_name`
- `grunt watchit` : Watches and builds a campaign
- `grunt prod` : Prepare campaign for prod (CDNfys assets) (the `campaign-dist/campaign_name` html files are production ready)
- `grunt test` : Sends a test email of a campaign (requires CDN)
- `grunt send` : Sends an email of a campaign (requires CDN)

Campaigns
---------
- Archives and templates are located `campaign-archives`
- Campaigns are located in `campaigns`
- One campaign can contain more than one email
- Configuration : 
    - Global config is defined in `campaigns/config.json`
    - Per campaign config can be overrided : add a `config.json` file in the campaign folder

Emails
------
- Emails are written with handlebars format
- Assets basepath is `./` : `<img src="logo.png" height="50" alt="Mailgun">` or `<link href="main.css" media="all" rel="stylesheet" type="text/css"/>`
- Templates : 
    - Ink framework from Zurb : [classes and guidelines doc](http://zurb.com/ink/docs.php) : in `campaigns-archive/_zurb`
    - Mailchimp responsive blueprints : [sources](https://github.com/mailchimp/Email-Blueprints) : in `campaigns-archive/_mailchimp`
    - Mailgun transactional emails : [sources](https://github.com/mailgun/transactional-email-templates) : in `campaigns-archive/_mailgun`

Sending
-------
- Email sending is taking care by mandrill, which is great
- Create a manrill account and an API key
- Configuration : `subject`, `sender`, `receivers` and `mandrillKey` in `config.json` (global or local)

CDN
---
- Uses AWS S3 as a CDN
- Configuration : set `awsKey`, `awsSecretAccessKey` and `awsBucket` in `config.json` (global or local)
- Create the bucket on S3 (the name you defined in `awsBucket`)

Litmus
------
- Create a test project in Litmus
- Change the `receivers` in `config.json` to the adress given by Litmus

Email design best practices (reminder, as the templates we provide are compliant)
---------------------------------------------------------------------------------
- Simple and clear subject (not in full caps, no !!!!!)
- Main information withing the first 300px
- Linear structure
- Use a template boilerplate to avoid basic structure mistakes
- No white text
- Standard fonts (arial, times new roman)
- No shapes or images in text background (only plain color)
- No videos, no javascript
- Center contents with `<center>`
- Use `alt` attribute for images fallback (no special characters)
- Inline CSS

Credits
-------
- Heavily based on [https://github.com/leemunroe/grunt-email-design](https://github.com/leemunroe/grunt-email-design)
- Thanks to the guys at [Zurb](http://zurb.com/)
