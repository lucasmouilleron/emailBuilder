module.exports = function(grunt) {

  /////////////////////////////////////////////////////////////////////////////
  console.log("");
  grunt.log.subhead("** WELCOME TO THE EMAIL-BUILDER !");
  grunt.log.ok("Read the README.md file.");
  grunt.log.warn("If you don't know what to do, run "+"grunt".red);
  /////////////////////////////////////////////////////////////////////////////
  var fs = require("fs");
  var colors = require("colors");
  var distPath = "../campaigns-dist";
  var campaignsPath = "../campaigns";
  var task = grunt.cli.tasks[0];
  var campaignSelected = getCampaignSelected();
  var campaignSelectedPath = campaignsPath+"/"+campaignSelected;
  var distCampaignSelectedPath = distPath+"/"+campaignSelected;
  var emailSelected = getEmailSelected();
  var emailSelectedPath = campaignSelectedPath+"/"+emailSelected+".hbs";
  var availableCampaigns = getAvailableCampaigns();
  /////////////////////////////////////////////////////////////////////////////
  if(task == "send" || task == "build" || task == "cdn" || task == "watch") {
    if(campaignSelected == undefined || !grunt.file.exists(campaignSelectedPath)) {
      breakLine();
      grunt.fail.warn("You have to speficy an existing campaign to send with --campaign=the_campaign_folder_name");  
      grunt.log.warn("Available campaigns : "+availableCampaigns.join(", ").blue);
    }
  }
  if(task == "send") {
    if(emailSelected == undefined || !grunt.file.exists(emailSelectedPath)) {
      breakLine();
      grunt.log.warn("You have to speficy an existing email to send with --email=the_email_file_name_without_extension");
      grunt.log.warn("Available emails : "+getAvailableEmailsForCampaign(campaignSelected).replace(".hbs","").join(", ").blue);
      fail();
    }
  }

  /////////////////////////////////////////////////////////////////////////////  
  breakLine();
  grunt.log.ok("Campaign selected : "+campaignSelected.green);
  if(emailSelected != undefined) {
    grunt.log.ok("Email selected : "+emailSelected.green);
  }

  /////////////////////////////////////////////////////////////////////////////
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    cfg: grunt.file.readJSON("config.json"),
    dist: distCampaignSelectedPath,
    src: campaignSelectedPath,
    campaignSelected: campaignSelected,
    emailSelected: emailSelected,
    availabletasks: {
      tasks: {
        options: {
          sort: true,
          filter: "include",
          tasks: ["help","build","send","cleanup","watchit"]
        }
      }
    },
    mkdir: {
      init: {
        options: {
          create: ["<%=dist%>"]
        }
      },
    },
    sass: {
      dist: {
        options: {
          style: "expanded"
        },
        files: [{expand: true, dest:"<%=dist%>/css", cwd:"<%=src%>/scss", src:["*.scss"], ext: ".css"}]
      }
    },
    assemble: {
      options: {
        flatten: true
      },
      pages: {
        src: ["<%=src%>/*.hbs"],
        dest: "<%=dist%>"
      }
    },
    copy: {
      main: {
        expand: true,
        cwd: "<%=src%>",
        src: ["img/*"],
        dest: "<%=dist%>",
      },
    },
    clean: {
      options: {
        force: true
      },
      postInline: ["<%=dist%>/css"],
      all: [distPath]
    },
    premailer: {
      simple: {
        options: {
          removeComments: true
        },
        files: [{
          expand: true,
          src: ["<%=dist%>/*.html"],
          dest: ""
        }]
      }
    },
    watch: {
      files: ["<%=src%>/scss/*","<%=src%>/*"],
      tasks: ["build"]
    },
    mandrill: {
      mailer: {
        options: {
          key: "<%=cfg.mandrillKey%>",
          sender: "<%=cfg.testSender%>",
          recipient: "<%=cfg.testReciever%>",
          subject: "Email test for <%=cfg.projectName%> / <%=emailSelected%>"
        },
        src: ["<%=dist%>/<%=emailSelected%>.html"]
      }
    },
    aws_s3: {
      options: {
        accessKeyId: "<%=cfg.awsKey%>",
        secretAccessKey: "<%=cfg.awsSecretAccessKey%>",
        region: "<%=cfg.awsRegion%>"
      },
      mail: {
        options: {
          bucket: "<%=cfg.awsBucket%>",
          differential: true 
        },
        files: [
        {expand: true, cwd: "<%=src%>", src: ["**/*.jpg","**/*.png","**/*.gif","**/*.jpeg"], dest: "<%=cfg.projectName%>"},
        ]
      }
    },
    cdnify: {
      dist: {
        options: {
          base: "http://s3.amazonaws.com/<%=cfg.awsBucket%>/<%=cfg.projectName%>"
        },
        files: [{
          expand: true,
          cwd: "./",
          src: "<%=dist%>/*.html",
          dest: "./"
        }]
      }
    }
  });

  /////////////////////////////////////////////////////////////////////////////
  grunt.loadNpmTasks("grunt-available-tasks");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("assemble");
  grunt.loadNpmTasks("grunt-premailer");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-mandrill");
  grunt.loadNpmTasks("grunt-aws-s3");
  grunt.loadNpmTasks("grunt-cdnify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-mkdir");

  /////////////////////////////////////////////////////////////////////////////
  grunt.registerTask("default", "Help instructions", ["help"]);
  grunt.registerTask("help", "Help instructions", ["availabletasks"]);
  grunt.registerTask("build", "Build the mails (--campaign=the_campaign_folder_name)", ["mkdir:init","sass","assemble","copy","premailer","clean:postInline"]);
  grunt.registerTask("send", "Send the email (--campaign=the_campaign_folder_name, --email=the_email_file_name_without_extension)", ["cdn","mandrill"]);
  grunt.registerTask("cdn", "CDNfys assets and emails (--campaign=the_campaign_folder_name)", ["build","aws_s3","cdnify"]);
  grunt.registerTask("cleanup", "Clean everything", ["clean:all"]);
  grunt.registerTask("watchit", "Watch and build (--campaign=the_campaign_folder_name if m", ["watch"]);

  /////////////////////////////////////////////////////////////////////////////
  function getCampaignSelected() {
    var campaignSelected = grunt.option("campaign");
    if(campaignSelected == undefined) {
      var availableCampaigns = getAvailableCampaigns();
      if(availableCampaigns.length == 1) {
        campaignSelected = availableCampaigns[0];
      }
    }
    return campaignSelected;
  }

  /////////////////////////////////////////////////////////////////////////////
  function getEmailSelected() {
    var emailSelected = grunt.option("email");
    if(emailSelected == undefined && grunt.file.exists(campaignSelectedPath)) {
      var availableEmails = getAvailableEmailsForCampaign(campaignSelected);
      if(availableEmails.length == 1) {
        emailSelected = availableEmails[0];
      }
    }
    return emailSelected;
  }

  /////////////////////////////////////////////////////////////////////////////
  function getAvailableCampaigns() {
    return fs.readdirSync(campaignsPath).rFilter(/^(.(?!ds_store))*$/i);
  }

  /////////////////////////////////////////////////////////////////////////////
  function getAvailableEmailsForCampaign(campaign) {
    return fs.readdirSync(campaignsPath+"/"+campaign).rFilter(/\.hbs/i).replace(".hbs","");
  }

  /////////////////////////////////////////////////////////////////////////////
  function breakLine() {
    grunt.log.writeln("");
  }

  /////////////////////////////////////////////////////////////////////////////
  function fail() {
    grunt.fail.warn("");
  }

};

/////////////////////////////////////////////////////////////////////////////
Array.prototype.rFilter = function(regexFilter) {
  var res = [];
  for (var i = 0; i < this.length; i++) {
    if(regexFilter.test(this[i])) {
      res.push(this[i]);
    }
  }
  return res;
};

/////////////////////////////////////////////////////////////////////////////
Array.prototype.replace = function(find, replace) {
  for (var i = 0; i < this.length; i++) {
    this[i] = this[i].replace(find, replace);
  }
  return this;
};