<template>
    <div class="map" style="width:100%;height:100%;">
        <div id="container" style="width:100%;height: 100%;"></div>
    </div>
</template>
<!--script开始-->
<script type="text/javascript">
export default {
    name: 'map',
    data() {
        return {
            P_lnt: '', //药店经度
            P_lat: '',
            homelong: '', //家的经度
            homedlat: '', //家的纬度
            longitude: '', //快递员经度位置
            latitude: '', //快递员纬度位置
            poster_position: null,
            home: null,
            Pharmacy: null,
            poster: 'oMPfAv1pyiWcXdWlfACJ2FJx9zd8', //快递员id
            pid: '', //药店id包含经纬度
            timer: function() {}
        }
    },
    mounted() {
        //认证标志
        this.loaded();
    },
    activated() {
        this.pid = this.$route.params.positionLocation; //positionLocation从订单列表传来
        this.homelong = this.$route.params.Order_lat; //订单经度
        this.homedlat = this.$route.params.Order_lng; //订单纬度
        this.GetUrserLocation();
        document.title = "查看派送员位置";
        // 全局变量存储maps定时器
        this.$store.state.mapsTime = setInterval(this.maps, 1000);
    },
    deactivated() {
        // 清除定时器：不再获取地址信息
        clearInterval(this.$store.state.mapsTime);
    },
    methods: {
        // 加载map地图
        loaded(index) {
            var citylocation, map, marker = null; //定义根据id查找城市
            var map = new qq.maps.Map(document.getElementById("container"), {
                    // 地图的中心地理坐标。
                    center: new qq.maps.LatLng(this.homedlat, this.homelong), //初始位置也是购药人位置，腾讯地图纬度在前，经度在后。
                    zoom: 15
                })
                //获取城市列表接口设置中心点
            citylocation = new qq.maps.CityService({
                complete: function(result) {
                    map.setCenter(result.detail.latLng);
                }
            });

            //调用searchLocalCity();方法    根据用户IP查询城市信息。
            citylocation.searchLocalCity();


            this.home = new qq.maps.Marker({
                    //设置Marker的位置坐标
                    position: new qq.maps.LatLng(this.homedlat, this.homelong),
                    //设置显示Marker的地图
                    map: map

                })
                //药店位置
            this.Pharmacy = new qq.maps.Marker({
                //设置Marker的位置坐标
                position: new qq.maps.LatLng(this.P_lat,this.P_lnt),
                //设置显示Marker的地图
                map: map
            })

            //配送员初始位置
            this.poster_position = new qq.maps.Marker({
                    //设置Marker的位置坐标
                    position: new qq.maps.LatLng(this.Lat, this.Lon),
                    //设置显示Marker的地图
                    map: map
                })
                //配送员图标更换
                // //设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
            var anchor = new qq.maps.Point(0, 39),
                size = new qq.maps.Size(35, 35),
                origin = new qq.maps.Point(0, 0),
                poster_position = new qq.maps.MarkerImage(
                    "../../../static/img/courier.png",
                    size,
                    origin,
                    anchor
                );

            this.poster_position.setIcon(poster_position);

            //家的图标
            var anchor = new qq.maps.Point(0, 39),
                size = new qq.maps.Size(35, 35),
                origin = new qq.maps.Point(0, 0),
                home = new qq.maps.MarkerImage(
                    "../../../static/img/home.png",
                    size,
                    origin,
                    anchor
                );

            this.home.setIcon(home);

            //药店图标
            var anchor = new qq.maps.Point(0, 39),
                size = new qq.maps.Size(35, 35),
                origin = new qq.maps.Point(0, 0),
                Pharmacy = new qq.maps.MarkerImage(
                    "../../../static/img/Pharmacy.png",
                    size,
                    origin,
                    anchor
                );

            this.Pharmacy.setIcon(Pharmacy);

        },
        //获取药店位置
        GetUrserLocation(urserLocation) {
            // 加载数据
            var that = this
            this.$vux.loading.show({
                text: "奋力加载中..."
            });
            this.$tools.GetDataFromServer(
                this,
                this.$api.Pharmacy + this.pid, //接收后台传来的药店pid
                function success(res) {
                    that.P_lat = res.data.PharmacyInfo.Lat //纬度
                    that.P_lnt = res.data.PharmacyInfo.Lng //经度
                    that.loaded();
                    that.$vux.loading.hide();
                },
                function error(err) {
                    that.$vux.loading.show({
                        text: "网络错误"
                    });
                    return
                }
            )
        },
        // 刷新快递员位置
        maps() {
            //接收后台传入的地址
            var that = this
            this.$tools.GetDataFromServer(
                this,
                this.$api.poster + this.poster,
                function success(res) {
                    var Lat = res.data.PrecisionAddress.Lat
                    var Lon = res.data.PrecisionAddress.Lon
                    that.poster_position.moveTo(new qq.maps.LatLng(Lat, Lon), 50)
                },
                function error(err) {
                    return
                }
            )
        },

    }
}
</script>
<style>
</style>
