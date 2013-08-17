module.exports = function (grunt) {
    
    grunt.initConfig({
        jasmine: {
            src : 'lib/jquery.render-tweets.js',
            options : {
                specs : 'spec/*spec.js',
                vendor: 'bower_components/jquery/jquery.js',
                helpers: 'bower_components/lib/jasmine-jquery.js'
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

    grunt.registerTask('default', 'build');
    grunt.registerTask('build', [ 'uglify' ]);
    grunt.registerTask('test', [ 'bower', 'jasmine' ]);

};