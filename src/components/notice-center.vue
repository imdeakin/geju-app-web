<template>
    <NoneData :show="noneDataShow" :type="noneDataType">
        <ul class="org-list" v-wechat-title="pageTitle">
            <li class="org-item" v-for="item in orgList">
                <router-link :to="{'name': 'notice-list', 'params': {'org_id': item.org_id, 'org_name': item.org_name}}">
                    <div class="head-img">
                        <DefaultImg :img="getFullImgPath(item.org_logo_url)"></DefaultImg>
                    </div>
                    <span class="org-name">{{item.org_name}}</span>
                </router-link>
            </li>
        </ul>
    </NoneData>
</template>
<script>
    import Vue from 'vue';
    import NoneData from '@/components/none-data';
    import DefaultImg from '@/components/default-img';
    import api from '@/assets/js/api.js';
    import VueWechatTitle from 'vue-wechat-title';
    Vue.use(VueWechatTitle);

    export default {
        name: 'notice-center',
        components: {
            NoneData,
            DefaultImg
        },
        data () {
            return {
                orgList: [],
                pageTitle: '统计',
                member_info_id: '',
                noneDataShow: false,
                noneDataType: 0
            }
        },
        watch: {
            '$route' (to, from) {
                this.getMyAssociations(to.params.member_info_id);
            }
        },
        mounted: function () {
            this.getMyAssociations(this.$route.params.member_info_id);
        },
        methods: {
            getMyAssociations: function (member_info_id) {
                this.showLoading();
                var $this = this;
                api.request({
                    api: api.config.paths.getMyAssociations,
                    type: 'GET',
                    data: {
                        member_info_id: member_info_id
                    },
                    success: function (list) {
                        // 过滤掉非自己创建的组织
                        $this.orgList = $this.getMyCreateOrg(list);

                        // 无数据
                        $this.showNoneData();
                    },
                    failure: $this.showNoneData,
                    error: $this.showNetError
                });
            },
            getMyCreateOrg: function (list) {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (!list[i]['isbuilder']) {
                        list.splice(i, 1);
                    }
                }
                return list;
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
                if (!this.orgList.length) {
                    this.noneDataShow = true;
                    this.noneDataType = 0;
                } else {
                    this.showContent();
                }
            },
            showContent: function () {
                if (this.orgList.length) {
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
    .org-list {
        padding-left: .2rem;
    }

    .org-item {
        padding: .19rem .2rem .19rem 0;
        border-bottom: 1px solid #dbdbdb;
        margin-left: .08rem;
        text-align: left;
        line-height: 1rem;
        font-size: 0;
    }

    .org-item .head-img {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border-radius: .08rem;
        margin-left: -.08rem;
        vertical-align: middle;
    }

    .org-item .org-name {
        margin-left: .2rem;
        font-size: .36rem;
        vertical-align: middle;
    }
</style>
