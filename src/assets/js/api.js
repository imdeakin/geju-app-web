/**
 * Created by Deakin on 2017/4/21 0021.
 */
(function () {
    var api = {
        // 配置
        config: {
            server: "",
            root: "",
            imgRoot: "",
            // 接口路径配置
            paths: {},
            fields: {
                code: "",
                msg: "",
                success: "",
                data: ""
            }
        },
        getFullImgPath: function ($this, path) {
            if (!path) return '';
            return $this.config.server + $this.config.imgRoot + '/' + path.replace(/^\//, '');
        },
        /**
         * 判断一个对象是不是JSON对象
         * @param obj 被判断的对象
         * @param arrayAlso {boolean} 是否将数组也认为是JSON,默认true
         * @returns {boolean}
         */
        isJson: function (obj, arrayAlso) {
            if (this.isArray(obj) && !(arrayAlso === false)) return true;
            var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
            return isjson;
        },
        /**
         * 判断一个对象是否是数组类型
         * @param obj
         * @returns {boolean}
         */
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]'
        },
        /**
         * 获取url参数部分全部内容
         * @param {String}  被取参数的url,可选，默认为location.href;
         * @returns {JSON} 返回"?"之后的数据
         */
        getURLParams: function (url) {
            if (!url) url = location.href;
            var param = url.replace(/(.*\?)/, '').replace(/#.*/, ''),
                paramArray = param ? param.split('&') : [],
                keyValue = "",
                json = "";
            console.log(param);
            for (var i = 0; i < paramArray.length; i++) {
                var keyValueArray = paramArray[i].split('='),
                    newText = '"' + keyValueArray[0] + '"' + ":" + '"' + keyValueArray[1] + '"';
                keyValue = keyValue == "" ? newText : keyValue + "," + newText;
            }
            if (keyValue != "" && keyValue != ":")
                json == "" ? json = keyValue : json = json + "," + keyValue;
            json = "{" + json + "}";
            return JSON.parse(json);
        },
        /**
         * json对象合并扩展
         * extend(
         *   {...}, // 必须 首个对象会被扩展
         *   {...}，// 必须
         *   [,...] // 不限个
         *   [,true] // 是否深扩展 默认true
         * );
         * @returns {*} // 扩展后的json
         */
        extend: function () {
            var beforArg, afterArg,
                max = arguments.length - 1, deep = true;

            if (max < 0) return;

            if (typeof arguments[arguments.length - 1] === "boolean") {
                --max;
                deep = true;
            }

            if (max < 0) return arguments[0];

            var result = arguments[0];

            for (var i = max; i > 0; i--) {
                beforArg = arguments[i - 1];
                afterArg = arguments[i];
                if (!(this.isJson(beforArg) && this.isJson(afterArg))) continue;

                for (var key in afterArg) {
                    if (typeof afterArg[key] === "undefined")  continue;

                    if (this.isJson(beforArg[key]) && this.isJson(afterArg[key]) && deep) {
                        beforArg[key] = this.extend({}, beforArg[key], afterArg[key]);
                    } else {
                        beforArg[key] = afterArg[key];
                    }
                }

                result = arguments[0] = beforArg;
            }
            return result;
        },
        /**
         * 执行基本ajax请求,返回XMLHttpRequest
         *  Ajax.request({
         *  url
         *  async 是否异步 true(默认)
         *  method 请求方式 POST or GET(默认)
         *  data 请求参数 (键值对字符串)
         *  success 请求成功后响应函数，参数为xhr
         *  error 请求失败后响应函数，参数为xhr
         *  });
         */
        ajax: function () {
            function request(options) {
                function fn() {
                }

                var defaults = {
                        url: "",
                        async: true,
                        type: "GET",
                        dataType: "json",
                        data: "",
                        success: fn,
                        error: fn,
                        complete: fn
                    }, opt = this.extend({}, defaults, options),
                    url = opt.url,
                    async = opt.async, method = opt.type, data = opt.data, dataType = opt.dataType.toLowerCase(),
                    dealData = function (data) {
                        if (dataType === 'json') {
                            try {
                                return JSON.parse(data);
                            } catch (err) {
                                return data;
                            }
                        } else {
                            return data;
                        }
                    },
                    success = function (xhr) {
                        var data = dealData(xhr.responseText);
                        opt.success(data);
                        opt.complete(xhr);
                    },
                    error = function (xhr) {
                        opt.failure(xhr);
                        opt.complete(xhr);
                    };
                method = method.toUpperCase();
                if (method == 'GET' && data) {
                    var args = "";
                    if (typeof data == 'string') {
                        //alert("string")
                        args = data;
                    } else if (typeof data == 'object') {
                        //alert("object")
                        var arr = new Array();
                        for (var k in data) {
                            var v = data[k];
                            arr.push(k + "=" + v);
                        }
                        args = arr.join("&");
                    }
                    url += (url.indexOf('?') == -1 ? '?' : '&') + args;
                    data = null;
                }
                var xhr = window.XMLHttpRequest ? new XMLHttpRequest()
                    : new ActiveXObject('Microsoft.XMLHTTP');
                xhr.onreadystatechange = function () {
                    _onStateChange(xhr, success, error);
                };
                xhr.open(method, url, async);
                if (method == 'POST') {
                    xhr.setRequestHeader('Content-type',
                        'application/x-www-form-urlencoded;');
                }
                xhr.send(data);
                return xhr;
            }

            function _onStateChange(xhr, success, failure) {
                if (xhr.readyState == 4) {
                    var s = xhr.status;
                    if (s >= 200 && s < 300) {
                        success(xhr);
                    } else {
                        failure(xhr);
                    }
                } else {
                }
            }

            return request;
        }(),
        // 接口调用
        request: function (options) {
            var defaults = {
                    api: '', //接口
                    data: '', //数据
                    type: 'POST', //请求方式
                    dataType: 'json', //请求数据类型
                    fullData: false, //调用成功传入数据时，是否传入原始数据
                    alertError: true, //调用失败时，是否弹出错误信息
                    onlySuccess: false, //调用成功后，是否无论返回成功，都调用success回调函数
                    success: null, //调用成功，接口返回成功时回调
                    failure: null, //调用成功，接口的返回失败时回调
                    complete: null, //调用完成后都回调
                    error: null, //请求出错时回调
                    async: true, //是否同步
                    loading: true, //是否开启加载层
                    lock: '', //开始请求时锁住，请求完成后解锁，用于防止重复请求
                }, setting = this.extend({}, defaults, options),
                api = setting['api'],
                data = setting['data'],
                type = setting['type'],
                dataType = setting['dataType'],
                fullData = setting['fullData'],
                alertError = setting['alertError'],
                onlySuccess = setting['onlySuccess'],
                success = setting['success'],
                failure = setting['failure'],
                complete = setting['complete'],
                error = setting['error'],
                async = setting['async'],
                loading = setting['loading'],
                fields = this.config.fields;
            // lockTarget = document.querySelectorAll(setting['lock']);
            // if(!lockTarget.length) lockTarget = null;
            //防止重复请求
            // if (lockTarget && lockTarget.isDisable()) return;

            // if (loading) var idx = layer.load(2);
            var ajaxSuccess = function (data) {
                    // 这里根据实际数据来调整
                    if (!onlySuccess && !data[fields.success]) {
                        // 接口返回失败
                        // alertError && layer.msg(data[fields.msg]);
                        failure && failure(data);
                        return;
                    }

                    //接口返回成功 把数据传递过去
                    success && success(fullData ? data : data[fields.data]);
                },
                ajaxFailure = function (xhr) {
                    console.error("Api Error: " + xhr.responseURL);
                    console.error("Error Info: " + xhr.statusText);
                    error && error();
                },
                ajaxComplete = function () {
                    // loading && layer.close(idx); //关闭加载窗
                    complete && complete();
                };
            this.ajax({
                url: api,
                async: async,
                data: data,
                type: type,
                dataType: dataType,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: ajaxSuccess,
                failure: ajaxFailure,
                complete: ajaxComplete
            });
        }
    };
    window.Api = function (config) {
        api.config = api.extend({}, api.config, config);

        api.config.server = api.config.server.replace(/\/$/, '');
        api.config.root = '/' + api.config.root.replace(/^\/|\/$/, '');
        api.config.imgRoot = '/' + api.config.imgRoot.replace(/^\/|\/$/, '');

        if (config.paths) {
            var root = api.config.server + api.config.root;
            for (var key in config.paths) {
                var path = '/' + config.paths[key].replace(/^\//, '');
                api.config.paths[key] = root + path;
            }
        }

        return api;
    };
})();

window.api = new Api({
    server: window.location.protocol + '//' + window.location.host, // 'https://geju.gzyueyun.com'
    root: "/xhapi/xhapi",
    imgRoot: "/xhapi",
    // 接口路径配置
    paths: {
        getMyAssociations: "/AssociationController/getMyAssociations.hn",
        countNotice: "/MessageController/countNotice.hn",
        wechatShare: "/ShareController/share.hn", // shareType: 0 分享协会 , 1 分享公告, 2 分享直播
        getServiceTerms: "/ProtocolController/getArtice.hn"
    },
    fields: {
        code: "code",
        msg: "wp_error_msg",
        success: "success",
        data: "root"
    }
});

export default api;