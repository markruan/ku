function switchplay(button, mp3) {
	var click = button.getAttribute("data-click");
	if (click == 0) {
		// 点开
		var dd = document.getElementsByClassName('icon-zanting');
		for ( i = 0; i < dd.length; i++) {
			$api.attr(dd[i], 'class', 'iconfont  icon-bofang H-theme-font-color-white');
		}
		button.setAttribute("data-click", 1);
		//		pauseAll()
		var audio = api.require('audioPlayer');
		audio.stop();
		play(mp3)

		var jsfun = "xunhuan()";
		api.execScript({
			name : 'index',

			script : jsfun
		});
		var jsplay = 'stop()'
		api.execScript({
			name : 'nww',
			frameName : 'player',
			script : jsplay
		});
		api.showProgress({
			title : ' 加载中...',
			text : '先喝杯茶...',
			modal : false
		})
		$api.attr(button, 'class', 'iconfont  icon-zanting H-theme-font-color-white');
		//					api.toast({
		//						msg : '暂停播放'
		//					});
	} else {
		// 关闭
		button.setAttribute("data-click", 0);
		var audio = api.require('audioPlayer');
		audio.stop();
		//					pause(this);
		api.hideProgress();
		$api.attr(button, 'class', 'iconfont  icon-bofang H-theme-font-color-white');
		var jsfun = "xunhuan1(this)";
		api.execScript({
			name : 'index',
			script : jsfun
		});

		//					api.toast({
		//						msg : '继续播放'
		//					});
	}
	//			}
}

function stop1() {
	var audio = api.require('audioPlayer');
	audio.stop();

}

function play(mp3) {
	api.toast({
		msg : '开始播放'
	});
	var iii = $api.byId('playI');
	var netAudio = api.require('audioPlayer');
	netAudio.initPlayer({
		path : mp3
	}, function(ret, err) {

		api.hideProgress();
		var duration = ret.duration;
		var tii = duration * 10;
		var current = ret.current;
		var percent = (current / duration) * 100;
		var per = Math.round(percent);
		var complete = ret.complete;
		var slider = api.require('slider');
		var dur = formatSeconds(duration);
		var cur = formatSeconds(current);
		//					api.getPrefs({
		//						key : 'isPlaying'
		//					}, function(ret, err) {
		//						if (ret.value == 1) {
		//							///锁屏播放
		//							audioCover(duration, songName, artists, per)
		//						}
		//					});
	});
}

function pause() {
	var netAudio = api.require('audioPlayer');
	netAudio.pause();
}

function openPhoto(url) {

	var img = new Array()
	img[0] = url

	var imageBrowser = api.require('imageBrowser');
	imageBrowser.openImages({
		imageUrls : img
	});

}