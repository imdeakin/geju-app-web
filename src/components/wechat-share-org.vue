<template>
    <div class="con" v-wechat-title="orgData.org_name" v-wx-api="wechatShareConfig">
        <NoneData :show="noneDataShow" :type="noneDataType">
            <WechatShareDownloadBar></WechatShareDownloadBar>
            <div class="wrapper">
                <div class="banner" v-bind:style="{backgroundImage:'url(' + banner + ')'}">
                    <div class="org-brand">
                        <div class="org-logo"><img :src="getFullImgPath(orgData.org_logo_url)"></div>
                        <h3 class="org-name">{{orgData.org_name}}</h3>
                    </div>
                </div>
                <div class="content">
                    <div class="info-group info-group-block">
                        <div class="label">组织介绍</div>
                        <div class="text">{{orgData.org_des}}</div>
                    </div>
                    <div class="info-group">
                        <div class="label">组织电话</div>
                        <div class="text">{{orgData.org_tel}}</div>
                    </div>
                    <div class="info-group">
                        <div class="label">组织地址</div>
                        <div class="text">{{orgData.org_addr}}</div>
                    </div>
                    <div class="info-group border-none">
                        <div class="label">联系人</div>
                        <div class="text">{{orgData.org_contact_name}}</div>
                    </div>
                </div>
                <div class="footer">
                    <a class="dl-btn" href="http://www.gzyueyun.com/assets/dowload.html">赶快下载格局加入组织吧</a>
                </div>
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
    import installWxApi from '@/assets/js/wxapiconfig.js';
    Vue.use(installWxApi);
    Vue.use(VueWechatTitle);

    export default {
        name: 'wechat-share-org',
        components: {
            NoneData,
            WechatShareDownloadBar
        },
        data () {
            return {
                banner: 'static/img/org-banner-bg_01.png',
                orgData: {},
                noneDataShow: false,
                noneDataType: 0,
                wechatShareConfig: {
                    title: '',
                    logo: '',
                    url: ''
                }
            }
        },
        mounted: function () {
            this.getNoticeData();
        },
        watch: {
            orgData: function (data) {
                this.wechatShareConfig = {
                    title: '我在格局【格局】看到一个不错的协会【' + data.org_name + '】，向您推荐一下！',
                    desc: data.org_des,
                    logo: this.getFullImgPath(data.org_logo_url),
                    url: window.location.href
                }
            }
        },
        methods: {
            getNoticeData: function () {
                var $this = this;
                api.request({
                    api: api.config.paths.wechatShare,
                    data: {
                        shareType: 0,
                        shareKey: this.$route.params.share_key
                    },
                    type: "GET",
                    success: function (list) {
                        if (list.length) {
                            $this.orgData = list[0];
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
                if (!this.orgData['org_id']) {
                    this.noneDataShow = true;
                    this.noneDataType = 0;
                } else {
                    this.showContent();
                }
            },
            showContent: function () {
                if (this.orgData['org_id']) {
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

    .banner {
        display: inline-block;
        width: 100%;
        height: 3.75rem;
        background-position: center;
        background-size: cover;
        text-align: center;
    }

    .org-logo {
        margin: .35rem auto;
        width: 1.6rem;
        height: 1.6rem;
        padding: .06rem;
        background: rgba(149, 149, 149, 0.5);
        border-radius: 50%;
        overflow: hidden;
    }

    .org-logo > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .org-name {
        font-size: .34rem;
        color: white;
    }

    .content {
        margin-top: .28rem;
        padding-left: .28rem;
        background: white;
    }

    .info-group {
        line-height: .86rem;
        border-bottom: 2px solid #e9e9e9;
    }

    .info-group.border-none {
        border: 0;
    }

    .info-group .label {
        display: inline-block;
        font-size: .3rem;
        color: #282828;
    }

    .info-group .text {
        float: right;
        font-size: .3rem;
        color: #818181;
        line-height: .86rem;
        padding-right: .28rem;
    }

    .info-group.info-group-block {
        line-height: 1em;
    }

    .info-group.info-group-block .label {
        padding-top: .3rem;
        padding-bottom: .08rem;
    }

    .info-group.info-group-block .text {
        float: none;
        font-size: .28rem;
        color: #444;
        line-height: .4rem;
        padding-bottom: .14rem;
    }

    .footer {
        display: inline-block;
        width: 100%;
        padding: 0 .28rem;
        background: white;
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