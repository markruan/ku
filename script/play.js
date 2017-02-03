function play_c(mp3, cover, songName, artists, current) {
	var pdd = $api.byId('playerIcon');

	api.sendEvent({
		name : 'playing'
	});
	api.showProgress({
		style : 'default',
		animationType : 'fade',
		title : '努力加载中...',
		//  text: '先喝杯茶...',
		modal : false
	});

	var audioPlayer = api.require('audioPlayer');
	audioPlayer.stop();
	audioPlayer.initPlayer({
		path : mp3
	}, function(ret) {
		if (ret.status) {
			api.hideProgress();
			//			console.log(JSON.stringify(ret))
			var duration = ret.duration;
			$api.setStorage('duration', duration);
			audioPlayer.addEventListener({
				name : "state"
			}, function(ret) {
				if (ret.state == 'finished') {
					playNext_b()
					api.toast({
						msg : '播放完毕'
					});
				} else {

				}
			});
			audioPlayer.addEventListener({
				name : "playing"
			}, function(ret) {
				//				console.log(JSON.stringify(ret));
				current = ret.current
				var tii = duration * 10;
				//				console.log(JSON.stringify(current))
				var percent = (current / duration) * 100;
				var per = Math.round(percent);
				var dur = formatSeconds(duration);
				var cur = formatSeconds(current);
				audioCover(cover, duration, songName, artists, per)
				var uislider = api.require('UISlider');
				uislider.setValue({
					id : 1,
					value : {

						value : percent
					}
				});

				strmiao = '<span class="s H-float-left   H-padding-horizontal-left-5 H-padding-vertical-top-10" style="font-size: 1.1rem; ">' + cur + '</span>  <span class="e H-float-right   H-padding-horizontal-right-5 H-padding-vertical-top-10" style="font-size: 1.1rem; ">' + dur + '</span> ';
				$api.byId('slider').innerHTML = strmiao;
			});

		}
	});

}

function getCurrent() {
	var audioPlayer = api.require('audioPlayer');
	audioPlayer.getCurrent(function(ret) {
		var current = ret.current

		return current
	});
}

function getCache(pic) {
	api.imageCache({
		url : pic
	}, function(ret, err) {
		if (ret) {
			albumC = ret.url;
			$api.setStorage('uulr', albumC);
			api.setPrefs({
				key : 'apic',
				value : albumC
			});
		} else {
		}
	});
	$api.rmStorage('album')
}

function pause() {
	var pdd = $api.byId('playerIcon');
	$api.removeCls(pdd, 'icon-zanting');
	$api.addCls(pdd, 'icon-bofang');
	api.getPrefs({
		key : 'isPlaying'
	}, function(ret, err) {
		if (ret.value == 1) {
		}
	});
	var netAudio = api.require('audio');
	netAudio.pause();
}

function stop() {
	api.getPrefs({
		key : 'isPlaying'
	}, function(ret, err) {
		if (ret.value == 1) {
		}
	});
	var obj = api.require('audio');
	obj.stop();
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

function kai() {
	api.toast({
		msg : '正在开发中...'
	});
}

function quXiaoShouCang() {

	api.getPrefs({
		key : 'songid2'
	}, function(ret, err) {
		sid = ret.value

		api.ajax({
			url : hostUrl + '/quxiao.php',
			method : 'post',
			cache : false,
			timeout : 30,
			dataType : 'text',
			data : {
				values : {
					uid : $api.getStorage('userinfo').data_id,
					sid : sid,

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

function shouCang() {
	if (!$api.getStorage('userinfo')) {
		api.toast({
			msg : '先登陆'
		});
		return
	}
	music = $api.getStorage('kee');
	//	var userIcon = $api.getStorage('usericon');

	var bb = music.url;
	var artists = music.art;
	var songName = music.name;
	var albumpic = music.pic;
	var sid = music.sid

	api.getPrefs({
		key : 'user'
	}, function(ret, err) {
		user = ret.value
	});

	api.ajax({
		url : hostUrl + '/mylist.php',
		method : 'post',
		cache : false,
		timeout : 30,
		dataType : 'text',
		data : {
			values : {
				sid : sid,
				//					username : user,
				uid : $api.getStorage('userinfo').data_id
			}
		}
	}, function(ret, err) {

		if (ret == 1) {

			api.ajax({
				url : hostUrl + '/addm.php',
				method : 'post',
				cache : true,
				timeout : 30,
				dataType : 'json',
				data : {
					values : {
						mp3 : bb,
						artist : artists,
						title : songName,
						poster : albumpic,
						user : user,
						uid : $api.getStorage('userinfo').data_id,
						background : albumpic,
						cover : albumpic,
						sid : sid
					}
				}
			}, function(ret, err) {

			});

			api.toast({
				msg : '收藏成功'
			});
		} else if (ret == 2) {

			api.confirm({
				title : '取消收藏',
				msg : '亲，要取消吗？',
				buttons : ['确定', '取消']
			}, function(ret, err) {
				if (ret.buttonIndex == 1) {
					quXiaoShouCang()
				} else {

				}
			});

		} else {
			api.toast({
				msg : '收藏失败'
			});
		}
		//coding...
	});
	////////////////

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
				api.confirm({
					title : "提示",
					msg : "您需要如何选择自己的头像？",
					buttons : ["现在照", "相册选", "取消"]
				}, function(ret, err) {
					//定义图片来源类型
					var sourceType;
					if (1 == ret.buttonIndex) {/* 打开相机*/
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
					title : "提示",
					msg : "您当前正在使用" + line_type + "网络，建议您在wifi网络下使用，是否继续？",
					buttons : ["继续", "取消"]
				}, function(ret, err) {
					var sourceType;
					if (1 == ret.buttonIndex) {
						api.confirm({
							title : "提示",
							msg : "您需要如何选择自己的头像？",
							buttons : ["现在照", "相册选", "取消"]
						}, function(ret, err) {
							//定义图片来源类型
							var sourceType;
							if (1 == ret.buttonIndex) {/* 打开相机*/
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
				msg : '请连接网络后使用当前功能~'
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
			sourceType : sourceType,
			encodingType : 'png',
			mediaValue : 'pic',
			//返回数据类型，指定返回图片地址或图片经过base64编码后的字符串
			//base64:指定返回数据为base64编码后内容,url:指定返回数据为选取的图片地址
			destinationType : 'url',
			//是否可以选择图片后进行编辑，支持iOS及部分安卓手机
			allowEdit : false,
			//图片质量，只针对jpg格式图片（0-100整数）,默认值：50
			quality : q,
			//                targetWidth : 100,
			//                targetHeight : 1280,
			saveToPhotoAlbum : true
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
		name : 'tu',
		scrollToTop : true,
		allowEdit : true,
		url : '../tu.html',
		rect : {
			x : 0,
			y : 0,
			w : api.winWidth,
			h : api.winHeight,
		},
		animation : {
			type : "reveal", //动画类型（详见动画类型常量）
			subType : "from_right", //动画子类型（详见动画子类型常量）
			duration : 300
		},
		pageParam : {
			img_src : img_src
		},
		vScrollBarEnabled : false,
		hScrollBarEnabled : false,
		//页面是否弹动 为了下拉刷新使用
		bounces : false
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

function audioCover(cover, duration, songName, artists, per) {
	var objj = api.require('audioCover');
	//	var uul = $api.getStorage('uulr');

	var msg = {
		totalTime : duration,
		cover : cover,
		progress : per,
		audio : songName,
		author : artists,
	}
	objj.set(msg, function(ret, err) {
		if (ret.eventType == 'pause') {
			//			pause();
			play();
		} else if (ret.eventType == 'next') {
			stop();
			playNext_b()
		} else if (ret.eventType == 'previous') {
			stop();
			prev_b()
		} else if (ret.eventType == 'play') {
			//			play()
			pause();
		} else {
		}
	});
}

//function stopAll() {
//	var mPause = 'stop()'
//	api.execScript({
//
//		frameName : 'quan_index',
//		script : mPause
//	});
//	api.execScript({
//
//		frameName : 'tui_index',
//		script : mPause
//	});
//
//}

//function changP() {
//	var icon = $api.byId('playerIcon');
//	$api.toggleCls(icon, 'icon-play');
//}

function imageCache(url) {//图片缓存方法
	var path = url;
	api.imageCache({
		url : url,
	}, function(ret, err) {
		if (ret) {
			path = ret.url;
		}
	});
	return path;
}