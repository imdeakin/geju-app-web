<template>
    <NoneDataScroller :show="noneDataShow" :type="noneDataType"
                      :on-refresh="refresh"
                      :on-infinite="infinite"
                      ref="noneDataScroller">
        <ul class="notice-list" v-wechat-title="pageTitle">
            <li class="notice-item" v-for="item in noticeList">
                <img class="notice-img" v-bind:src="getFullImgPath(item.org_logo_url)">
                <div class="notice-content">
                    <div class="notice-title">{{item.msg_title}}</div>
                    <div class="notice-time">发布时间：{{item.msg_create_time}}</div>
                    <div class="notice-counts"><span class="read">已读：{{item.readCount}}</span><span class="total">总人数：{{item.memberCount}}</span>
                    </div>
                </div>
            </li>
        </ul>
    </NoneDataScroller>
</template>
<script>
    import Vue from 'vue';
    import NoneDataScroller from '@/components/none-data-scroller';
    import api from '@/assets/js/api.js';
    import VueWechatTitle from 'vue-wechat-title';
    Vue.use(VueWechatTitle);

    export default {
        name: "notice-list",
        components: {
            NoneDataScroller
        },
        data () {
            return {
                pageTitle: "",
                noticeList: [],
                noneDataShow: false,
                noneDataType: 0
            }
        },
        watch: {
            '$route' (to, from) {
                this.noticeList = [];
            }
        },
        mounted: function () {
            this.updatePageTitle();

            this.start = 0;
            this.limit = 20;

            setTimeout(() => {
                this.my_scroller = this.$children[0].$refs.my_scroller;
            });
        },
        methods: {
            refresh: function () {
                this.getNoticeList(this.$route.params.org_id, true);
            },
            infinite: function () {
                this.getNoticeList(this.$route.params.org_id, false);
            },
            getNoticeList: function (org_id, isRefresh) {
//                if (this.start === 0) this.showLoading();

                var $this = this;
                api.request({
                    api: api.config.paths.countNotice,
                    type: 'GET',
                    data: {
                        start: $this.start,
                        limit: $this.limit,
                        org_id: org_id
                    },
                    success: function (list) {
                        // 更新数据
                        $this.updateList(list, isRefresh);

                        // 无数据
                        $this.showNoneData();
                    },
                    failure: $this.showNoneData,
                    error: $this.showNetError
                });
            },
            updateList: function (list, isRefresh) {
                if (isRefresh) {
                    setTimeout(() => {
                        this.noticeList = list.concat(this.noticeList);
                        this.start += list.length;
                        this.my_scroller.finishPullToRefresh();
                    }, 500);
                } else {
                    this.noticeList = this.noticeList.concat(list);
                    this.start += list.length;
                    this.my_scroller.finishInfinite(this.limit > list.length);
                }
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
                if (!this.noticeList.length) {
                    this.noneDataShow = true;
                    this.noneDataType = 0;
                } else {
                    this.showContent();
                }
            },
            showContent: function () {
                if (this.noticeList.length) {
                    this.noneDataShow = false;
                }
            },
            getFullImgPath: function (path) {
                return api.getFullImgPath(api, path);
            },
            updatePageTitle: function () {
                this.pageTitle = this.$route.params.org_name;
            }
        }
    }
</script>
<style scoped>
    .con {
        width: 100%;
        height: 100%;
    }

    .notice-item {
        padding: .2rem;
        border-bottom: 1px solid #dbdbdb;
    }

    .notice-img {
        width: 1.14rem;
        height: 1.14rem;
        border-radius: .08rem;
        border: 1px solid #dbdbdb;
    }

    .notice-content {
        display: inline-block;
        width: 5.7rem;
        padding-left: .3rem;
    }

    .notice-title {
        font-size: .36rem;
    }

    .notice-time {
        font-size: .26rem;
        color: #9b9b9b;
        padding: .13rem 0;
    }

    .notice-counts {
        font-size: .26rem;
        color: #38adff;
    }

    .notice-counts .read {
        display: inline-block;
        width: 50%;
    }

    .notice-counts .total {
        display: inline-block;
        width: 50%;
    }

</style>
