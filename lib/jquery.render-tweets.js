/*!
 * A jQuery plugin that renders tweets in Twitter API JSON format to HTML.
 * Original author: Neil Goodman (http://neilgoodman.net)
 * Licensed under the MIT license
 */

;!(function ($) {
    "use strict";

    var pluginName = 'renderTweets',
        defaults = {
            template: function (data) {
                var result = '<ul>';

                if (data.tweets.length) {
                    for (var i = 0; i < data.tweets.length; i++) {
                        result += '<li>' + $.fn[pluginName].parseTweet(tweet.text) + '</li>';
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
                rendered = $.parseHTML(this.settings.template(data));

            this.$element.trigger('render', rendered);

            this
                .$element
                .empty()
                .append(this.renderTemplate());

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
                .removeData(plugin_' + pluginName');
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function() {
            var data = $.data(this, 'plugin_' + pluginName),
                method = typeof options == 'string' ? options : '',
                options = typeof options == 'string' ? {} : options;

            if (!data) {
                data = $.data(this, 'plugin_' + pluginName, new RenderTweets(this, options));
            }

            if (method) {
                data[method].apply(data, Array.prototype.slice(arguments, 1));
            }
        });
    };

    $.fn[pluginName].parseTweets = function (tweet) {
        var userNamePattern = /@([^" ]+)/gi,
            linkPattern = /((http|https):\/\/[^" ]+)/gi,
            hashtagPattern = /#([^" ]+)/gi;

        tweet = tweet.replace(linkPattern, '<a target="_blank" href="$1">$&</a>');
        tweet = tweet.replace(hashtagPattern, '<a target="_blank" href="//twitter.com/search?q=%23$1&amp;src=hash">$&</a>');
        tweet = tweet.replace(userNamePattern, '<a target="_blank" href="//twitter.com/$1">$&</a>');

        return tweet;
    };

})(jQuery);