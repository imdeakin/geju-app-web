/**
 * Created by Administrator on 2017/4/24.
 */
(function () {
  function install(Vue) {
    var installSewisePlayer = function (container, options) {
      var width = options.width,
        height = options.height,
        url = options.url;
      container.innerHTML = '';
      var playerCon = document.createElement('div');
      playerCon.style.width = width;
      playerCon.style.height = height;
      var script = document.createElement('script');
      script.setAttribute('src', url);
      playerCon.appendChild(script);
      container.appendChild(playerCon);
    }
    Vue.directive('sewise-player', function (el, binding) {
      installSewisePlayer(el, binding.value);
    })
  }

  module.exports = install
})()
