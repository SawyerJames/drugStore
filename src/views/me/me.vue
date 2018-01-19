<template>
    <div class="me">
        <div class="me-top">
            <div class="touxiang">
                <img :src="me_data.Img">
            </div>
            <div class="userinfo">
                <p class="usernamei">{{me_data.Username}}</p>
                <!--  <p>联系电话：{{me_data.Phone}}</p> -->
            </div>
        </div>
        <router-link tag="div" to="/order">
            <div class="dingdan">
                <p class="medingdan">我的订单</p>
                <img src="../../assets/picture/jiantou.png">
            </div>
        </router-link>
        <router-link tag="div" to="/newaddress">
            <div class="dingdan">
                <p class="medingdan">地址管理</p>
                <img src="../../assets/picture/jiantou.png">
            </div>
        </router-link>
        <btclick :isIndex="isIndex"></btclick>
    </div>
</template>
<script type="text/javascript">
import btclick from '@/components/btclick'
export default {
    name: 'me',
    data() {
        return {
            isIndex: 2,
            me_data: [],
            userid: ''
        }
    },
    components: {
        btclick
    },
    mounted() {
        // Uid
        this.userid = this.$store.state.Uid;
        //认证标志
        this.GetDelivery();

    },
    activated() {
        document.title = "个人中心";
    },
    methods: {
        //获取用户信息
        GetDelivery(delivery) {
            var that = this;
            // 加载数据
            this.$tools.GetDataFromServer(
                this,
                this.$api.me + this.userid,
                function success(res) {
                    that.me_data = res.data;
                },
                function error(err) {
                    return
                }
            )
        }

    }
}
</script>
<style type="text/css" scoped>
.me-top {
    width: 100%;
    margin-top: 16px;
    border-bottom: 6px solid #edf2f5;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
}

.touxiang {
    width: 26%;
    text-align: center;
}

.touxiang img {
    width: 2.875rem;
    height: 2.875rem;
}

.userinfo {
    width: 70%;
    padding-bottom: 1rem;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    -moz-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
}

.userinfo h2 {
    width: 100%;
}

.userinfo .usernamei {
    padding-top: 0.6rem;
    font-size: 0.875rem;
    color: #000;
}

.userinfo p {
    font-size: 0.75rem;
    color: #aaa;
}

.dingdan {
    border-bottom: 1px solid #edf2f5;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
}

.medingdan {
    padding: 1rem 0rem 1rem 2rem;
    font-size: 0.875rem;
    color: #3d3c3c;
}

.dingdan img {
    width: 0.75rem;
    height: 0.875rem;
    padding-right: 1rem;
    padding-top: 1.3rem;
}
</style>
