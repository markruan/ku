/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
// 读写测试
function saveMlistDB(sid, name, artist, pic, date) {
    var db = api.require('db');
    db.openDatabase({
        name: 'test'
    }, function(ret, err) {
        if (ret.status) {
            db.executeSql({
                name: 'test',
                sql: 'CREATE TABLE IF NOT EXISTS mlist(mlist_id INT  AUTO_INCREMENT, mlist_sid INT(25),mlist_name varchar(255), mlist_artist varchar(255), mlist_pic varchar(255),mlist_date int(23),PRIMARY KEY ( mlist_id ))'
            }, function(ret, err) {
                if (ret.status) {
                    db.executeSql({
                        name: 'test',
                        sql: "INSERT INTO mlist (mlist_sid,mlist_name,mlist_artist,mlist_pic,mlist_date) VALUES ('" + sid + "', '" + name + "', '" + artist + "', '" + pic + "','" + date + "')",
                    }, function(ret, err) {
                        if (ret.status) {
                            //  alert(JSON.stringify(ret));
                        } else {
                            //  alert(JSON.stringify(err));
                        }
                    });

                } else {
                    //  alert(JSON.stringify(err));
                }
            });

        } else {
            alert(JSON.stringify(err));
        }
    });

}

function share(title, art, img, sid) {
    var data = {}
    data.title = title;
    data.art = art;
    data.img = img;

    api.ajax({
        url: 'https://api.imjad.cn/cloudmusic/?id=' + sid,

    }, function(ret, err) {
        if (ret.code = 200) {
            data.mp3 = ret.data[0].url
            api.openFrame({
                name: 'sing_share',
                url: '../../html/single_share_body.html',
                bgColor: 'rgba(0,0,0,0.1)',
                rect: {
                    x: 0,
                    y: 0,
                    w: api.winWidth,
                    h: api.winHeight
                },
                pageParam: {
                    data: data
                },
            });

        } else {
            api.toast({
                msg: '数据错误',
                duration: 2000,
                location: 'bottom'
            });

        }
    });


}

function login_winxin() {
    var wx = api.require('wx');
    var regTime = getNowFormatDate();
    uiloading();
    wx.isInstalled(function(ret, err) {
        if (ret.installed) {
            wx.auth({
                apiKey: ''
            }, function(ret, err) {
                if (ret.status) {
                    console.log(JSON.stringify(ret));
                    var code = ret.code
                    wx.getToken({
                        apiKey: '',
                        apiSecret: '',
                        code: code
                    }, function(ret, err) {
                        if (ret.status) {
                            var accessToken = ret.accessToken;
                            var openId = ret.openId
                            wx.getUserInfo({
                                accessToken: accessToken,
                                openId: openId
                            }, function(ret, err) {
                                if (ret.status) {
                                    var openid = ret.openid;
                                    var nickname = ret.nickname;
                                    var sex = ret.sex;
                                    var headimgurl = ret.headimgurl;
                                    api.ajax({
                                        url: hostUrl + '/weilog.php',
                                        method: 'post',
                                        data: {
                                            values: {
                                                openid: openid,
                                                nickname: nickname,
                                                headimgurl: headimgurl,
                                                regdate: regTime,
                                            },
                                        }
                                    }, function(ret, err) {

                                        stoploading();
                                        if (ret.status == 0) {

                                            api.toast({
                                                msg: ret.msg
                                            });
                                            $api.setStorage('userinfo', ret.userdata);

                                            api.sendEvent({
                                                name: 'updateuserinfo'
                                            });

                                            api.sendEvent({
                                                name: 'reg_login_successEvent',

                                            });
                                            api.closeWin({
                                                name: api.winName
                                            });

                                        } else if (ret.status == 1) {
                                            api.sendEvent({
                                                name: 'reg_login_successEvent',
                                                extra: {
                                                    user: nickname,
                                                }
                                            });
                                            var userdata = ret.userdata
                                            api.toast({
                                                msg: ret.msg
                                            });
                                            $api.setStorage('userinfo', userdata);
                                            api.setPrefs({
                                                key: 'user',
                                                value: nickname
                                            });
                                            api.sendEvent({
                                                name: 'updateuserinfo'
                                            });

                                            api.closeWin({
                                                name: api.winName
                                            });
                                        } else {
                                            api.toast({
                                                msg: ret.msg
                                            });

                                        }
                                    });
                                } else {
                                    alert(err.code);
                                }
                            });
                        } else {
                            alert(err.code);
                        }
                    });
                } else {
                    alert(err.code);
                }
            });
        } else {
            alert('当前设备未安装微信客户端');
        }
    });
}

function isOnLineStatus(callback) {
    var s = api.connectionType;
    s = s.toLowerCase();
    if (s == 'wifi' || s == '3g' || s == '4g' || s == '2g') {
        callback(true, s);
    } else {
        callback(false, s);
    }
}

function uiloading() {
    var activity = api.require('UILoading');
    activity.keyFrame({
        rect: {
            w: 70,
            h: 70
        },
        styles: {
            bg: 'rgba(14, 14, 14, 0.2)',
            corner: 5,
            interval: 90,
            frame: {
                w: 68,
                h: 68
            }
        },
        content: [{
            frame: 'widget://image/yin/1.png'
        }, {
            frame: 'widget://image/yin/2.png'
        }, {
            frame: 'widget://image/yin/3.png'
        }, {
            frame: 'widget://image/yin/4.png'
        }, {
            frame: 'widget://image/yin/5.png'
        }, {
            frame: 'widget://image/yin/6.png'
        }, {
            frame: 'widget://image/yin/7.png'
        }, {
            frame: 'widget://image/yin/8.png'
        }, {
            frame: 'widget://image/yin/9.png'
        }, {
            frame: 'widget://image/yin/10.png'
        }, {
            frame: 'widget://image/yin/11.png'
        }, {
            frame: 'widget://image/yin/12.png'
        }, {
            frame: 'widget://image/yin/13.png'
        }, {
            frame: 'widget://image/yin/14.png'
        }, {
            frame: 'widget://image/yin/15.png'
        }, {
            frame: 'widget://image/yin/16.png'
        }],
    }, function(ret) {
        //		alert(JSON.stringify(ret));
    });

    setTimeout(function() {
        stoploading();
        //		api.toast({
        //	        msg:'数据错误请重试'
        //      });
    }, 8000);

}

function stoploading() {
    var uiloading = api.require('UILoading');
    uiloading.closeKeyFrame();

}

function imageCache(url) { //图片缓存方法
    var path = url;
    api.imageCache({
        url: url,
    }, function(ret, err) {
        if (ret) {
            path = ret.url;
        }
    });
    return path;
}

(function(window) {
    superSearch='http://www.xggsj.com/api.php?types=search&name='
    searchSource='&source='
    hostUrl = 'http://api.iqimeng.com/ku/api';
    // musicApi = 'http://neteasemusic.leanapp.cn',
    musicApi = 'http://musicapi4785.cloudapp.net:3000',


    // musicApi='http://67.21.85.120:3000'
    // musicUrl = 'http://neteasemusic.leanapp.cn/playlist/detail?id=';
    musicUrl = 'http://musicapi4785.cloudapp.net:3000/playlist/detail?id=';

    // musicUrl='http://67.21.85.120:3000/playlist/detail?id='
    houZhui = '&updateTime=-1'
    songDetail='https://api.imjad.cn/cloudmusic/?id='

      // sUrl = 'http://s.music.163.com/search/get/?src=lofter&type=1&filterDj=true&limit=100&offset=0&callback&s='
    sUrl='https://api.imjad.cn/cloudmusic/?type=search&search_type=1&limit=50&s='
      sEnd = ''

    aUrl = 'http://music.163.com/api/song/detail/?id='
    shouUrl = 'http://api.iqimeng.com/m/addm.php'

    var u = {};
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function() {
        var ls = window.localStorage;
        if (isAndroid) {
            ls = os.localStorage();
        }
        return ls;
    };

    function parseArguments(url, data, fnSuc, dataType) {
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    }


    u.trim = function(str) {
        if (String.prototype.trim) {
            return str == null ? "" : String.prototype.trim.call(str);
        } else {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };
    u.trimAll = function(str) {
        return str.replace(/\s*/g, '');
    };
    u.isElement = function(obj) {
        return !!(obj && obj.nodeType == 1);
    };
    u.isArray = function(obj) {
        if (Array.isArray) {
            return Array.isArray(obj);
        } else {
            return obj instanceof Array;
        }
    };
    u.isEmptyObject = function(obj) {
        if (JSON.stringify(obj) === '{}') {
            return true;
        }
        return false;
    };
    u.addEvt = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.addEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.addEventListener) {
            el.addEventListener(name, fn, useCapture);
        }
    };
    u.rmEvt = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.removeEventListener) {
            el.removeEventListener(name, fn, useCapture);
        }
    };
    u.one = function(el, name, fn, useCapture) {
        if (!u.isElement(el)) {
            console.warn('$api.one Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        var that = this;
        var cb = function() {
            fn && fn();
            that.rmEvt(el, name, cb, useCapture);
        };
        that.addEvt(el, name, cb, useCapture);
    };
    u.dom = function(el, selector) {
        if (arguments.length === 1 && typeof arguments[0] == 'string') {
            if (document.querySelector) {
                return document.querySelector(arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (el.querySelector) {
                return el.querySelector(selector);
            }
        }
    };
    u.domAll = function(el, selector) {
        if (arguments.length === 1 && typeof arguments[0] == 'string') {
            if (document.querySelectorAll) {
                return document.querySelectorAll(arguments[0]);
            }
        } else if (arguments.length === 2) {
            if (el.querySelectorAll) {
                return el.querySelectorAll(selector);
            }
        }
    };
    u.byId = function(id) {
        return document.getElementById(id);
    };
    u.first = function(el, selector) {
        if (arguments.length === 1) {
            if (!u.isElement(el)) {
                console.warn('$api.first Function need el param, el param must be DOM Element');
                return;
            }
            return el.children[0];
        }
        if (arguments.length === 2) {
            return this.dom(el, selector + ':first-child');
        }
    };
    u.last = function(el, selector) {
        if (arguments.length === 1) {
            if (!u.isElement(el)) {
                console.warn('$api.last Function need el param, el param must be DOM Element');
                return;
            }
            var children = el.children;
            return children[children.length - 1];
        }
        if (arguments.length === 2) {
            return this.dom(el, selector + ':last-child');
        }
    };
    u.eq = function(el, index) {
        return this.dom(el, ':nth-child(' + index + ')');
    };
    u.not = function(el, selector) {
        return this.domAll(el, ':not(' + selector + ')');
    };
    u.prev = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.prev Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.previousSibling;
        if (node.nodeType && node.nodeType === 3) {
            node = node.previousSibling;
            return node;
        }
    };
    u.next = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.next Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.nextSibling;
        if (node.nodeType && node.nodeType === 3) {
            node = node.nextSibling;
            return node;
        }
    };
    u.closest = function(el, selector) {
        if (!u.isElement(el)) {
            console.warn('$api.closest Function need el param, el param must be DOM Element');
            return;
        }
        var doms, targetDom;
        var isSame = function(doms, el) {
            var i = 0,
                len = doms.length;
            for (i; i < len; i++) {
                if (doms[i].isEqualNode(el)) {
                    return doms[i];
                }
            }
            return false;
        };
        var traversal = function(el, selector) {
            doms = u.domAll(el.parentNode, selector);
            targetDom = isSame(doms, el);
            while (!targetDom) {
                el = el.parentNode;
                if (el != null && el.nodeType == el.DOCUMENT_NODE) {
                    return false;
                }
                traversal(el, selector);
            }

            return targetDom;
        };

        return traversal(el, selector);
    };
    u.contains = function(parent, el) {
        var mark = false;
        if (el === parent) {
            mark = true;
            return mark;
        } else {
            do {
                el = el.parentNode;
                if (el === parent) {
                    mark = true;
                    return mark;
                }
            } while (el === document.body || el === document.documentElement);

            return mark;
        }

    };
    u.remove = function(el) {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    };
    u.attr = function(el, name, value) {
        if (!u.isElement(el)) {
            console.warn('$api.attr Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length == 2) {
            return el.getAttribute(name);
        } else if (arguments.length == 3) {
            el.setAttribute(name, value);
            return el;
        }
    };
    u.removeAttr = function(el, name) {
        if (!u.isElement(el)) {
            console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 2) {
            el.removeAttribute(name);
        }
    };
    u.hasCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.hasCls Function need el param, el param must be DOM Element');
            return;
        }
        if (el.className.indexOf(cls) > -1) {
            return true;
        } else {
            return false;
        }
    };
    u.addCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.addCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.add(cls);
        } else {
            var preCls = el.className;
            var newCls = preCls + ' ' + cls;
            el.className = newCls;
        }
        return el;
    };
    u.removeCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.removeCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.remove(cls);
        } else {
            var preCls = el.className;
            var newCls = preCls.replace(cls, '');
            el.className = newCls;
        }
        return el;
    };
    u.toggleCls = function(el, cls) {
        if (!u.isElement(el)) {
            console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
            return;
        }
        if ('classList' in el) {
            el.classList.toggle(cls);
        } else {
            if (u.hasCls(el, cls)) {
                u.removeCls(el, cls);
            } else {
                u.addCls(el, cls);
            }
        }
        return el;
    };
    u.val = function(el, val) {
        if (!u.isElement(el)) {
            console.warn('$api.val Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            switch (el.tagName) {
                case 'SELECT':
                    var value = el.options[el.selectedIndex].value;
                    return value;
                    break;
                case 'INPUT':
                    return el.value;
                    break;
                case 'TEXTAREA':
                    return el.value;
                    break;
            }
        }
        if (arguments.length === 2) {
            switch (el.tagName) {
                case 'SELECT':
                    el.options[el.selectedIndex].value = val;
                    return el;
                    break;
                case 'INPUT':
                    el.value = val;
                    return el;
                    break;
                case 'TEXTAREA':
                    el.value = val;
                    return el;
                    break;
            }
        }

    };
    u.prepend = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.prepend Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterbegin', html);
        return el;
    };
    u.append = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.append Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforeend', html);
        return el;
    };
    u.before = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.before Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforebegin', html);
        return el;
    };
    u.after = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.after Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterend', html);
        return el;
    };
    u.html = function(el, html) {
        if (!u.isElement(el)) {
            console.warn('$api.html Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            return el.innerHTML;
        } else if (arguments.length === 2) {
            el.innerHTML = html;
            return el;
        }
    };
    u.text = function(el, txt) {
        if (!u.isElement(el)) {
            console.warn('$api.text Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 1) {
            return el.textContent;
        } else if (arguments.length === 2) {
            el.textContent = txt;
            return el;
        }
    };
    u.offset = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.offset Function need el param, el param must be DOM Element');
            return;
        }
        var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        var rect = el.getBoundingClientRect();
        return {
            l: rect.left + sl,
            t: rect.top + st,
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    };
    u.css = function(el, css) {
        if (!u.isElement(el)) {
            console.warn('$api.css Function need el param, el param must be DOM Element');
            return;
        }
        if (typeof css == 'string' && css.indexOf(':') > 0) {
            el.style && (el.style.cssText += ';' + css);
        }
    };
    u.cssVal = function(el, prop) {
        if (!u.isElement(el)) {
            console.warn('$api.cssVal Function need el param, el param must be DOM Element');
            return;
        }
        if (arguments.length === 2) {
            var computedStyle = window.getComputedStyle(el, null);
            return computedStyle.getPropertyValue(prop);
        }
    };
    u.jsonToStr = function(json) {
        if (typeof json === 'object') {
            return JSON && JSON.stringify(json);
        }
    };
    u.strToJson = function(str) {
        if (typeof str === 'string') {
            return JSON && JSON.parse(str);
        }
    };
    u.setStorage = function(key, value) {
        if (arguments.length === 2) {
            var v = value;
            if (typeof v == 'object') {
                v = JSON.stringify(v);
                v = 'obj-' + v;
            } else {
                v = 'str-' + v;
            }
            var ls = uzStorage();
            if (ls) {
                ls.setItem(key, v);
            }
        }
    };
    u.getStorage = function(key) {
        var ls = uzStorage();
        if (ls) {
            var v = ls.getItem(key);
            if (!v) {
                return;
            }
            if (v.indexOf('obj-') === 0) {
                v = v.slice(4);
                return JSON.parse(v);
            } else if (v.indexOf('str-') === 0) {
                return v.slice(4);
            }
        }
    };
    u.rmStorage = function(key) {
        var ls = uzStorage();
        if (ls && key) {
            ls.removeItem(key);
        }
    };
    u.clearStorage = function() {
        var ls = uzStorage();
        if (ls) {
            ls.clear();
        }
    };

    /*by king*/
    u.fixIos7Bar = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
            return;
        }
        var strDM = api.systemType;
        if (strDM == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV, 10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                el.style.paddingTop = '20px';
            }
        }
    };
    u.fixStatusBar = function(el) {
        if (!u.isElement(el)) {
            console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
            return;
        }
        var sysType = api.systemType;
        if (sysType == 'ios') {
            u.fixIos7Bar(el);
        } else if (sysType == 'android') {
            var ver = api.systemVersion;
            ver = parseFloat(ver);
            if (ver >= 4.4) {
                el.style.paddingTop = '25px';
            }
        }
    };
    u.toast = function(title, text, time) {
        var opts = {};
        var show = function(opts, time) {
            api.showProgress(opts);
            setTimeout(function() {
                api.hideProgress();
            }, time);
        };
        if (arguments.length === 1) {
            var time = time || 500;
            if (typeof title === 'number') {
                time = title;
            } else {
                opts.title = title + '';
            }
            show(opts, time);
        } else if (arguments.length === 2) {
            var time = time || 500;
            var text = text;
            if (typeof text === "number") {
                var tmp = text;
                time = tmp;
                text = null;
            }
            if (title) {
                opts.title = title;
            }
            if (text) {
                opts.text = text;
            }
            show(opts, time);
        }
        if (title) {
            opts.title = title;
        }
        if (text) {
            opts.text = text;
        }
        time = time || 500;
        show(opts, time);
    };
    u.post = function( /*url,data,fnSuc,dataType*/ ) {
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        argsToJson.data && (json.data = argsToJson.data);
        if (argsToJson.dataType) {
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text' || type == 'json') {
                json.dataType = type;
            }
        } else {
            json.dataType = 'json';
        }
        json.method = 'post';
        api.ajax(json, function(ret, err) {
            if (ret) {
                fnSuc && fnSuc(ret);
            }
        });
    };
    u.get = function( /*url,fnSuc,dataType*/ ) {
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        //argsToJson.data && (json.data = argsToJson.data);
        if (argsToJson.dataType) {
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text' || type == 'json') {
                json.dataType = type;
            }
        } else {
            json.dataType = 'text';
        }
        json.method = 'get';
        api.ajax(json, function(ret, err) {
            if (ret) {
                fnSuc && fnSuc(ret);
            }
        });
    };

    /*end*/

    window.$api = u;

})(window);

function panduan() {
    if (!$api.getStorage('userinfo')) {
        api.toast({
            msg: '请先登陆'
        });
        return false;
    } else {

        return true;
    }

}

function kaifa() {
    api.toast({
        msg: '开发中...'
    });

}

function closeT() {
    api.openWin({
        name: 'slidLayout',
        animation: {
            type: "movein", //动画类型（详见动画类型常量）
            subType: "from_left", //动画子类型（详见动画子类型常量）
            duration: 400 //动画过渡时间，默认300毫秒
        },
    })
    api.closeSlidPane();

}
function imageCache(url) { //图片缓存方法
    var path = url;
    api.imageCache({
        url: url,
    }, function(ret, err) {
        if (ret) {
            path = ret.url;
        }
    });
    return path;
}
// 语言包
  var yuyan
  yuyan={
    jingxuan:'精选',
    quanzi:'圈子',
    yinyue:'音乐',
    gengduo:'更多',
    paihang:'排行',
    liuxing:'流行',
    meirituijian:'每日推荐',
    oumei:'欧美',
    qingyinyue:'轻音乐',
    fenxiang:'分享',
    xiazai:'下载',
    bofangliebao:'播放列表',
    wodezhuye:'我的主页',
    wodeshoucang:'我的收藏',
    shezhi:'设置',
    guanyuwomen:'关于我们',
    yijianfankui:'意见反馈'
  }
// 公共函数
//状态栏歌曲播放监听
function notify(title,content,extra,updateCurrent){
    updateCurrent = updateCurrent?updateCurrent:true;
    api.notification({
        sound:'',
        notify: {
            title:title,                //标题，默认值为应用名称，只Android有效
            content:content,               //内容，默认值为'有新消息'
            extra:extra,                  //传递给通知的数据，在通知被点击后，该数据将通过监听函数回调给网页
            updateCurrent: updateCurrent    //是否覆盖更新已有的通知，取值范围true|false。只Android有效
        }
    }, function(ret, err) {
        return ret.id;
    });
}
