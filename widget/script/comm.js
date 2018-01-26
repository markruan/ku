function switchplay(button, mp3,sid,index,cover,title,artist) {
  console.log(JSON.stringify(artist));
    var click = button.getAttribute("data-click");
    if (!$api.getStorage('isopen') || $api.getStorage('isopen') != 1) {
        $api.setStorage('listopen', 3);
        api.openWin({
            name: 'nww',
            url: '../../html/music/bo_head.html',
            slidBackEnabled: false,
            animation: {
                type: "movein", //动画类型（详见动画类型常量）
                subType: "from_bottom", //动画子类型（详见动画子类型常量）
                duration: 500 //动画过渡时间，默认300毫秒
            },
            pageParam: {
                sid: sid,
                mp3:mp3,
                index: index,
                mlistdata:false,
                cover:cover,
                title:title,
                artist:artist
            }
        });
    }
    if (click == 0) {
        // 点开
        // uiloading()
        var dd = document.getElementsByClassName('icon-zanting');
        for (i = 0; i < dd.length; i++) {
            $api.attr(dd[i], 'class', 'iconfont  icon-bofang H-theme-font-color-white');
        }
        button.setAttribute("data-click", 1);
         api.sendEvent({
            name: 'songid',
            extra: {
                sid: sid,
                index: 0,
                mlistdata:false
            }
        })

        $api.attr(button, 'class', 'iconfont  icon-zanting H-theme-font-color-white');
    } else {
        // 关闭
        button.setAttribute("data-click", 0);
        api.sendEvent({
            name: 'pause'
        });

        stoploading();
        $api.attr(button, 'class', 'iconfont  icon-bofang H-theme-font-color-white');
    }
}
//
// function stop1() {
//     var audio = api.require('audioPlayer');
//     audio.stop();
//     api.sendEvent({
//         name: 'stopmusic'
//     });
// }

// function play() {
//     var audio = api.require('audioPlayer');
//     audio.play();
//     api.sendEvent({
//         name: 'playing'
//     });
// }

// function pause() {
//     var audioPlayer = api.require('audioPlayer');
//     audioPlayer.pause();
// }

function openPhoto(data, i) {
    var dd = data.split(',')
    var imageBrowser = api.require('imageBrowser');
    imageBrowser.openImages({
        imageUrls: dd,
        showList: false,
        activeIndex: i
    });
}
