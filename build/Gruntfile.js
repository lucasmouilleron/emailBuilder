module.exports = function(grunt) {

/////////////////////////////////////////////////////////////////////////////
var task = grunt.cli.tasks[0];
if(task == "send" && grunt.option("template") == undefined) {
  grunt.fail.warn("You have to speficy a template with --template=the_template_name");
}

/////////////////////////////////////////////////////////////////////////////
grunt.initConfig({
  pkg: grunt.file.readJSON("package.json"),
  cfg: grunt.file.readJSON("config.json"),
  dist: "../dist",
  src: "../src",
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
      files: {
        "<%=src%>/css/main.css": "<%=src%>/css/scss/main.scss"
      }
    }
  },
  assemble: {
    options: {
      flatten: true
    },
    pages: {
      src: ["<%=src%>/emails/*.hbs"],
      dest: "<%=dist%>"
    }
  },
  copy: {
    main: {
      expand: true,
      cwd: "<%=src%>",
      src: ["css/*.css","img/*"],
      dest: "<%=dist%>",
    },
  },
  clean: {
    options: {
      force: true
    },
    postInline: ["<%=dist%>/css"],
    all: ["<%=dist%>"]
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
    files: ["<%=src%>/css/scss/*","<%=src%>/emails/*"],
    tasks: ["build"]
  },
  mandrill: {
    mailer: {
      options: {
        key: "AhD7RXY7ZJmY-NuAQMjJWg",
        sender: "<%=cfg.testSender%>",
        recipient: "<%=cfg.testReciever%>",
        subject: "Email test for <%=cfg.projectName%> / "+grunt.option("template")
      },
      src: ["<%=dist%>/"+grunt.option("template")+".html"]
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
grunt.registerTask("build", "Build the mails", ["mkdir:init","sass","assemble","copy","premailer","clean:postInline"]);
grunt.registerTask("send", "Send the email (--template=the_template_name)", ["cdn","mandrill"]);
grunt.registerTask("cdn", "CDNfys assets and emails", ["build","aws_s3","cdnify"]);
grunt.registerTask("cleanup", "Clean project", ["clean:all"]);
grunt.registerTask("watchit", "Watch and build", ["watch"]);

};
