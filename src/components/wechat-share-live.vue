<template>
  <div class="con">
    <NoneData :show="noneDataShow" :type="noneDataType">
      <WechatShareDownloadBar></WechatShareDownloadBar>
      <div class="wrapper" v-wechat-title="''">
        <div v-sewise-player="sewisePlayerConfig"></div>
        <!--<div style="width: 640px; height: 480px; ">-->
        <!--<script type="text/javascript" :src="getLiveUrl"></script>-->
        <!--</div>-->
        <div class="share-con">
          <div class="content">
            <img :src="getFullImgPath(curLive.org_logo_url)">
            <h2>{{curLive.org_name}}</h2>
            <h3>来支持我的直播，我在格局等你哦</h3>
          </div>
          <a class="dl-btn" href="http://www.gzyueyun.com/assets/dowload.html">下载格局</a>
        </div>
        <div class="live-list-con">
          <h3 class="live-list-title">更多精彩直播</h3>
          <ul class="live-list">
            <li class="live-item" v-for="item in liveList">
              <div class="live-item-con">
                <div class="live-status">
                  <span class="live-status-light" v-bind:class="{online: item.status == 0}"></span>
                  <span class="live-status-text">{{getLiveStatusText(item.status)}}</span>
                </div>
                <div class="live-cover"
                     v-bind:style="{backgroundImage:'url(' + getFullImgPath(item.live_cover) + ')'}"></div>
                <div class="live-name">{{item.org_name}}</div>
              </div>
            </li>
          </ul>
          <div class="footer">
            <a class="dl-btn" href="http://www.gzyueyun.com/assets/dowload.html">马上下载格局加入协会</a>
          </div>
        </div>
      </div>
    </NoneData>
  </div>
</template>
<script>
  import WechatShareDownloadBar from '@/components/wechat-share-download-bar';
  import api from '@/assets/js/api.js';
  import Vue from 'vue';
  import NoneData from '@/components/none-data';
  import VueWechatTitle from 'vue-wechat-title';
  import installSewisePlayer from '@/assets/js/install-sewise-player.js';
  Vue.use(installSewisePlayer);
  Vue.use(VueWechatTitle);

  export default {
    name: 'wechat-share-notice',
    components: {
      NoneData,
      WechatShareDownloadBar
    },
    data () {
      return {
        liveList: [],
        curLive: {"plug_id": ''},
        noneDataShow: false,
        noneDataType: 0
      }
    },
    mounted: function () {
      this.getLiveList();
    },
    computed: {
      sewisePlayerConfig: function () {
        return {width: '100%', height: '5.2rem', url: this.curLiveUrl};
      },
      curLiveUrl: function () {
        if (!this.curLive['plug_id']) {
          return '';
        }
        var rtmp = 'rtmp://rtmp.krapnik.cn/ucloud/' + this.curLive['plug_id'] + '.flv';
        var url = 'static/js/player/sewise.player.min.js?server=live' +
          '&type=rtmp' +
          '&streamurl=' + rtmp +
          '&autostart=true' +
          '&pid=' +
          '&shifttime=' +
          '&buffer=5' +
          '&lang=zh_CN' +
          '&logo=http://onvod.sewise.com/libs/swfplayer/skin/images/logo.png' +
          '&title=' + this.curLive.live_title +
          '&skin=liveWhite';
        return url;
      }
    },
    methods: {
      getLiveList: function () {
        var $this = this;
        api.request({
          api: api.config.paths.wechatShare,
          data: {
            shareType: 2,
            shareKey: this.$route.params.share_key
          },
          type: "GET",
          success: function (list) {
            if (list.length) {
              $this.liveList = list;
              $this.curLive = $this.getCurLive(list);
            }

            // 无数据
            $this.showNoneData();
          },
          failure: $this.showNoneData,
          error: $this.showNetError
        });
      },
      getCurLive: function (list) {
        var curLive = null;
        for (var i = 0, len = list.length; i < len; i++) {
          if (list[i]['live_type'] == 1) {
            curLive = list[i];
            break;
          }
        }
        return curLive;
      },
      getLiveStatusText: function (live) {
        return live.status == 1 ? '休息中' : '直播中';
      },
      showLoading: function () {
        this.noneDataShow = true;
        this.noneDataType = 2;
      },
      showNetError: function () {
        this.noneDataShow = true;
        this.noneDataType = 1;
      },
      showNoneData: function () {
        if (!this.liveList.length) {
          this.noneDataShow = true;
          this.noneDataType = 0;
        } else {
          this.showContent();
        }
      },
      showContent: function () {
        if (this.liveList.length) {
          this.noneDataShow = false;
        }
      },
      getFullImgPath: function (path) {
        return api.getFullImgPath(api, path);
      }
    }
  }
</script>
<style scoped>
  .con {
    width: 100%;
    height: 100%;
  }

  .wrapper {
    width: 100%;
    height: 100%;
    background: #f6f6f6;
  }

  .share-con {
    padding: .2rem .3rem;
    background: white;
  }

  .share-con .content {
    display: inline-block;
    width: 5rem;
  }

  .share-con .content > img {
    float: left;
    width: .6rem;
    height: .6rem;
    margin-right: .2rem;
    border-radius: 50%;
  }

  .share-con .content > h2 {
    float: left;
    width: 4rem;
    font-size: .26rem;
    color: #474747;
    margin-bottom: .12rem;
  }

  .share-con .content > h3 {
    float: left;
    width: 4rem;
    font-size: .24rem;
    color: #9c9c9c;
  }

  .share-con .dl-btn {
    display: inline-block;
    float: right;
    font-size: .24rem;
    line-height: .6rem;
    width: 1.68rem;
    text-align: center;
    border-radius: .12rem;
    margin: 0;
    color: #000;
    background: white;
    border: 1px solid #000;
  }

  .live-list-con {
    display: inline-block;
    width: 100%;
    background: white;
    margin-top: .2rem;
  }

  .live-list-title {
    padding-left: .12rem;
    margin: .22rem .2rem;
    border-left: .1rem solid #f5b45a;
    color: #313131;
    font-size: .28rem;
  }

  .live-list {
    font-size: 0;
  }

  .live-item {
    display: inline-block;
    width: 50%;
    padding: .04rem;
  }

  .live-item-con {
    border: 1px solid #b9b9b9;
  }

  .live-cover {
    margin: .66rem auto .1rem;
    width: 2.5rem;
    height: 2.5rem;
    background-position: center;
    background-size: contain;
  }

  .live-status {
    display: inline-block;
    margin: .14rem;
    float: right;
    width: 1.2rem;
    font-size: .2rem;
    text-align: center;
    color: white;
    line-height: .4rem;
    border-radius: 4px;
    background: #7f7f7f;
  }

  .live-status-light {
    display: inline-block;
    width: .12rem;
    height: .12rem;
    background: #eb6100;
    border-radius: 50%;
    vertical-align: middle;
  }

  .live-status-light.online {
    background: #22ac38;
  }

  .live-name {
    line-height: .68rem;
    padding: 0 .14rem;
    font-size: .24rem;
    color: white;
    text-align: left;
    background: #7f7f7f;
  }

  .footer {
    padding: 0 .28rem;
  }

  .footer .dl-btn {
    display: block;
    width: 100%;
    line-height: .65rem;
    color: white;
    font-size: .32rem;
    text-align: center;
    border-radius: .1rem;
    background: #0ba0ff;
    margin-top: .5rem;
    margin-bottom: .25rem;
  }
</style>
