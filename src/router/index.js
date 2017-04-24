import Vue from 'vue';
import Router from 'vue-router';
import noticeCenter from '@/components/notice-center';
import noticeList from '@/components/notice-list';
import wechatShareNotice from '@/components/wechat-share-notice';
import wechatShareOrg from '@/components/wechat-share-org';
import wechatShareLive from '@/components/wechat-share-live';

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
        },
        {
            path: '/wechat-share/notice/:share_key',
            name: 'wechat-share-notice',
            component: wechatShareNotice
        },
        {
            path: '/wechat-share/org/:share_key',
            name: 'wechat-share-org',
            component: wechatShareOrg
        },
        {
            path: '/wechat-share/live/:share_key',
            name: 'wechat-share-live',
            component: wechatShareLive
        }
    ]
});
