module.exports = function(grunt) {

  /////////////////////////////////////////////////////////////////////////////
  console.log("");
  grunt.log.subhead("** WELCOME TO THE EMAIL-BUILDER !");
  grunt.log.ok("Read the README.md file.");
  grunt.log.warn("If you don't know what to do, run "+"grunt".red);
  /////////////////////////////////////////////////////////////////////////////
  var fs = require("fs");
  var merge = require("merge");
  var colors = require("colors");
  var prompt = require("sync-prompt").prompt;
  var distPath = "../campaigns-dist";
  var campaignsPath = "../campaigns";
  var task = grunt.cli.tasks[0];
  var campaignSelected = getCampaignSelected();
  var campaignSelectedPath = campaignsPath+"/"+campaignSelected;
  var distCampaignSelectedPath = distPath+"/"+campaignSelected;
  var campaignSelectedConfigPath = campaignSelectedPath+"/config.json";
  var emailSelected = getEmailSelected();
  var emailSelectedPath = campaignSelectedPath+"/"+emailSelected+".hbs";
  var availableCampaigns = getAvailableCampaigns();
  var cfg = grunt.file.readJSON(campaignsPath+"/config.json");
  var subjectSend;
  /////////////////////////////////////////////////////////////////////////////
  if(["send","test","build","prod","watchit","mailchimp"].contains(task)) {
    grunt.log.subhead("** Campaign setup and inspection");
    if(campaignSelected == undefined || !grunt.file.exists(campaignSelectedPath)) {
      grunt.log.warn("You have to speficy an existing campaign to send with --campaign=the_campaign_folder_name");  
      grunt.log.warn("Available campaigns : "+availableCampaigns.join(", ").blue);
      fail();
    }
    if(["send","test"].contains(task)) {
      if(emailSelected == undefined || !grunt.file.exists(emailSelectedPath)) {
        grunt.log.warn("You have to speficy an existing email to send with --email=the_email_file_name_without_extension");
        grunt.log.warn("Available emails : "+getAvailableEmailsForCampaign(campaignSelected).replace(".hbs","").join(", ").blue);
        fail();
      }
    }
    if(grunt.file.exists(campaignSelectedConfigPath)) {
      cfg = merge(cfg, grunt.file.readJSON(campaignSelectedConfigPath));
      grunt.log.ok("Campaign specific config loaded");
    }
    else {
      grunt.log.ok("Using global config"); 
    }
    subjectSend = getSubject();
    if(["send"].contains(task) && subjectSend == undefined) {
      grunt.log.warn("You have to speficy a subject with --subject=the_subject_in_between_double_quote or in the config.json file");
      fail();
    }
    grunt.log.ok("Campaign selected : "+campaignSelected.green);
    if(emailSelected != undefined) {
      grunt.log.ok("Email selected : "+emailSelected.green);
    }
    if(subjectSend != undefined) {
      grunt.log.ok("Subject : "+subjectSend.green);
    }
    if(["send"].contains(task)) {
      if(prompt("Are you sure you want to send this email (y/N) ? ").toLowerCase() != "y") {
        fail();
      }
    }
  }

  grunt.log.subhead("** Execution !");

  /////////////////////////////////////////////////////////////////////////////
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    cfg: cfg,
    dist: distCampaignSelectedPath,
    src: campaignSelectedPath,
    campaignSelected: campaignSelected,
    emailSelected: emailSelected,
    subjectSend: subjectSend,
    availabletasks: {
      tasks: {
        options: {
          sort: true,
          filter: "include",
          tasks: ["help","build","test","prod","mailchimp","cleanup","watchit","send"]
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
        files: [{expand: true, dest:"<%=dist%>/", cwd:"<%=src%>/scss", src:["*.scss"], ext: ".css"}]
      }
    },
    assemble: {
      options: {
        flatten: true
      },
      pages: {
        src: ["<%=src%>/*.{hbs,html}"],
        dest: "<%=dist%>"
      }
    },
    copy: {
      main: { 
        expand: true, flatten: true, cwd:"<%=src%>", src: ["images/**","files/**"], dest: "<%=dist%>/", filter: "isFile"
      }
    },
    clean: {
      options: {
        force: true
      },
      preBuild: ["<%=dist%>/*"],
      postBuild: ["<%=dist%>/*.css*"],
      postCDN: ["<%=dist%>/*","!<%=dist%>/*.html"],
      postCompress: ["<%=dist%>/*","!<%=dist%>/*.zip"],
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
      files: ["<%=src%>/**/*"],
      tasks: ["build"]
    },
    mandrill: {
      test: {
        options: {
          key: "<%=cfg.mandrillKey%>",
          sender: "<%=cfg.sender%>",
          recipient: "<%=cfg.receiver%>",
          subject: "Email test for <%=campaignSelected%> / <%=emailSelected%>"
        },
        src: ["<%=dist%>/<%=emailSelected%>.html"]
      },
      send: {
        options: {
          key: "<%=cfg.mandrillKey%>",
          sender: "<%=cfg.sender%>",
          recipient: "<%=cfg.receiver%>",
          subject: "<%=subjectSend%>"
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
        files: [{expand: true, flatten:true, cwd: "<%=src%>", src: ["**/*.{hbs,html}","images/**","files/**"], dest: "<%=campaignSelected%>", filter: "isFile"}]
      }
    },
    compress: {
      main: {
        options : {
          archive : "<%=dist%>/archive.zip"
        },
        files: [
        {expand:true, flatten: true, cwd:"<%=dist%>", src: ["**"], filter: "isFile"}
        ]
      }
    },
    cdnify: {
      dist: {
        options: {
          base: "http://s3.amazonaws.com/<%=cfg.awsBucket%>/<%=campaignSelected%>",
          html: {
            "a[href]":"href"
          }
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
  grunt.loadNpmTasks("grunt-contrib-compress");

  /////////////////////////////////////////////////////////////////////////////
  grunt.registerTask("default", "Help instructions", ["help"]);
  grunt.registerTask("help", "Help instructions", ["availabletasks"]);
  grunt.registerTask("build", "Build a campaign (--campaign=the_campaign_folder_name)", ["mkdir:init","clean:preBuild","sass","assemble","copy","premailer","clean:postBuild"]);
  grunt.registerTask("test", "Test an email of a campaign (--campaign=the_campaign_folder_name, --email=the_email_file_name_without_extension)", ["prod","mandrill:test"]);
  grunt.registerTask("send", "Sends an email of a campaign (--campaign=the_campaign_folder_name, --email=the_email_file_name_without_extension)", ["prod","mandrill:send"]);
  grunt.registerTask("prod", "Prepare campaign for prod (CDNfys assets) (--campaign=the_campaign_folder_name)", ["build","aws_s3","cdnify","clean:postCDN"]);
  grunt.registerTask("mailchimp", "Package an email of a campaign for mailchimp (--campaign=the_campaign_folder_name, --email=the_email_file_name_without_extension)", ["build","compress","clean:postCompress"]);
  grunt.registerTask("cleanup", "Clean everything", ["clean:all"]);
  grunt.registerTask("watchit", "Watch and build a campaign (--campaign=the_campaign_folder_name)", ["watch"]);

  /////////////////////////////////////////////////////////////////////////////
  function getSubject() {
    var subject = grunt.option("subject");
    if(subject !== undefined) {
      return subject;
    }
    else {
      return cfg.subject;
    }
  }

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
  return fs.readdirSync(campaignsPath).filter(function (file) {
    return fs.statSync(campaignsPath+"/"+file).isDirectory();
  });
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

/////////////////////////////////////////////////////////////////////////////
Array.prototype.contains = function(element){
  return this.indexOf(element) > -1;
};