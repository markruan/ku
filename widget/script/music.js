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

var listAry = [1, 2, 11, 12, 16, 21, 22, 23, 24, 25];

function listName(type) { //获取榜单名称
    switch (type) {
        case 1:
            return '新歌榜';
        case 2:
            return '热歌榜';
        case 11:
            return '摇滚榜';
        case 12:
            return '爵士榜';
        case 16:
            return '流行音乐榜';
        case 21:
            return '欧美金曲榜';
        case 22:
            return '经典老歌榜';
        case 23:
            return '情歌榜';
        case 24:
            return '影视金曲榜';
        case 25:
            return '网络歌曲榜';
        default:
            return '非法索引！';
    }
}


/**
 * 网易音乐接口对象
 */
function neteaseMusic() {



    /**
     *  使用示例
     * 	var bm = new neteaseMusic();
     *  bm.send(bm.info(877578),function(ret,err){
    		zxx_netAudio(netAudio,ret.bitrate.file_link);
    	});
     */
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



    //#########################  接口主要方法  ###########################################//

    // this.slide = function(){//百度音乐幻灯片接口
    // 	return neteaseMusicURL("baidu.ting.plaza.getFocusPic","&from=android&version=2.4.0&format=json&limit=111");
    // }
    //
    // this.list = function(type,size,offset){//获取百度音乐排行榜单信息接口
    // 	console.log(debug(arguments,"third"));
    // 	type = (type == undefined)?1:type;//默认获取新歌榜
    // 	size = (size == undefined)?10:size;//默认10条
    // 	offset = (offset == undefined)?0:offset;//默认无偏移
    // 	return neteaseMusicURL("baidu.ting.billboard.billList","&type="+type+"&size="+size+"&offset="+offset);
    // }

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

    // this.mv = function(songid, callback) {
    //     api.ajax({
    //         url: "http://music.baidu.com/playmv/" + songid,
    //         dataType: 'html',
    //         data: {
    //             "songId": null,
    //             "title": "\u6211\u5bb3\u6015",
    //             "albumId": null,
    //             "albumTitle": null,
    //             "author": "\u859b\u4e4b\u8c26",
    //             "authorId": "2517",
    //             "time": null,
    //             "publishTime": null,
    //             "tvid": null,
    //             "vid": null,
    //             "resourceType": null,
    //             "relateStatus": null,
    //             "moduleName": "mvCover",
    //             "id": null,
    //             "delStatus": null
    //         }
    //     }, function(ret, err) {
    //         console.log("RES:" + JSON.stringify(ret) + "|" + JSON.stringify(err));
    //         callback(ret, err); //回调
    //     });
    // }
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
