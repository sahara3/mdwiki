var createOutput = function (grunt, basename, taskname) {
    'use strict';
    var conf = grunt.config(basename)[taskname],
        tmpl = grunt.file.read(conf.template);

    // register the task name in global scope so we can access it in the .tmpl file
    grunt.config.set('currentTask', { name: taskname });

    grunt.file.write(conf.dest, grunt.template.process(tmpl));
    grunt.log.writeln('Generated \'' + conf.dest + '\' from \'' + conf.template + '\'');
};

/*global module:false*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.

    grunt.initConfig({
        // Metadata.
        pkg: {
            name: 'MDwiki',
            version: '0.6.3'
        },

        ownJsFiles: [
            'js/marked.js',
            'js/init.js',
            'js/logging.js',
            'js/stage.js',
            'js/main.js',
            'js/util.js',
            'js/modules.js',
            'js/basic_skeleton.js',
            'js/bootstrap.js',
            'js/gimmicker.js',

            // gimmicks
            'js/gimmicks/alerts.js',
            'js/gimmicks/colorbox.js',
            'js/gimmicks/carousel.js',
            'js/gimmicks/disqus.js',
            'js/gimmicks/editme.js',
            'js/gimmicks/facebooklike.js',
            'js/gimmicks/forkmeongithub.js',
            //'js/gimmicks/github_gist.js',
            'js/gimmicks/gist.js',
            'js/gimmicks/googlemaps.js',
            'js/gimmicks/iframe.js',
            'js/gimmicks/math.js',
            'js/gimmicks/prism.js',
            // 'js/gimmicks/leaflet.js',
            'js/gimmicks/themechooser.js',
            'js/gimmicks/twitter.js',
            'js/gimmicks/youtube_embed.js',
            'js/gimmicks/chart.js',
            'js/gimmicks/yuml.js',
            'js/gimmicks/mermaid.js',
        ],

        // files that we always inline (stuff not available on CDN)
        internalCssFiles: [
        ],
        // ONLY PUT ALREADY MINIFIED FILES IN HERE!
        internalJsFiles: [
        ],

        // references we add in the slim release (stuff available on CDN locations)
        externalJsRefs: [
            'https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js',
            'https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js',
            'https://cdn.jsdelivr.net/npm/prismjs@1.19.0/prism.min.js',
            'https://cdn.jsdelivr.net/npm/jquery-colorbox@1.6.4/jquery.colorbox.min.js'
        ],
        externalCssRefs: [
            'https://fonts.googleapis.com/css?family=Roboto+Mono',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/prismjs@1.19.0/themes/prism.css',
            'https://cdn.jsdelivr.net/npm/jquery-colorbox@1.6.4/example1/colorbox.css'
            //            'www.3solarmasses.com/retriever-bootstrap/css/retriever.css'
            //            '3solarmasses.com/corgi-bootstrap/css/corgi.css'
        ],

        concat: {
            options: {
                //banner: '<%= banner %>',
                stripBanners: true
            },
            dev: {
                src: '<%= ownJsFiles %>',
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dev.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        index: {
            slim: {
                template: 'index.tmpl',
                dest: 'dist/mdwiki.html'
            },
            debug: {
                template: 'index.tmpl',
                dest: 'dist/mdwiki-debug.html'
            }
        },
        editor: {
            slim: {
                template: 'editor.tmpl',
                dest: 'dist/mdwiki-editor.html'
            },
            debug: {
                template: 'editor.tmpl',
                dest: 'dist/mdwiki-editor-debug.html'
            }
        },
        /* make it use .jshintrc */
        jshint: {
            options: {
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: false,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    marked: true,
                    google: true,
                    hljs: true,
                    /* leaflet.js*/
                    L: true,
                    console: true,
                    Chart: true,
                    Prism: true
                }
            },
            /*gruntfile: {
                src: 'Gruntfile.js'
            },*/
            js: {
                src: ['js/*.js', 'js/**/*.js', '!js/marked.js']
            }
        },
        lib_test: {
            src: ['lib/**/*.js', 'test/**/*.js']
        },
        copy: {
            release_slim: {
                expand: false,
                flatten: true,
                src: ['dist/mdwiki.html', 'dist/mdwiki-editor.html'],
                dest: 'release/mdwiki-<%= grunt.config("pkg").version %>/'
            },
            release_debug: {
                expand: false,
                flatten: true,
                src: ['dist/mdwiki-debug.html', 'dist/mdwiki-editor-debug.html'],
                dest: 'release/mdwiki-<%= grunt.config("pkg").version %>/'
            },
            release_templates: {
                expand: true,
                flatten: true,
                src: ['release_templates/*'],
                dest: 'release/mdwiki-<%= grunt.config("pkg").version %>/'
            }
        },
        shell: {
            zip_release: {
                options: {
                    stdout: true
                },
                command: 'cd release && zip -r mdwiki-<%= grunt.config("pkg").version %>.zip mdwiki-<%= grunt.config("pkg").version %>'
            }
        },
        watch: {
            files: [
                'Gruntfile.js',
                'js/*.js',
                'js/**/*.js',
                'index.tmpl'
            ],
            tasks: ['devel'],
            options: {
                livereload: true,
            }
        },
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('index_slim', 'Generate slim mdwiki.html', function () {
        createOutput(grunt, 'index', 'slim');
    });
    grunt.registerTask('index_debug', 'Generate slim mdwiki.html with debugging', function () {
        createOutput(grunt, 'index', 'debug');
    });
    grunt.registerTask('editor_slim', 'Generate slim mdwiki-editor.html', function () {
        createOutput(grunt, 'editor', 'slim');
    });
    grunt.registerTask('editor_debug', 'Generate slim mdwiki-editor.html with debugging', function () {
        createOutput(grunt, 'editor', 'debug');
    });
    grunt.registerTask('release-slim', ['jshint', 'concat:dev', 'uglify:dist', 'index_slim', 'editor_slim']);
    grunt.registerTask('release-debug', ['jshint', 'concat:dev', 'index_debug', 'editor_debug']);

    grunt.registerTask('devel', ['release-debug', 'watch']);

    grunt.registerTask('release', [
        'release-slim', 'release-debug',
        'copy:release_slim', 'copy:release_debug', 'copy:release_templates',
        'shell:zip_release'
    ]);
    // Default task.
    grunt.registerTask('default',
        ['release-slim', 'release-debug']
    );

};
