<template>
    <div class="share-con" v-bind:class="{'white-style': type == 1}">
        <div class="share-wrapper">
            <div class="content">
                <img :src="logo">
                <h2>{{name}}</h2>
                <h3>{{slogan}}</h3>
            </div>
            <a class="dl-btn" href="http://www.gzyueyun.com/assets/dowload.html">马上下载</a>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'wechat-share-notice',
        props: ['type'],
        data () {
            return {
                logo: "static/img/geju-logo.png",
                name: "格局",
                slogan: "连接从格局开始"
            }
        }
    }
</script>
<style scoped>
    .share-con {
        height: 1.4rem;
        background: white;
    }

    .share-wrapper {
        padding: .24rem .3rem;
        background: white;
    }

    .content {
        display: inline-block;
        width: 4rem;
    }

    .content > img {
        float: left;
        width: .88rem;
        height: .88rem;
        margin-right: .25rem;
    }

    .content > h2 {
        float: left;
        width: 2rem;
        font-size: .36rem;
        color: #474747;
        line-height: .56rem;
    }

    .content > h3 {
        float: left;
        width: 2rem;
        font-size: .24rem;
        color: #9c9c9c;
    }

    .dl-btn {
        display: inline-block;
        float: right;
        font-size: .24rem;
        color: #fff;
        line-height: .6rem;
        width: 1.68rem;
        text-align: center;
        border-radius: .12rem;
        margin-top: .12rem;
        background: #313131;
    }

    .share-con.white-style .dl-btn {
        color: #000;
        background: white;
        border: 1px solid #000;
    }
</style>