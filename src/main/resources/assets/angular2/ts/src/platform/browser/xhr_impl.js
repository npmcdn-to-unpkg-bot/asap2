System.register(['angular2/src/facade/promise', 'angular2/src/facade/lang', 'angular2/src/compiler/xhr'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var promise_1, lang_1, xhr_1;
    var XHRImpl;
    return {
        setters:[
            function (promise_1_1) {
                promise_1 = promise_1_1;
            },
            function (lang_1_1) {
                lang_1 = lang_1_1;
            },
            function (xhr_1_1) {
                xhr_1 = xhr_1_1;
            }],
        execute: function() {
            XHRImpl = (function (_super) {
                __extends(XHRImpl, _super);
                function XHRImpl() {
                    _super.apply(this, arguments);
                }
                XHRImpl.prototype.get = function (url) {
                    var completer = promise_1.PromiseWrapper.completer();
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.responseType = 'text';
                    xhr.onload = function () {
                        // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                        // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                        var response = lang_1.isPresent(xhr.response) ? xhr.response : xhr.responseText;
                        // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                        var status = xhr.status === 1223 ? 204 : xhr.status;
                        // fix status code when it is 0 (0 status is undocumented).
                        // Occurs when accessing file resources or on Android 4.1 stock browser
                        // while retrieving files from application cache.
                        if (status === 0) {
                            status = response ? 200 : 0;
                        }
                        if (200 <= status && status <= 300) {
                            completer.resolve(response);
                        }
                        else {
                            completer.reject("Failed to load " + url, null);
                        }
                    };
                    xhr.onerror = function () { completer.reject("Failed to load " + url, null); };
                    xhr.send();
                    return completer.promise;
                };
                return XHRImpl;
            })(xhr_1.XHR);
            exports_1("XHRImpl", XHRImpl);
        }
    }
});
//# sourceMappingURL=xhr_impl.js.map