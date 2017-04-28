/**
 * Created by Administrator on 2017/4/24.
 */
(function () {
    function install(Vue) {
        var installSewisePlayer = function (container, url) {
            console.log(url)
            container.innerHTML = '';
            var script = document.createElement('script');
            script.setAttribute('src', url);
            container.appendChild(script);
        }
        Vue.directive('sewise-player', function (el, binding) {
            installSewisePlayer(el, binding.value);
        })
    }

    module.exports = install
})()
