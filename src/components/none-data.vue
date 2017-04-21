<template>
    <div class="con">
        <div class="con" v-if="!show">
            <slot></slot>
        </div>
        <div class="con none-data" v-if="show">
            <div class="none-data-wrapper">
                <img class="none-data-icon" :src="showIcon" v-if="type !== 2">
                <img class="loading-icon" :src="showIcon" v-else="type === 2">
                <h3 class="none-data-text">{{showText}}</h3>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "none-data",
        props: {
            show: {
                type: Boolean,
                default: false
            },
            icon: {
                type: String,
                default: ''
            },
            type: {
                type: Number, // 0: 暂无数据 1: 网络出错 2: 正在加载
                default: 0
            },
            text: {
                type: String,
                default: ''
            }
        },
        computed: {
            showText: function () {
                var text = this.text;
                if (!text) {
                    switch (this.type) {
                        case 1:
                            text = '网络好像有问题，请重试。';
                            break;
                        case 2:
                            text = '正在加载';
                            break;
                        default:
                            text = '暂时没有相关内容';
                    }
                }
                return text;
            },
            showIcon: function () {
                if (this.icon) return this.icon;

                var icon = './static/img/nodata_icon_01.png';
                if (this.type === 2) {
                    icon = './static/img/loading.gif';
                }
                return icon;
            }
        }
    }
</script>
<style scoped>
    .con {
        width: 100%;
        height: 100%;
    }

    .none-data {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .none-data-icon {
        max-width: 2.28rem;
    }

    .none-data-text {
        color: #999;
        font-size: .42rem;
        margin-top: .42rem;
    }
</style>