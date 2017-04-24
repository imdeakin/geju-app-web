<template>
    <div class="con" v-wechat-title="articleData.msg_title">
        <NoneData :show="noneDataShow" :type="noneDataType">
            <WechatShareDownloadBar></WechatShareDownloadBar>
            <div class="wrapper">
                <article v-if="articleData">
                    <header>
                        <h2>{{articleData.msg_title}}</h2>
                        <h3>
                            <img class="author-img" :src="getFullImgPath(articleData.picture_url)">
                            <span class="author-name">{{articleData.nickName}}</span>
                            <span class="create-time">{{articleData.msg_create_time}}</span>
                        </h3>
                    </header>
                    <div class="notice-imgs">
                        <div class="notice-img" v-for="item in articleData.msg_notice_imgs"
                             v-bind:style="{backgroundImage: 'url(' + getFullImgPath(item) + ')'}"></div>
                    </div>
                    <div class="content">{{articleData.msg_content}}</div>
                    <a class="dl-btn" href="http://www.gzyueyun.com/assets/dowload.html">下载格局查看更多公告</a>
                </article>
            </div>
        </NoneData>
    </div>
</template>
<script>
    import WechatShareDownloadBar from '@/components/wechat-share-download-bar'
    import api from '@/assets/js/api.js';
    import Vue from 'vue';
    import NoneData from '@/components/none-data';
    import VueWechatTitle from 'vue-wechat-title';
    Vue.use(VueWechatTitle);

    export default {
        name: 'wechat-share-notice',
        components: {
            NoneData,
            WechatShareDownloadBar
        },
        data () {
            return {
                articleData: {
                    picture_url: '',
                    nickName: '',
                    msg_create_time: '',
                    msg_title: '',
                    msg_content: ''
                },
                noneDataShow: false,
                noneDataType: 0
            }
        },
        mounted: function () {
            this.getNoticeData();
        },
        methods: {
            getNoticeData: function () {
                var $this = this;
                api.request({
                    api: api.config.paths.wechatShare,
                    data: {
                        shareType: 1,
                        shareKey: this.$route.params.share_key
                    },
                    type: "GET",
                    success: function (list) {
                        if (list.length) {
                            list[0]['msg_notice_imgs'] = list[0]['msg_notice_img'].split(',');
                            $this.articleData = list[0];
                        }

                        // 无数据
                        $this.showNoneData();
                    },
                    failure: $this.showNoneData,
                    error: $this.showNetError
                });
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
                if (!this.articleData) {
                    this.noneDataShow = true;
                    this.noneDataType = 0;
                } else {
                    this.showContent();
                }
            },
            showContent: function () {
                if (this.articleData) {
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
        background: #f6f6f6;
    }

    .wrapper {
        padding: .24rem .3rem;
    }

    header > h2 {
        font-size: .4rem;
        color: #353535;
        line-height: .58rem;
    }

    header > h3 {
        line-height: .8rem;
        font-size: 0;
        color: #686868;
        font-weight: lighter;
    }

    .author-img {
        width: .5rem;
        height: .5rem;
        border-radius: 50%;
        margin-right: .14rem;
        vertical-align: middle;
    }

    .author-name {
        font-size: .26rem;
        vertical-align: middle;
    }

    .create-time {
        float: right;
        line-height: .8rem;
        font-size: .26rem;
        vertical-align: middle;
    }

    .content {
        font-size: .3rem;
        color: #2c2c2c;
    }

    .content img {
        display: block;
        max-width: 100%;
        height: auto;
        margin-left: auto;
        margin-right: auto;
    }

    .notice-imgs {
        width: 5.58rem;
        margin: .2rem auto;
        font-size: 0;
        text-align: center;
    }

    .notice-img {
        display: inline-block;
        width: 1.8rem;
        height: 1.8rem;
        background-position: center;
        background-size: contain;
        margin: .03rem;
    }

    .dl-btn {
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