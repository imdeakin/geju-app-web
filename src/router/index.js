import Vue from 'vue';
import Router from 'vue-router';
import noticeCenter from '@/components/notice-center';
import noticeList from '@/components/notice-list';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/notice-center/:member_info_id',
            name: 'notice-center',
            component: noticeCenter
        },
        {
            path: '/notice-list/:org_id/:org_name',
            name: 'notice-list',
            component: noticeList
        }
    ]
});
