System.register(['angular2/src/platform/dom/dom_adapter', 'angular2/core'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var dom_adapter_1, core_1;
    var PlatformLocation;
    return {
        setters:[
            function (dom_adapter_1_1) {
                dom_adapter_1 = dom_adapter_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /**
             * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
             * This class should not be used directly by an application developer. Instead, use
             * {@link Location}.
             */
            PlatformLocation = (function () {
                function PlatformLocation() {
                    this._init();
                }
                // This is moved to its own method so that `MockPlatformLocationStrategy` can overwrite it
                /** @internal */
                PlatformLocation.prototype._init = function () {
                    this._location = dom_adapter_1.DOM.getLocation();
                    this._history = dom_adapter_1.DOM.getHistory();
                };
                PlatformLocation.prototype.getBaseHrefFromDOM = function () { return dom_adapter_1.DOM.getBaseHref(); };
                PlatformLocation.prototype.onPopState = function (fn) {
                    dom_adapter_1.DOM.getGlobalEventTarget('window').addEventListener('popstate', fn, false);
                };
                PlatformLocation.prototype.onHashChange = function (fn) {
                    dom_adapter_1.DOM.getGlobalEventTarget('window').addEventListener('hashchange', fn, false);
                };
                Object.defineProperty(PlatformLocation.prototype, "pathname", {
                    get: function () { return this._location.pathname; },
                    set: function (newPath) { this._location.pathname = newPath; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlatformLocation.prototype, "search", {
                    get: function () { return this._location.search; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PlatformLocation.prototype, "hash", {
                    get: function () { return this._location.hash; },
                    enumerable: true,
                    configurable: true
                });
                PlatformLocation.prototype.pushState = function (state, title, url) {
                    this._history.pushState(state, title, url);
                };
                PlatformLocation.prototype.replaceState = function (state, title, url) {
                    this._history.replaceState(state, title, url);
                };
                PlatformLocation.prototype.forward = function () { this._history.forward(); };
                PlatformLocation.prototype.back = function () { this._history.back(); };
                PlatformLocation = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], PlatformLocation);
                return PlatformLocation;
            })();
            exports_1("PlatformLocation", PlatformLocation);
        }
    }
});
//# sourceMappingURL=platform_location.js.map