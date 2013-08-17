"use strict";

jasmine.getJSONFixtures().fixturesPath = 'spec/fixtures/json/';

var tweetsJson,
    renderedResult = '<ul><li>RT <a href="//twitter.com/slashdot">@slashdot</a>: How Java 8’s Project Lambda could change your coding (SlashBI) <a href="https://t.co/6BMlhFvQtZ">https://t.co/6BMlhFvQtZ</a> test@email.com</li><li>New <a href="//twitter.com/search?q=%23blog&amp;src=hash">#blog</a> <a href="//twitter.com/search?q=%23post&amp;src=hash">#post</a>: connect-user-tweets Released on NPM <a href="http://t.co/Y7wey0TPkl">http://t.co/Y7wey0TPkl</a></li></ul>';

beforeEach(function () {
    jasmine.getFixtures().set('<div class="tweets"></div>');
    tweetsJson = getJSONFixture('tweets.json');
});

function htmlToJquery(html) {
    return $($.parseHTML('<div>' + html + '</div>'));
}

describe('jQuery plugin interface', function () {
    it('renderTweets plugin is defined on jQuery', function () {
        expect(jQuery.fn.renderTweets).toBeDefined();
    });

    it('renderTweets plugin can be applied to DOM', function () {
        $('.tweets').renderTweets({
            tweets: tweetsJson
        });

        expect($('.tweets').data('plugin_renderTweets')).toBeDefined();
    });

    it('renderTweets plugin methods are defined', function () {
        $('.tweets').renderTweets({
            tweets: tweetsJson
        });

        function refresh() {
            $('.tweets').renderTweets('refresh');
        }

        function render() {
            $('.tweets').renderTweets('render');
        }

        function parseTweet() {
            $.renderTweets.parseTweet();
        }

        expect(refresh).not.toThrow();
        expect(render).not.toThrow();
        expect(parseTweet).not.toThrow();
    });
});

describe('parseTweet method', function () {
    it('@name fields are parsed correctly', function () {
        var parsedTweet = $.renderTweets.parseTweet(tweetsJson[0].text);

        expect(htmlToJquery(parsedTweet)).toContainHtml('<a href="//twitter.com/slashdot">@slashdot</a>');
        expect(htmlToJquery(parsedTweet)).not.toContainHtml('<a href="//twitter.com/email">@email</a>');
        expect(htmlToJquery(parsedTweet)).not.toContainHtml('<a href="//twitter.com/emai">@emai</a>');
    });

    it('#tag fields are parsed correctly', function () {
        var parsedTweet = $.renderTweets.parseTweet(tweetsJson[1].text);

        expect(htmlToJquery(parsedTweet)).toContainHtml('<a href="//twitter.com/search?q=%23blog&amp;src=hash">#blog</a>');
        expect(htmlToJquery(parsedTweet)).not.toContainHtml('<a href="//twitter.com/search?q=%23post:&amp;src=hash">#post:</a>')
    });

    it('links are parsed correctly', function () {
        var parsedTweetOne = $.renderTweets.parseTweet(tweetsJson[0].text),
            parsedTweetTwo = $.renderTweets.parseTweet(tweetsJson[1].text);

        expect(htmlToJquery(parsedTweetOne)).toContainHtml('<a href="https://t.co/6BMlhFvQtZ">https://t.co/6BMlhFvQtZ</a>');
        expect(htmlToJquery(parsedTweetTwo)).toContainHtml('<a href="http://t.co/Y7wey0TPkl">http://t.co/Y7wey0TPkl</a>');
    });
});

describe('Tweet requests', function () {
    it('passing tweets directly', function () {
        $('.tweets').renderTweets({
            tweets: tweetsJson
        });

        expect($('.tweets')).toContainHtml(renderedResult);
    });

    it('passing callback', function () {
        var callbackCalled;
        runs(function () {
            $('.tweets').renderTweets({
                url: function (callback) {
                    callback(tweetsJson);
                    callbackCalled = true;
                }
            });
        });

        waitsFor(function () {
            return callbackCalled
        }, 'url callback was never called');

        runs(function () {
            expect($('.tweets')).toContainHtml(renderedResult);
        });
    });

    it('passing a url', function () {
        runs(function () {
            $('.tweets').renderTweets({
                url: 'http://localhost:8000/tweets.json'
            });
        });

        waitsFor(function () {
            return $('.tweets > ul li').length == 2;
        }, 'request for tweets never completed');

        runs(function () {
            expect($('.tweets')).toContainHtml(renderedResult);
        });
    });
});

describe('HTML rendering', function () {
    it('default template', function () {
        $('.tweets').renderTweets({
            tweets: tweetsJson
        });

        expect($('.tweets')).toContainHtml(renderedResult);
    });

    it('custom template', function () {
        var customHtml = '<p>hello, world</p>',
            customData;

        $('.tweets').renderTweets({
            tweets: tweetsJson,
            template: function (data) {
                customData = data;
                return customHtml;
            }
        });

        expect(customData).toBeDefined();
        expect(customData.tweets).toBeDefined();
        expect($('.tweets')).toContainHtml(customHtml);
    });
});

describe('Events', function () {
    it('render events', function () {
        var renderEventSpy = spyOnEvent('.tweets', 'render'),
            renderCompletedEventSpy = spyOnEvent('.tweets', 'renderCompleted');

        $('.tweets').renderTweets({
            tweets: tweetsJson
        });

        expect('render').toHaveBeenTriggeredOn('.tweets');
        expect('renderCompleted').toHaveBeenTriggeredOn('.tweets');
    });

    it('request events', function () {
        var renderEventSpy = spyOnEvent('.tweets', 'request'),
            renderCompletedEventSpy = spyOnEvent('.tweets', 'requestCompleted'),
            callbackCalled;

        runs(function () {
            $('.tweets').renderTweets({
                url: function (callback) {
                    callback(tweetsJson);
                    callbackCalled = true;
                }
            });
        });

        waitsFor(function () {
            return callbackCalled
        }, 'url callback was never called');

        runs(function () {
            expect('request').toHaveBeenTriggeredOn('.tweets');
            expect('requestCompleted').toHaveBeenTriggeredOn('.tweets');
        });
    });
});