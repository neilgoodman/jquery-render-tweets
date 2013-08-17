module.exports = function (grunt) {
    
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    base: 'spec/fixtures/json'
                }
            }
        },
        jasmine: {
            src : 'lib/jquery.render-tweets.js',
            options : {
                specs : 'spec/*spec.js',
                vendor: 'bower_components/jquery/jquery.js',
                helpers: 'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
                '--local-to-remote-url-access': true
            }
        },
        uglify: {
            main: {
                options: {
                    preserveComments: 'some'
                },
                files: {
                    'dist/jquery.render-tweets.min.js': 'lib/jquery.render-tweets.js'
                }
            }
        },
        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', 'build');
    grunt.registerTask('build', [ 'uglify' ]);
    grunt.registerTask('test', [ 'bower', 'connect', 'jasmine' ]);

};