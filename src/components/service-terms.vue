<template>
    <div class="con">
        <NoneData :show="noneDataShow" :type="noneDataType">
            <div class="content"></div>
        </NoneData>
    </div>
</template>
<script>
    import api from '@/assets/js/api.js';
    import NoneData from '@/components/none-data';

    export default {
        name: 'service-terms',
        components: {
            NoneData
        },
        data () {
            return {
                content: '',
                noneDataShow: false,
                noneDataType: 0
            }
        },
        mounted () {
            this.getServiceTerms();
        },
        methods: {
            getServiceTerms: function () {
                var $this = this;
                api.request({
                    api: api.config.paths.getServiceTerms,
                    type: "GET",
                    success: function (list) {
                        if (list.length) {
                            $this.content = list[0];
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
                if (!this.content) {
                    this.noneDataShow = true;
                    this.noneDataType = 0;
                } else {
                    this.showContent();
                }
            },
            showContent: function () {
                if (this.content) {
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
        padding: .3rem;
        background: #fff;
    }
</style>