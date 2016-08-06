function switchplay(button, mp3) {
	var click = button.getAttribute("data-click");
	if (click == 0) {
		// 点开
		var dd = document.getElementsByClassName('icon-zanting');
		for ( i = 0; i < dd.length; i++) {
			$api.attr(dd[i], 'class', 'iconfont  icon-bofang H-theme-font-color-white');
		}
		button.setAttribute("data-click", 1);
		pauseAll()
		stop();
		play(mp3)
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
		stop();
		//					pause(this);
		api.hideProgress();
		$api.attr(button, 'class', 'iconfont  icon-bofang H-theme-font-color-white');
		//					api.toast({
		//						msg : '继续播放'
		//					});
	}
	//			}
}

function play(mp3) {
	var iii = $api.byId('playI');
	var netAudio = api.require('audio');
	netAudio.play({
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
	var netAudio = api.require('audio');
	netAudio.pause();
}

function pauseAll() {
	var mPause = 'pause()'
	api.execScript({
		name : 'nw',
		frameName : 'nn',
		script : mPause
	});
}

function openPhoto(url) {

	var img = new Array()
	img[0] = url

	var imageBrowser = api.require('imageBrowser');
	imageBrowser.openImages({
		imageUrls : img
	});

}