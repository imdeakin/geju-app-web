/**
 * Created by Deakin on 2017/4/20 0020.
 */
/**
 * 移动端rem单位适配
 * @param width 屏幕宽度
 * @param size  字体大小
 * @param max   最大比率
 */
function flexible(width, size, max) {
    width =  typeof width == 'number' ? width : 750;
    size =  typeof size == 'number' ? size : 100;
    max =  typeof max == 'number' ? max : 100;

    //var docBody = document.body || document.documentElement;
    this.setSize = function () {
        var ratio = size / width;
        var w = window.innerWidth;
        var newRatio = w * ratio;
        if (max && newRatio > max) {
            newRatio = max;
        }
        document.documentElement.style.fontSize = newRatio + 'px';
    };
    this.setSize();
    window.onresize = this.setSize;
}

export default flexible;