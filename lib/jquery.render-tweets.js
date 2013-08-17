/*!
 * A jQuery plugin that renders tweets in Twitter API JSON format to HTML.
 * Author: Neil Goodman (http://neilgoodman.net)
 * v0.1.0
 * Licensed under the MIT license
 */

;+function ($) {
    "use strict";

    var pluginName = 'renderTweets',
        defaults = {
            template: function (data) {
                var result = '<ul>';

                if (data.tweets.length) {
                    for (var i = 0; i < data.tweets.length; i++) {
                        result += '<li>' + $[pluginName].parseTweet(data.tweets[i].text) + '</li>';
                    }
                }
                else {
                    result += '<li>Loading...</li>';
                }

                result += '</ul>';
                return result;
            },
            tweets: null,
            url: null
        };

    function RenderTweets(element, options) {
        this.element = element;
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    RenderTweets.prototype = {
        init: function () {
            this.render();
            this.refresh();
        },

        render: function () {
            var tweets = this.settings.tweets || [],
                data = { tweets: tweets },
                rendered = $($.parseHTML(this.settings.template(data)));

            this.$element.trigger('render', rendered);

            this
                .$element
                .empty()
                .append(rendered);

            this.$element.trigger('renderCompleted', rendered);
        },

        refresh: function () {
            if (!this.settings.url) {
                return;
            }

            var self = this,
                success = function (data) {
                    self.$element.trigger('requestCompleted', data);
                    self.settings.tweets = data;
                    self.render();
                },
                request;

            if (typeof this.settings.url == 'string') {
                request = $.get(this.settings.url, success, 'json');
            }
            else if (typeof this.settings.url == 'function') {
                request = this.settings.url(success);
            }

            this.$element.trigger('request', request);
        },

        remove: function () {
            this.
                $element
                .empty()
                .removeData('plugin_' +  pluginName);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function() {
            var data = $.data(this, 'plugin_' + pluginName);

            if (!data && typeof options != 'string') {
                data = $.data(this, 'plugin_' + pluginName, new RenderTweets(this, options));
            }

            if (data && typeof options == 'string') {
                data[options].apply(data, Array.prototype.slice(arguments, 1));
            }
        });
    };

    $[pluginName] = {
        parseTweet: function (tweet) {
            if (!tweet) {
                return '';
            }

            // Patterns were adapted from the following sources
            // Username pattern: http://stackoverflow.com/questions/4424179/how-to-validate-a-twitter-username-using-regex
            // Hashtag pattern: http://stackoverflow.com/questions/7534665/the-best-regex-to-parse-twitter-hashtags-and-users
            var userNamePattern = /@([A-Za-z0-9_]{1,15})(?![.\w]+)/gi,
                linkPattern = /((http|https):\/\/[\w.\/]+)/gi,
                hashtagPattern = /#{1}([\w\d]{1,140})/gi;

            tweet = tweet.replace(linkPattern, '<a href="$1">$&</a>');
            tweet = tweet.replace(hashtagPattern, '<a href="//twitter.com/search?q=%23$1&amp;src=hash">$&</a>');
            tweet = tweet.replace(userNamePattern, '<a href="//twitter.com/$1">$&</a>');

            return tweet;
        }
    };

}(jQuery);