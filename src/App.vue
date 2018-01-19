<template>
    <div id="app" style="width: 100%;height: 100%;">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>
<script>
// 初始化&media样式文件，勿删
import './css/reset.css'
import './css/media.css'
import './css/common.css'
export default {
    name: 'app',
    data() {
        return {
            // openId & Pid存值
            OpenId: '',
            Pid: ''
        }
    },
    created() {
        var that = this;
        // 获取sessionStorage保存在全局变量中
        this.OpenId = sessionStorage.getItem('OpenId');
        this.OpenId = 'bc7a84b3-4790-a228-d6f3-ad72bdaf3d59'; // mock data
        // 药店Pid Hack：如果session不存在，则让pid为空，显示全部药店信息
        if (sessionStorage.getItem('Pid') != null) {
          this.$store.state.Pid = sessionStorage.getItem('Pid');
        }else{
          this.$store.state.Pid = '';
        }

        // 同步ajax获取用户认证状态:UID
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.$api.getUid + this.OpenId, false);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                // 全局保存UID
                that.$store.state.Uid = xhr.responseText;
                // 监听提交时规定的cookie，如果存在，则删除cookie并跳转页面
                if (that.$tools.CheckCookie("cardCookie")) {
                    that.$router.replace("/pay");
                }
            } else {
                that.$vux.loading.show({
                    text: "网络错误"
                });
            }
        };
        xhr.send();
    }
}
</script>
<!-- vux less 默认reset样式，勿删 -->
<style lang="less">
@import '~vux/src/styles/reset.less';
</style>
