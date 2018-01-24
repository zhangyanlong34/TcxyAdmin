import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueMarkdown from 'vue-markdown'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VueQuillEditor from 'vue-quill-editor'
import IEcharts from 'vue-echarts-v3';
import URL from './tools/api';
import mainPage from './tools/menu';

Vue.use(iView)
Vue.use(VueMarkdown)
Vue.use(IEcharts)
Vue.use(VueResource)
Vue.config.productionTip = false
Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push(function(request, next){
  var token = window.localStorage.getItem("token")
  if(token != null){
     request.headers.set('X-Token',token);
  }
  next(function(response){
    if(response.status==401){
      this.$router.push("error");
    }
  });
});
global.URL = URL
global.mainPage = mainPage

new Vue({
    el: '#app',
    router,
    VueMarkdown,
    VueResource,
    template: '<App/>',
    components: { App }
})
