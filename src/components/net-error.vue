<template>
    <div class="con">
        <div class="con" v-show="false">
            <slot></slot>
        </div>
        <div class="con none-data" v-show="show">
            <div class="none-data-wrapper">
                <img class="none-data-icon" :src="icon">
                <h3 class="none-data-text">{{text}}</h3>
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
                default: './static/img/nodata_icon_01.png'
            },
            text: {
                type: String,
                default: '暂时没有相关内容'
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