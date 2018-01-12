<template>
    <div id="btclick">
        <ul class="tabBarContainer flexRow">
            <!-- router list-for -->
            <router-link v-for="(item,index) in tabBarList" tag="li" class="tabBar flexCol" :to="{path: item.path}">
                <!-- tabBar icon & msg -->
                <img v-if="index === isIndex" :src="item.imgUrlChoose ">
                <img v-else :src="item.imgUrl">
                <span :class="{ chooseMsg: index === isIndex}">{{item.msg}}</span>
            </router-link>
        </ul>
    </div>
</template>
<script type="text/javascript">
export default {
    name: 'btclick',
    props: ['isIndex'],
    data() {
        return {
            tabBarList: [{
                path: "/",
                imgUrl: require('../assets/tabBar/index.png'),
                imgUrlChoose: require('../assets/tabBar/indexChoose.png'),
                msg: "首页"
            }, {
                path: "shopCar",
                imgUrl: require('../assets/tabBar/about.png'),
                imgUrlChoose: require('../assets/tabBar/aboutChoose.png'),
                msg: "购物车"
            }, {
                path: "center",
                imgUrl: require('../assets/tabBar/center.png'),
                imgUrlChoose: require('../assets/tabBar/centerChoose.png'),
                msg: "个人中心"
            }]
        }
    }
}
</script>
<style type="text/css" scoped>
.tabBarContainer {
    width: 100%;
    height: 4.375rem;
    position: fixed;
    bottom: 0;
    z-index: 10;
    border-top: 1px solid #edf2f5;
    background: #fff;
}

.tabBar {
    width: 33.3%;
    height: 100%;
    justify-content: center;
    -ms-align-items: center;
    align-items: center;
}

.tabBar img {
    width: 2rem;
    height: 2rem;
    margin: .1rem 0;
}

.tabBar span {
    font-size: .875rem;
    color: #5c5e61;
}

.tabHack {
    width: 100%;
    height: 4.375rem;
}

/*选中后颜色*/
.tabBar .chooseMsg {
    color: #459FEB;
}
</style>
