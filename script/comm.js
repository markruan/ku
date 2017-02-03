function switchplay(button, mp3, sid) {

	var click = button.getAttribute("data-click");
	if (click == 0) {
		// 点开
		var dd = document.getElementsByClassName('icon-zanting');
		for ( i = 0; i < dd.length; i++) {
			$api.attr(dd[i], 'class', 'iconfont  icon-bofang H-theme-font-color-white');
		}
		button.setAttribute("data-click", 1);

		api.sendEvent({
			name : 'songid',
			extra : {
				sid : sid,
				index : 0
			}
		})

		api.showProgress({
			title : ' 加载中...',
			text : '先喝杯茶...',
			modal : false
		})
		$api.attr(button, 'class', 'iconfont  icon-zanting H-theme-font-color-white');

	} else {
		// 关闭
		button.setAttribute("data-click", 0);
		api.sendEvent({
			name : 'stopmusic'
		});

		pause()
		api.hideProgress();
		$api.attr(button, 'class', 'iconfont  icon-bofang H-theme-font-color-white');

	}

}

function stop1() {
	var audio = api.require('audioPlayer');
	audio.stop();
	api.sendEvent({
		name : 'stopmusic'
	});

}

function play() {
	var audio = api.require('audioPlayer');
	audio.play();
	api.sendEvent({
		name : 'playing'
	});

}

function pause() {
	var audioPlayer = api.require('audioPlayer');
	audioPlayer.pause();

}

function openPhoto(url) {

	var img = new Array()
	img[0] = url

	var imageBrowser = api.require('imageBrowser');
	imageBrowser.openImages({
		imageUrls : img
	});

}