<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"></tab-control>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
                   @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 在需要监听一个组件的原生事件时，必须给对应的事件加上.native修饰符，才能进行监听 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from "components/common/scroll/Scroll"


  import {getHomeMultidata, getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from 'common/mixin'


  export default {
      name: "Home",
      components:{
        HomeSwiper,
        RecommendView,
        FeatureView,
        NavBar,
        TabControl,
        GoodsList,
        Scroll,
      },
      mixins:[itemListenerMixin, backTopMixin],
      data() {
        return {
          banners: [],
          recommends: [],
          goods:{
            'pop': {page: 0, list: []},
            'new': {page: 0, list: []},
            'sell': {page: 0, list: []},
          },
          currentType :'pop',
          tabOffsetTop: 0,
          isTabFixed: false,
          saveY: 0
        }
      },
      computed: {
        showGoods(){
          return this.goods[this.currentType].list
        }
      },
      activated(){
        this.$refs.scroll.scrollTo(0,this.saveY,0)
        this.$refs.scroll.refresh()
      },
      deactivated() {
        //1.保存Y值
        this.saveY = this.$refs.scroll.getScrollY()

        //2.取消全局事件的监听
        this.$bus.$off('itemImgLoad', this.itemImgListener)
      },
      created(){
        //1.请求多个数据
       this.getHomeMultidata()

        //2.请求商品数据
       this.getHomeGoods('pop')
       this.getHomeGoods('new')
       this.getHomeGoods('sell')
       },
       mounted(){

       },
      methods: {
        /**
         * 事件监听相关得方法
         */

        tabClick(index){
          switch (index){
            case 0:
              this.currentType = 'pop'
              break
            case 1:
              this.currentType = 'new'
              break
            case 2:
              this.currentType = 'sell'
              break
          }

          //让两个tabControl的currentIndex保持一致
          this.$refs.tabControl1.currentIndex = index;
          this.$refs.tabControl2.currentIndex = index;
        },


        contentScroll(position){
          //1.判断BackTop是否显示
          this.isShowBackTop = (-position.y) > 1000

          //2.决定tabControl是否吸顶（position：fixed)
          this.isTabFixed = (-position.y) > this.tabOffsetTop
        },
        loadMore(){
          this.getHomeGoods(this.currentType)
        },
        swiperImageLoad(){
          this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        },
        /**
         * 网络请求相关得方法
         */
        getHomeMultidata(){
          getHomeMultidata().then(res => {
            this.banners = res.data.banner.list;
            this.recommends = res.data.recommend.list;
          })
        },
        getHomeGoods(type){
          const page = this.goods[type].page + 1
          getHomeGoods(type, page).then(res =>{
            this.goods[type].list.push(...res.data.list)
            this.goods[type].page += 1

            //完成上拉加载更多
            this.$refs.scroll.finishPullUp()
          })
        }
      }
  }
</script>

<style scoped>
  #home{
   /* padding-top: 44px; */
   height: 100vh;
   position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: #fff;

   /* position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }


 .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 9;
  }


 /* .content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
</style>
