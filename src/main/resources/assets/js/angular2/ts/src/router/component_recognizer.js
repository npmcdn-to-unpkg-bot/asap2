System.register(['angular2/src/facade/lang', 'angular2/src/facade/exceptions', 'angular2/src/facade/collection', 'angular2/src/facade/async', './route_recognizer', './route_config_impl', './async_route_handler', './sync_route_handler'], function(exports_1) {
    var lang_1, exceptions_1, collection_1, async_1, route_recognizer_1, route_config_impl_1, async_route_handler_1, sync_route_handler_1;
    var ComponentRecognizer;
    return {
        setters:[
            function (lang_1_1) {
                lang_1 = lang_1_1;
            },
            function (exceptions_1_1) {
                exceptions_1 = exceptions_1_1;
            },
            function (collection_1_1) {
                collection_1 = collection_1_1;
            },
            function (async_1_1) {
                async_1 = async_1_1;
            },
            function (route_recognizer_1_1) {
                route_recognizer_1 = route_recognizer_1_1;
            },
            function (route_config_impl_1_1) {
                route_config_impl_1 = route_config_impl_1_1;
            },
            function (async_route_handler_1_1) {
                async_route_handler_1 = async_route_handler_1_1;
            },
            function (sync_route_handler_1_1) {
                sync_route_handler_1 = sync_route_handler_1_1;
            }],
        execute: function() {
            /**
             * `ComponentRecognizer` is responsible for recognizing routes for a single component.
             * It is consumed by `RouteRegistry`, which knows how to recognize an entire hierarchy of
             * components.
             */
            ComponentRecognizer = (function () {
                function ComponentRecognizer() {
                    this.names = new collection_1.Map();
                    // map from name to recognizer
                    this.auxNames = new collection_1.Map();
                    // map from starting path to recognizer
                    this.auxRoutes = new collection_1.Map();
                    // TODO: optimize this into a trie
                    this.matchers = [];
                    this.defaultRoute = null;
                }
                /**
                 * returns whether or not the config is terminal
                 */
                ComponentRecognizer.prototype.config = function (config) {
                    var handler;
                    if (lang_1.isPresent(config.name) && config.name[0].toUpperCase() != config.name[0]) {
                        var suggestedName = config.name[0].toUpperCase() + config.name.substring(1);
                        throw new exceptions_1.BaseException("Route \"" + config.path + "\" with name \"" + config.name + "\" does not begin with an uppercase letter. Route names should be CamelCase like \"" + suggestedName + "\".");
                    }
                    if (config instanceof route_config_impl_1.AuxRoute) {
                        handler = new sync_route_handler_1.SyncRouteHandler(config.component, config.data);
                        var path = config.path.startsWith('/') ? config.path.substring(1) : config.path;
                        var recognizer = new route_recognizer_1.RouteRecognizer(config.path, handler);
                        this.auxRoutes.set(path, recognizer);
                        if (lang_1.isPresent(config.name)) {
                            this.auxNames.set(config.name, recognizer);
                        }
                        return recognizer.terminal;
                    }
                    var useAsDefault = false;
                    if (config instanceof route_config_impl_1.Redirect) {
                        var redirector = new route_recognizer_1.RedirectRecognizer(config.path, config.redirectTo);
                        this._assertNoHashCollision(redirector.hash, config.path);
                        this.matchers.push(redirector);
                        return true;
                    }
                    if (config instanceof route_config_impl_1.Route) {
                        handler = new sync_route_handler_1.SyncRouteHandler(config.component, config.data);
                        useAsDefault = lang_1.isPresent(config.useAsDefault) && config.useAsDefault;
                    }
                    else if (config instanceof route_config_impl_1.AsyncRoute) {
                        handler = new async_route_handler_1.AsyncRouteHandler(config.loader, config.data);
                        useAsDefault = lang_1.isPresent(config.useAsDefault) && config.useAsDefault;
                    }
                    var recognizer = new route_recognizer_1.RouteRecognizer(config.path, handler);
                    this._assertNoHashCollision(recognizer.hash, config.path);
                    if (useAsDefault) {
                        if (lang_1.isPresent(this.defaultRoute)) {
                            throw new exceptions_1.BaseException("Only one route can be default");
                        }
                        this.defaultRoute = recognizer;
                    }
                    this.matchers.push(recognizer);
                    if (lang_1.isPresent(config.name)) {
                        this.names.set(config.name, recognizer);
                    }
                    return recognizer.terminal;
                };
                ComponentRecognizer.prototype._assertNoHashCollision = function (hash, path) {
                    this.matchers.forEach(function (matcher) {
                        if (hash == matcher.hash) {
                            throw new exceptions_1.BaseException("Configuration '" + path + "' conflicts with existing route '" + matcher.path + "'");
                        }
                    });
                };
                /**
                 * Given a URL, returns a list of `RouteMatch`es, which are partial recognitions for some route.
                 */
                ComponentRecognizer.prototype.recognize = function (urlParse) {
                    var solutions = [];
                    this.matchers.forEach(function (routeRecognizer) {
                        var pathMatch = routeRecognizer.recognize(urlParse);
                        if (lang_1.isPresent(pathMatch)) {
                            solutions.push(pathMatch);
                        }
                    });
                    return solutions;
                };
                ComponentRecognizer.prototype.recognizeAuxiliary = function (urlParse) {
                    var routeRecognizer = this.auxRoutes.get(urlParse.path);
                    if (lang_1.isPresent(routeRecognizer)) {
                        return [routeRecognizer.recognize(urlParse)];
                    }
                    return [async_1.PromiseWrapper.resolve(null)];
                };
                ComponentRecognizer.prototype.hasRoute = function (name) { return this.names.has(name); };
                ComponentRecognizer.prototype.componentLoaded = function (name) {
                    return this.hasRoute(name) && lang_1.isPresent(this.names.get(name).handler.componentType);
                };
                ComponentRecognizer.prototype.loadComponent = function (name) {
                    return this.names.get(name).handler.resolveComponentType();
                };
                ComponentRecognizer.prototype.generate = function (name, params) {
                    var pathRecognizer = this.names.get(name);
                    if (lang_1.isBlank(pathRecognizer)) {
                        return null;
                    }
                    return pathRecognizer.generate(params);
                };
                ComponentRecognizer.prototype.generateAuxiliary = function (name, params) {
                    var pathRecognizer = this.auxNames.get(name);
                    if (lang_1.isBlank(pathRecognizer)) {
                        return null;
                    }
                    return pathRecognizer.generate(params);
                };
                return ComponentRecognizer;
            })();
            exports_1("ComponentRecognizer", ComponentRecognizer);
        }
    }
});
//# sourceMappingURL=component_recognizer.js.map