<template>
    <NoneDataScroller :show="noneDataShow" :type="noneDataType"
                      :on-refresh="refresh"
                      :on-infinite="infinite"
                      ref="noneDataScroller">
        <ul class="notice-list">
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
    import NoneDataScroller from '@/components/none-data-scroller';
    import api from '@/assets/js/api.js';

    export default {
        name: "notice-list",
        components: {
            NoneDataScroller,
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
            pageTitle: function (val) {
                document.title = val;
            },
            '$route' (to, from) {
                this.updatePageTitle();
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
                this.countNotice(this.$route.params.org_id, true);
            },
            infinite: function () {
                this.countNotice(this.$route.params.org_id, false);
            },
            countNotice: function (org_id, isRefresh) {
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
                        // 根据数据
                        $this.updateList(list, isRefresh);

                        // 无数据
                        $this.showNoneData();
                    },
                    failure: $this.showNoneData,
                    error: function () {
//                        var list = [
//                            {
//                                org_logo_url: './static/img/user_img_01.png',
//                                msg_title: '跨境电商大风口',
//                                msg_create_time: '2017-04-12  16:55:24',
//                                readCount: '200',
//                                memberCount: '250'
//                            }
//                        ];
//                        $this.updateList(list, isRefresh);
//                        $this.showContent();

                        $this.showNetError();
                    }
                });
            },
            updateList: function (list, isRefresh) {
                if (isRefresh) {
                    setTimeout(() => {
                        this.my_scroller.finishPullToRefresh();
                    }, 500);
                } else {
                    this.noticeList = this.noticeList.concat(list);
                    this.start += list.length;
                    console.log(this.limit > list.length);
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
                if (!this.noticeList.length && this.start === 0) {
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