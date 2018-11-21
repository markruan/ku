
function play_c() {
    // uiloading();
    var audioPlayer = api.require('audioPlayer');
    audioPlayer.stop();
    audioPlayer.initPlayer({
        path: app.music_mp3,
        cache: false
    }, function(ret) {
        // console.log(ret.status);
        if (ret.status) {
            stoploading()
            var duration = ret.duration;
            app.duration = ret.duration
            var dur = formatSeconds(duration);
            app.dur = dur
                // console.log(app.dur);
            audioPlayer.addEventListener({
                name: "state"
            }, function(ret) {
                // console.log(ret.state);
                if (ret.state == 'finished'||ret.state=='error') {
                    if (app.isRepeat) {
                        app.replay();
                        return
                    } else {
                        // 恢复圈子里的播放图标
                        // var jsfun = 'allPlayicon()';
                        // api.execScript({
                        //     name: 'index',
                        //     frameName: 'quanzi',
                        //     script: jsfun
                        // });

                        app.playNext()

                    }
                } else if (ret.state == 'paused' || ret.state == 'idle') {
                    app.playState = false

                }else if (ret.state == 'buffering') {
                    app.playState = false

                    // api.execScript({
                    //     name: 'index',
                    //     script: 'buffering();'
                    // });

                }
            });
            audioPlayer.addEventListener({
                name: "playing"
            }, function(ret) {
                app.isPlaying = true
                api.sendEvent({
                    name: 'playing',
                    extra: {
                        songName: app.music_title,
                        artists: app.music_artist,
                        mp3: app.music_mp3,
                    }
                });

                app.cur = ret.current
                    // var tii = duration * 10;

                var percent = (app.cur / app.duration) * 100;
                app.per = Math.round(percent);

                app.current = formatSeconds(app.cur);



                // 歌词显示
                getLyrics(app.lyric, app.current, function(i) {

                    $api.text($api.byId("zxx-lyric"), app.lyric[i].split(']')[1]);
                });
                audioCover(duration)
                    // 状态栏显示
                    // console.log($api.getStorage('notify'));
                if($api.getStorage('notify')&&$api.getStorage('notify')==1){
                  notify(app.music_title + '-' + app.music_artist, app.current + '-' + app.dur)

                }else{
                  // 取消状态栏通知

                  api.cancelNotification({id:-1});
                }

                app.playState = true
                // 滑块设置
                var uislider = api.require('UISlider');
                uislider.setValue({
                    id: 1,
                    value: {
                        value: percent
                    }
                });
             });
        } else {
            stoploading()

            app.playNext()

        }
    });

}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
}

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


function quXiaoShouCang() {
   api.getPrefs({
        key: 'songid2'
    }, function(ret, err) {
        sid = ret.value

        api.ajax({
            url: hostUrl + '/quxiao.php',
            method: 'post',
            cache: false,
            timeout: 30,
            dataType: 'text',
            data: {
                values: {
                    uid: $api.getStorage('userinfo').data_id,
                    sid: sid,

                }
            }
        }, function(ret, err) {
            if (ret == 1) {
                alert('成功')

            } else {
                alert('失败')
            }
        });
    });
}

function shouCang(sid, user, musicUrl, artists, songName, albumpic) {
    if (!$api.getStorage('userinfo')) {
        api.toast({
            msg: '先登陆'
        });
        return
    }

    api.ajax({
        url: hostUrl + '/mylist.php',
        method: 'post',
        cache: false,
        timeout: 30,
        dataType: 'text',
        data: {
            values: {
                sid: sid,
                uid: $api.getStorage('userinfo').data_id
            }
        }
    }, function(ret, err) {
        if (ret == 1) {
            api.ajax({
                url: hostUrl + '/addm.php',
                method: 'post',
                cache: true,
                timeout: 30,
                dataType: 'json',
                data: {
                    values: {
                        mp3: musicUrl,
                        artist: artists,
                        title: songName,
                        poster: albumpic,
                        user: user,
                        uid: $api.getStorage('userinfo').data_id,
                        background: albumpic,
                        cover: albumpic,
                        sid: sid
                            //							usericon: userIcon
                    }
                }
            }, function(ret, err) {
                //coding...
            });
            api.toast({
                msg: '收藏成功'
            });
        } else if (ret == 2) {
            api.confirm({
                title: '取消收藏',
                msg: '亲，要取消吗？',
                buttons: ['确定', '取消']
            }, function(ret, err) {
                if (ret.buttonIndex == 1) {
                    quXiaoShouCang(sid)
                } else {}
            });
        } else {
            api.toast({
                msg: '收藏失败'
            });
        }
        //coding...
    });
    ////////////////
}

function quXiaoShouCang(sid) {
    var uid = $api.getStorage('userinfo').data_id
    api.ajax({
        url: hostUrl + '/quxiao.php?uid=' + uid + '&sid=' + sid,

        timeout: 30,

    }, function(ret, err) {
        api.toast({
            msg: ret.msg
        });
    });
}

/**
 * 获取头像
 * 周枫
 * 2016.1.16
 */
function getPicture() {
    isOnLineStatus(function(is_true, line_type) {
        if (is_true) {
            if (line_type == 'wifi' || line_type == '4g') {

                api.actionSheet({
                    //					title : "您需要如何选择自己的头像？",
                    buttons: ["现在照", "相册选"]
                }, function(ret, err) {
                    //定义图片来源类型
                    var sourceType;
                    if (1 == ret.buttonIndex) { /* 打开相机*/
                        sourceType = "camera";
                        openPicture(sourceType);
                    } else if (2 == ret.buttonIndex) {
                        sourceType = "album";
                        openPicture(sourceType);
                    } else {
                        return;
                    }
                });
            } else {
                api.confirm({
                    title: "提示",
                    msg: "您当前正在使用" + line_type + "网络，建议您在wifi网络下使用，是否继续？",
                    buttons: ["继续", "取消"]
                }, function(ret, err) {
                    var sourceType;
                    if (1 == ret.buttonIndex) {

                        api.actionSheet({
                            title: "您需要如何选择自己的头像？",
                            //							msg : "您需要如何选择自己的头像？",
                            buttons: ["现在照", "相册选"]
                        }, function(ret, err) {
                            //定义图片来源类型
                            var sourceType;
                            if (1 == ret.buttonIndex) { /* 打开相机*/
                                sourceType = "camera";
                                openPicture(sourceType);
                            } else if (2 == ret.buttonIndex) {
                                sourceType = "album";
                                openPicture(sourceType);
                            } else {
                                return;
                            }
                        });
                    } else {
                        return;
                    }
                });
            }
        } else {
            api.toast({
                msg: '请连接网络后使用当前功能~'
            });
        }
    });
}

// 选取图片

function openPicture(sourceType) {
    isOnLineStatus(function(is_true, line_type) {
        var q = 100;
        if (line_type == 'wifi') {
            q = 100;
        }
        //获取一张图片
        api.getPicture({
            sourceType: sourceType,
            encodingType: 'png',
            mediaValue: 'pic',
            //返回数据类型，指定返回图片地址或图片经过base64编码后的字符串
            //base64:指定返回数据为base64编码后内容,url:指定返回数据为选取的图片地址
            destinationType: 'url',
            //是否可以选择图片后进行编辑，支持iOS及部分安卓手机
            allowEdit: false,
            //图片质量，只针对jpg格式图片（0-100整数）,默认值：50
            quality: q,
            //                targetWidth : 100,
            //                targetHeight : 1280,
            saveToPhotoAlbum: true
        }, function(ret, err) {
            if (ret) {
                /*
                 * data:"",                //图片路径
                 base64Data:"",          //base64数据，destinationType为base64时返回
                 */
                var img_url = ret.data;
                if (img_url != "") {
                    //打开裁剪frame
                    openImageClipFrame(img_url);
                }
            }
        });
    });
}

function openImageClipFrame(img_src) {
    api.openFrame({
        name: 'tu',
        scrollToTop: true,
        allowEdit: true,
        url: '../tu.html',
        rect: {
            x: 0,
            y: 0,
            w: api.winWidth,
            h: api.winHeight,
        },
        animation: {
            type: "reveal", //动画类型（详见动画类型常量）
            subType: "from_right", //动画子类型（详见动画子类型常量）
            duration: 300
        },
        pageParam: {
            img_src: img_src
        },
        vScrollBarEnabled: false,
        hScrollBarEnabled: false,
        //页面是否弹动 为了下拉刷新使用
        bounces: false
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

function audioCover() {
    var objj = api.require('audioCover');
    var msg = {
        totalTime: app.duration,
        cover: app.music_imgurl,
        progress: app.per,
        audio: app.music_title,
        author: app.music_artist,
    }
    objj.set(msg, function(ret, err) {
        if (ret.eventType == 'pause') {
            //			pause();
            app.replay()
        } else if (ret.eventType == 'next') {
            app.stop();
            app.playNext()
        } else if (ret.eventType == 'previous') {
            app.stop();
            app.playBack()
        } else if (ret.eventType == 'play') {
            //			play()
            app.isPlaying = false
            app.pause();
        } else {}
    });
}



function openComm(sid, type) {
    if (!$api.getStorage('userinfo')) {
        api.toast({
            msg: '请先登陆'
        });
        return
    }
    api.openWin({
        name: 'comm',
        url: '../../html/music/comm/head.html',
        opaque: true,
        vScrollBarEnabled: false,
        pageParam: {
            type: type,
            sid: sid
        }
    });
}
