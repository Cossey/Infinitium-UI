import { f7 } from "framework7-vue";
import store from '../js/store';

export default {
    serializeObject(object, ignoreProperties) {
        var ignoreProps = [];
        if (typeof ignoreProperties !== 'undefined') {
            ignoreProps = ignoreProperties;
        }

        var propList = Object.keys(object);

        var serialized = "";
        for (var i = 0; i < propList.length; i++) {
            if (ignoreProps.includes(propList[i])) {
                continue;
            }

            var val = object[propList[i]];
            if (typeof val === 'object' && val != null) {
                var objPropsList = Object.keys(val);
                for (var op = 0; op < objPropsList.length; op++) {

                    var propName = objPropsList[op];
                    propName = propList[i] + propName.charAt(0).toUpperCase() + propName.slice(1);

                    serialized += propName + "=" + encodeURIComponent(val[objPropsList[op]]) + "&";
                }
            } else {
                serialized += encodeURIComponent(propList[i]) + "=";
                if (Array.isArray(val)) {
                    var valConcat = "";
                    for (var a = 0; a < val.length; a++) {
                        valConcat += val[a] + ",";
                    }
                    if (valConcat.endsWith(",")) {
                        valConcat = valConcat.slice(0, -1);
                    }
                    serialized += encodeURIComponent(valConcat);
                } else {
                    if (val != null) {
                        serialized += encodeURIComponent(val);
                    }
                }
                serialized += "&";
            }
        }
        if (serialized.endsWith("&")) {
            serialized = serialized.slice(0, -1);
        }

        return serialized;
    },
    serializeParams(object, ignoreProperties) {
        var ignoreProps = [];
        if (typeof ignoreProperties !== 'undefined') {
            ignoreProps = ignoreProperties;
        }

        var propList = Object.keys(object);

        var serialArray = [];
        for (var i = 0; i < propList.length; i++) {
            if (ignoreProps.includes(propList[i])) {
                continue;
            }

            var val = object[propList[i]];
            if (typeof val === 'object' && val != null) {
                console.log("val and not not null");
                if (Array.isArray(val)) {
                    console.log("Array.isArray(val)");
                    var valConcat = "";
                    for (var b = 0; b < val.length; b++) {
                        valConcat += val[b] + ",";
                    }
                    if (valConcat.endsWith(",")) {
                        valConcat = valConcat.slice(0, -1);
                    }
                    serialArray.push([
                        propList[i], valConcat
                    ]);
                } else {
                    var objPropsList = Object.keys(val);
                    for (var op = 0; op < objPropsList.length; op++) {

                        var propName = objPropsList[op];
                        propName = propList[i] + propName.charAt(0).toUpperCase() + propName.slice(1);

                        serialArray.push([
                            propName, val[objPropsList[op]]
                        ]);
                    }
                }
            } else {
                if (Array.isArray(val)) {
                    console.log("Array.isArray(val)");
                    var valConcat = "";
                    for (var a = 0; a < val.length; a++) {
                        valConcat += val[a] + ",";
                    }
                    if (valConcat.endsWith(",")) {
                        valConcat = valConcat.slice(0, -1);
                    }
                    serialArray.push([
                        propList[i], valConcat
                    ]);
                } else {
                    serialArray.push([
                        propList[i], val == null ? "" : val
                    ]);
                }
            }
        }

        return serialArray;
    },
    getRetry() {
        if (store.state.retryRequest !== null) {
            var rr = store.state.retryRequest;
            store.dispatch('setRetryRequest', null);
            this.get(rr.verb, rr.params, rr.resolve, rr.reject);
        }
    },
    buildUrl(verb, params) {
        var token = store.state.token;
        var url = 'api/' + verb + "?";
        if (params != null && params.length > 0) {
            params.forEach(function (item) {
                url += item[0] + "=" + encodeURIComponent(item[1]) + "&";
            });
        }
        url += "token=" + encodeURIComponent(token);
        return url;
    },
    downloadLog(fileName) {
        var token = store.state.token;

        var verb = '/log/' + fileName + '?';
        verb += "token=" + encodeURIComponent(token);
        location.replace(verb);
    },
    getLog(fileName) {
        var token = store.state.token;

        var verb = '/log/' + fileName + '?';
        var params = [
            ["limit", 2]
        ];
        if (params != null && params.length > 0) {
            params.forEach(function (item) {
                verb += item[0] + "=" + encodeURIComponent(item[1]) + "&";
            });
        }
        verb += "token=" + encodeURIComponent(token);

        return new Promise(function (resolve, reject) {
            console.log("GETLOGFILE: ", verb);
            f7.request.get(verb, (res) => {
                resolve(res);
            });
        });
    },
    get2retry() {
        store.state.failedRequests.all();
    },
    get2(verb, params) {
        var token = store.state.token;

        var promise = new Promise(function (resolve, reject) {
            var request = {
                url: url,
                method: 'GET',
                timeout: 8000,
                dataType: 'json',
            }

            f7.request(request).then(function (res) {
                switch (res.data.status) {
                    case 'ok':
                        resolve(res.data.response);
                        return;
                    case 'error':
                        reject(Error(res.data.errorMessage));
                        f7.dialog.alert(res.data.errorMessage, "Error");
                        return;
                    case 'invalid-token':
                        store.dispatch('addFailedRequest', promise);
                        doInitialLogin();


                    // f7.once("loggedIn")
                    // var ls = f7.loginScreen.create({ el: '#my-login-screen' });
                    //     var retry = {
                    //         'verb': verb,
                    //         'params': params,
                    //         'resolve': resolve,
                    //         'reject': reject
                    //     }
                    //     store.dispatch('setRetryRequest', retry);
                    //     ls.open();
                    //     break;
                }
            }, function (err) {

            });


        });
        return promise;
    },
    post(verb, params, data) {
        var self = this;

        var promise = new Promise(function (resolve, reject) {
            var url = self.buildUrl(verb, params);

            var request = {
                url: url,
                method: 'POST',
                timeout: 8000,
                dataType: 'application/json',
                data: data,
                contentType: 'application/x-www-form-urlencoded',
                processData: false,
            }

            f7.request(request).then(function (result) {
                var res = JSON.parse(result.data);
                switch (res.status) {
                    case 'ok':
                        resolve(res.response);
                        return;
                    case 'error':
                        reject(Error(res.errorMessage));
                        f7.dialog.alert(res.errorMessage, "Error");
                        return;
                    case 'invalid-token':
                        store.dispatch('addFailedRequest', promise);
                        doInitialLogin();
                }
            });
        });
        return promise;
    },
    get(verb, params, pResolve, pReject) {
        var token = store.state.token;
        var self = this;
        return new Promise(function (resolve, reject) {
            if (token == "") {
                var ls = f7.loginScreen.create({ el: '#my-login-screen' });
                var retry = {
                    'verb': verb,
                    'params': params,
                    'resolve': resolve,
                    'reject': reject
                }
                store.dispatch('setRetryRequest', retry);
                ls.open();
            } else {
                var url = self.buildUrl(verb, params);
                console.log("REQUEST: ", url);


                f7.request.get(url, (res) => {
                    var data = JSON.parse(res);
                    switch (data.status) {
                        case 'ok':
                            resolve(data.response);
                            if (typeof pResolve !== 'undefined') pResolve(data.response);
                            break;
                        case 'error':
                            f7.dialog.alert(data.errorMessage, 'Error')
                            reject(Error(data.errorMessage));
                            if (typeof pReject !== 'undefined') pReject(data.errorMessage);
                            break;
                        case 'invalid-token':
                            var ls = f7.loginScreen.create({ el: '#my-login-screen' });
                            var retry = {
                                'verb': verb,
                                'params': params,
                                'resolve': resolve,
                                'reject': reject
                            }
                            store.dispatch('setRetryRequest', retry);
                            ls.open();
                            break;
                    }
                });
            }
        });
    },
    doLogin(user, pass) {
        f7.preloader.show();
        f7.request.get('api/login?user=' + encodeURIComponent(user) + '&pass=' + encodeURIComponent(pass)).then((res) => {
            f7.preloader.hide();
            var data = JSON.parse(res.data);
            if (data.status == "error") {
                f7.dialog.alert(data.errorMessage, 'Login');
            } else {
                f7.store.dispatch('token', data.token);
                f7.store.dispatch('user', user);
                this.get("getDnsSettings").then((res) => {
                    f7.store.dispatch('domain', res.dnsServerDomain);
                });
                this.getRetry();
                f7.loginScreen.close();
            }
        });
    },
    doInitialLogin() {
        var token = store.state.token;
        if (token == "") {
            var ls = f7.loginScreen.create({ el: '#my-login-screen' });
            ls.open();
        }
    },
    doLogout() {
        this.get("logout").then((data) => {
            f7.store.dispatch('token', "");
            f7.store.dispatch('user', "");
            this.doInitialLogin();
        });
    },
    delete(verb, apiKey, arrKey, val, array) {
        this.get("delete" + verb, [[apiKey, val]]).then((data) => {
            this.deleteArray(array, arrKey, val);
        });
    },
    deleteArray(array, prop, val) {
        const itemToRemoveIndex = array.findIndex(function (item) {
            return item[prop] === val;
        });
        // proceed to remove an item only if it exists.
        if (itemToRemoveIndex !== -1) {
            array.splice(itemToRemoveIndex, 1);
        }
    },
    buildPieChart(data) {
        var datasets = [];
        if (data.labels.length > 0) {
            for (var i = 0; i < data.labels.length; i++) {
                if (data.datasets[0].data[i] == 0) {
                    continue;
                }
                datasets.push({
                    'label': data.labels[i],
                    'value': data.datasets[0].data[i],
                    'color': data.datasets[0].backgroundColor[i]
                });
            }
        }
        return datasets;
    }
}