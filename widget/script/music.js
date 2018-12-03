/**
 * 网易音乐API接口方法
 * 需要依赖api类
 * @author chitry@126.com
 *
 * http://neteasemusic.leanapp.cn/
 * 获取方式：GET
 * 参数：format=json或xml&calback=&from=webapp_music&method=以下不同的参数获得不同的数据
 * format根据开发需要可选择json或xmml，其他参数对应填入，calback是等于空的。
 *
 * 返回参数:
 * error_code:22000 代表成功！
 */

// var ApiURL = "http://musicapi4785.cloudapp.net:3000";
var ApiURL = "http://iqimeng.leanapp.cn";
var musicDetail = "http://music.163.com/api/playlist/detail?updateTime=-1&id=";

var method = "GET";
var dType = "json";


/**
 * 拼接请求地址和参数
 */
function neteaseMusicURL(params) {
    params = (params == undefined) ? "" : params;
    return ApiURL + params;
}

function player() {
    var audioPlayer = api.require('audioPlayer');
    audioPlayer.pause();
    audioPlayer.initPlayer({
        path: app.music_mp3,
        cache: false
    }, function(ret) {

        if (ret.status) {
            stoploading()
                // 存播放记录
            var datetime = Number(new Date())
            saveMlistDB(app.songid, app.songName, app.artists, app.music_img_min, datetime)　
            var duration = ret.duration;
            app.duration = ret.duration
            var dur = formatSeconds(duration);
            app.dur = dur
            audioPlayer.addEventListener({
                name: 'playing'
            }, function(ret, err) {
                app.cur = ret.current
                var percent = (app.cur / app.duration) * 100;
                app.per = Math.round(percent);
                app.current = formatSeconds(app.cur);
                app.audioCover()
                app.cur = ret.current
                var percent = (app.cur / app.duration) * 100;
                app.per = Math.round(percent);

                app.current = formatSeconds(app.cur);
                api.sendEvent({
                    name: 'per',
                    extra: {
                        per: app.per,
                        current: app.current
                    }
                });


            });

        }
    });
}



/**
 * 网易音乐接口对象
 */
function neteaseMusic() {


    this.send = function(doUrl, callback) { //发送远程请求
            if (typeof callback !== 'function') { //检查回调函数是否可用调用的
                callback = false;
            }
            api.ajax({
                url: doUrl,
                dataType: dType,
                // xhrFields: { withCredentials: true },
            }, function(ret, err) {
                // console.log(debug(arguments,"third"));
                // console.log("音乐API请求地址："+doUrl);
                // console.log("返回数据："+JSON.stringify(ret));
                // console.log("状态信息："+JSON.stringify(err));
                callback(ret, err); //回调
            });
        }
        // 获取音乐地址
    this.mp3 = function(id) {

        return 'http://music.163.com/song/media/outer/url?id=' + id + '.mp3'
    }
    this.getMusicInfo = function(id, callback) {
        var url1 = "http://music.163.com/api/song/detail/?id="
            // var url2="https://api.imjad.cn/cloudmusic/?type=detail&id="

        api.ajax({
            url: url1 + id + '&ids=[' + id + ']'
                // url:url2+id

        }, function(ret, err) {
            callback(ret, err);
        });
    }
    this.getartists = function(limit, callback) {


        api.ajax({
            // url: url1 + id+'&ids=['+id+']'
            url: musicApi + '/top/artists?offset=0&limit=' + limit

        }, function(ret, err) {
            callback(ret, err);
        });
    }
    this.isPlay = function(id, callback) {
        api.ajax({
            url: musicApi + '/check/music?id=' + id,

        }, function(ret, err) {
            callback(ret, err);
        });
    }
    this.play = function() {

        getCache('songCache', app.songid, function(ret, err) {
          if (ret.data&&ret.data!="") {

              app.music_mp3 = $api.strToJson(ret.data).mp3
                player()
            } else {
                player()
                songCache(app.songid, app.music_mp3)
            }
        })
    }




    //#########################  接口主要方法  ###########################################//


    this.search = function(query) { //百度音乐搜索接口
        // console.log(debug(arguments,"third"));
        return neteaseMusicURL("baidu.ting.search.catalogSug", "&query=" + query);
    }

    this.info = function(songid) { //百度音乐单曲详细信息接口(含播放链接地址)
        // console.log(debug(arguments,"third"));

        return neteaseMusicURL("/song/detail?ids=" + songid);
    }

    this.getmvlist = function() {
        return neteaseMusicURL('/mv/first?limit=6');
    }
    this.getartistlist = function(artistId) {
        return neteaseMusicURL('/artists?id=' + artistId);
    }
    this.getcatlist = function() {
        return neteaseMusicURL('/playlist/catlist');
    }

    this.lrc = function(songid) { //网易音乐歌词接口
        // console.log(debug(arguments,"third"));
        return neteaseMusicURL("/lyric?id=" + songid);
    }
    this.newsong = function() {
        return neteaseMusicURL('/personalized/newsong')
    }
    this.login = function() {
        return neteaseMusicURL('/login/cellphone?phone=18806519061&password=ruannan002')
    }
    this.getListDetail = function(lid, callback) { //获取歌单详情
        api.ajax({
            url: musicDetail + lid,
        }, function(ret, err) {
            callback(ret, err)
        });
    }
    this.getUserLikeLlistID = function(uid, callback) { //获取歌单详情
        api.ajax({
            url: musicApi + '/user/playlist?uid=' + uid,
        }, function(ret, err) {
            callback(ret, err)
        });
    }
    this.getmv = function(mvid, callback) {
            api.ajax({
                url: 'https://api.imjad.cn/cloudmusic/?type=mv&id=' + mvid,

            }, function(ret, err) {
                callback(ret, err)
            });
        }
        // 获取相似mv
    this.simi = function(mvid, callback) {
        api.ajax({
            url: ApiURL + '/simi/mv?mvid=' + mvid,
        }, function(ret, err) {
            callback(ret, err)
        });

    }


}


function listRecurSend(bm, ind, listRe, callback) { //递归发送多条请求以获取所有榜单数据
    ind++;
    //递归出口
    if (ind >= listAry.length) {
        if (typeof callback !== 'function') { //检查回调函数是否可用调用的
            callback = false;
        }
        callback(listRe); //回调
        return listRe;
    }
    var type = listAry[ind];
    bm.send(bm.list(type, 4, 0), function(ret, err) {
        ret.song_list[0].song_source = listName(type);
        ret.song_list[0].learn = type;
        //		console.log("递归打印："+JSON.stringify(ret.song_list));
        listRe.push(ret.song_list);
        listRecurSend(bm, ind, listRe, callback);
    });
}
// 获取相似mv

function getinfo() {
    var userinfo = $api.getStorage('userinfo')
    this.getDengLuInfo = function(dourl, callback) {
        if (typeof callback !== 'function') { //检查回调函数是否可用调用的
            callback = false;
        }
        $.ajax({
            url: musicApi + "/login/cellphone?phone=" + userinfo.nickname + "&password=" + userinfo.psw,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {

                var url = musicApi + dourl
                $.ajax({
                    url: url,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data1) {
                        callback(data1)
                            //  console.log(JSON.stringify(data1));
                            // app.listData = data.recommend
                            // $api.setStorage('listm', app.listData);
                            // stoploading()
                    },
                    error: function(err) {
                        console.log(JSON.stringify(err));
                        callback(data)
                    }
                })
            },
            error: function(err) {
                console.log(JSON.stringify(err))
            }
        })
    }


}

//#############################################  接口方法说明  #############################################//



function formatSeconds(value) {
    var theTime = parseInt(value);
    // 秒
    var theTime1 = 0;
    // 分
    var theTime2 = 0;
    // 小时 // alert(theTime);
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        // alert(theTime1+"-"+theTime);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "";
    if (result < 10) {
        var result = "0" + parseInt(theTime) + "";
        if (10 > theTime1 > 0) {
            result = "0" + parseInt(theTime1) + ":" + result;
        } else {
            result = "" + parseInt(theTime1) + ":" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + ":" + result;
        }
        return result;
    } else {
        if (10 > theTime1 > 0) {
            result = "0" + parseInt(theTime1) + ":" + result;
        } else {
            result = "" + parseInt(theTime1) + ":" + result;
        }
        if (theTime2 > 0) {
            result = "" + parseInt(theTime2) + ":" + result;
        }
        return result;
    }
}
// 缓存方法
function saveCache(dataName, key, data) {
      var data=$api.jsonToStr(data)
        api.writeFile({
            path: api.cacheDir +'/'+ dataName + key + '.json',
            data: data
        }, function(ret, err) {
        });

    // }

}

function getCache(dataName, key, callback) {
  alert(123)
        api.readFile({
            path: api.cacheDir+'/' + dataName + key + '.json',
        }, function(ret, err) {
          // console.log(JSON.stringify(ret.data));
            if (ret.status) {
                var data = {
                    data: ret.data,
                    code: 0
                }

                callback(data, err); //回调
            } else {
                callback(ret, err); //回调
            }
        });


    // }

}


function delCache(dataName, key) {

        api.writeFile({
            path: api.cacheDir +'/'+ dataName + key + '.json',
            data: null
        }, function(ret, err) {

        });


    // }
}
/////////////////歌曲缓存方法//////
function songCache(songid, url) {
    api.download({
        url: url,
        savePath: api.cacheDir + '/mp3/' + songid + '.mp3',
        report: true,
        cache: true,
        allowResume: true
    }, function(ret, err) {
        // console.log(JSON.stringify(ret));
        if (ret.state == 1) {
          var info={}
          info.mp3 = ret.savePath

            saveCache('songCache', songid, info)
        }
    });

}
