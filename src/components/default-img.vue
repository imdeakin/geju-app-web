<template>
    <img class="default-image" :src="img"
         :style="{backgroundImage:'url(' + def_img + ')'}"
         @load="successLoadImg"
         @error="errorLoadImg">
</template>
<script>
    export default {
        name: "default-img",
        props: {
            def_img: {
                type: String,
                default: 'static/img/default_image.png'
            },
            img: {
                type: String
            }
        },
        methods: {
            successLoadImg: function (event) {
                if (event.target.complete == true) {
//                    event.target.classList.remove("default-image");
                    event.target.style.backgroundImage = 'none';
//                    var imgParentNode = event.target.parentNode;
//                    if (imgParentNode.classList.contains('show-img') == true) {
//                        imgParentNode.style.background = "#000";
//                    }
                }
            },
            errorLoadImg: function (event) {
                event.target.style.backgroundImage = 'url(' + this.def_img + ')';
            }
        }
    }
</script>
<style scoped>
    img {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>