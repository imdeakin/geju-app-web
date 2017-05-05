<template>
    <div class="con" v-wechat-title="curLive.live_title" v-wx-api="wechatShareConfig">
        <NoneData :show="noneDataShow" :type="noneDataType">
            <WechatShareDownloadBar></WechatShareDownloadBar>
            <div class="wrapper">
                <div class="player-con">
                    <div class="player-open" v-if="curLive.status == 0" v-sewise-player="curLiveUrl"
                         key="player-open"></div>
                    <div class="player-close" v-else key="player-close">
                        <div class="live-status">
                            <span class="live-status-light" v-bind:class="{online: curLive.status == 0}"></span>
                            <span class="live-status-text">{{getLiveStatusText(curLive.status)}}</span>
                        </div>
                    </div>
                </div>
                <div class="live-ad-bar">
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
                        <li class="live-item" v-for="item in liveList" v-if="item.live_id !== curLive.live_id">
                            <router-link :to="{name:'wechat-share-live', params:{share_key: item.live_id}}">
                                <div class="live-item-con">
                                    <div class="live-status">
                                        <span class="live-status-light"
                                              v-bind:class="{online: item.status == 0}"></span>
                                        <span class="live-status-text">{{getLiveStatusText(item.status)}}</span>
                                    </div>
                                    <img class="live-cover" :src="getFullImgPath(item.live_cover)">
                                    <div class="live-name">{{item.org_name}}</div>
                                </div>
                            </router-link>
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
    import VueResource from 'vue-resource';
    import NoneData from '@/components/none-data';
    import VueWechatTitle from 'vue-wechat-title';
    import installSewisePlayer from '@/assets/js/install-sewise-player.js';
    import installWxApi from '@/assets/js/wxapiconfig.js';
    Vue.use(VueResource);
    Vue.use(installWxApi);
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
                curLive: {},
                noneDataShow: false,
                noneDataType: 0,
                wechatShareConfig: {}
            }
        },
        mounted: function () {
            this.getLiveList();
        },
        watch: {
            curLive (data) {
                this.wechatShareConfig = {
                    title: '我在格局【格局】看到一个不错的直播，向您推荐一下！',
                    desc: data.live_title,
                    logo: this.getFullImgPath(data.org_logo_url),
                    url: window.location.href
                }
            },
            '$route' (to, from) {
                // 对路由变化作出响应...
                window.scrollTo(0, 0);
                this.getLiveList();
            }
        },
        computed: {
            curLiveUrl () {
                var url = '',
                    id = this.curLive['plug_id'] || '';
                if (id) {
                    var rtmp = 'http://hls.gzyueyun.com/ucloud/' + id + '/playlist.m3u8';
                    url = 'static/js/player/sewise.player.min.js?' +
                        'server=live' +
                        '&type=m3u8' +
                        '&streamurl=' + rtmp +
                        '&autostart=true' +
                        '&pid=' +
                        '&shifttime=' +
                        '&buffer=5' +
                        '&lang=zh_CN' +
                        '&title=' + this.curLive['live_title'] +
                        '&skin=liveWhite';
                }
                return url;
            }
        },
        methods: {
            /**
             * 获取直播列表
             */
            getLiveList: function () {
                this.$http.get(api.config.paths.wechatShare, {
                    params: {
                        shareType: 2,
                        shareKey: this.$route.params.share_key
                    }
                }).then(this.responseHandle).catch(this.responseHandle);
            },
            /**
             * 获取直播列表的请求处理
             */
            responseHandle: function (res) {
                this.responseAnalyze(res, {
                    success: (list) => {
                        if (list.length) {
                            this.liveList = list;
                            this.curLive = this.getCurLive(list);
                        }

                        // 无数据
                        this.showNoneData();
                    },
                    failure: (data) => {
                        this.showNoneData();
                    },
                    error: (data) => {
                        this.showNetError();
                    }
                })
            },
            /**
             * 对http请求响应结果分析
             * @param res 响应对象
             * @param options 配置
             * {
             *  success: Function, 响应返回成功
             *  failure: Function, 响应返回失败
             *  error: Function 请求出错
             * }
             */
            responseAnalyze: function (res, options) {
                options = options || {};
                var isFunction = function (obj) {
                    return typeof obj === 'function';
                };

                var onSuccess = options.success,
                    onFailure = options.failure,
                    onError = options.error;

                if (res.status === 200) {
                    var data = res.data,
                        success = data.success,
                        list = data.root;
                    if (success) { // 返回成功
                        if (isFunction(onSuccess)) onSuccess(list);
                    } else { // 返回失败
                        if (isFunction(onFailure)) onFailure(data);
                    }
                } else { // 请求出错
                    if (isFunction(onError)) onError();
                }
            },
            getCurLive: function (list) {
                var curLive = {};
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i]['live_type'] == 1) {
                        curLive = list[i];
                        break;
                    }
                }
                return curLive;
            },
            getLiveStatusText: function (status) {
                return status == 1 ? '休息中' : '直播中';
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

    .player-con {
        position: relative;
        width: 100%;
        height: 5.2rem;
        background: black;
    }

    .player-con > div {
        width: 100%;
        height: 100%;
    }

    .player-close {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        justify-content: center;
        align-items: center;
    }

    .player-close .live-status {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .player-close .live-status-light {
        display: inline-block;
        width: .38rem;
        height: .38rem;
        border-radius: 50%;
        background: #eb6100;
        margin-right: .15rem;
    }

    .player-close .live-status-light.online {
        background: #22ac38;
    }

    .player-close .live-status {
        font-size: .42rem;
        color: white;
    }

    .live-ad-bar {
        padding: .2rem .3rem;
        background: white;
    }

    .live-ad-bar .content {
        display: inline-block;
        width: 5rem;
    }

    .live-ad-bar .content > img {
        float: left;
        width: .6rem;
        height: .6rem;
        margin-right: .2rem;
        border-radius: 50%;
    }

    .live-ad-bar .content > h2 {
        float: left;
        width: 4rem;
        font-size: .26rem;
        color: #474747;
        margin-bottom: .12rem;
    }

    .live-ad-bar .content > h3 {
        float: left;
        width: 4rem;
        font-size: .24rem;
        color: #9c9c9c;
    }

    .live-ad-bar .dl-btn {
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

    .live-item > a {
        display: block;
    }

    .live-item-con {
        position: relative;
        border: 1px solid #b9b9b9;
    }

    .live-cover {
        width: 100%;
        height: 100%;
    }

    .live-item-con .live-status {
        position: absolute;
        display: inline-block;
        top: 0;
        right: 0;
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

    .live-item-con .live-status-light {
        display: inline-block;
        width: .12rem;
        height: .12rem;
        background: #eb6100;
        border-radius: 50%;
        vertical-align: middle;
    }

    .live-item-con .live-status-light.online {
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
