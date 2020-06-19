<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick"
                    ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo"
                         @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
     <detail-comment-info ref="comment" :comment-info="commentInfo"/>
    <goods-list ref="recommend" :goods="recommends"/>
   </scroll>
   <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
   <!-- <toast :message="message" :show="show"/> -->
   </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar.vue'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamInfo from './childComps/DetailParamInfo.vue'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailBottomBar from './childComps/DetailBottomBar.vue'

  import Scroll from 'components/common/scroll/Scroll.vue'
  import GoodsList from 'components/content/goods/GoodsList.vue'
  // import Toast from 'components/common/toast/Toast'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail.js'
  import {debounce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from 'common/mixin.js'

  import {mapActions} from 'vuex'
  export default{
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      // Toast
    },
    mixins:[itemListenerMixin, backTopMixin],
    data(){
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends: [],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex: 0,
        // message: '',
        // show:false
      }
    },
    created() {
      //1.保存传入的iid
      this.iid = this.$route.params.iid

      //2.根据iid请求数据
      getDetail(this.iid).then(res => {
        //1.获取顶部图片轮播数据
        const data = res.result
        this.topImages = data.itemInfo.topImages

        //2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        //4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        //5.获取商品参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //6.获取用户评价信息
       if (data.rate.cRate !== 0) {
         this.commentInfo = data.rate.list[0];
       }
     })

     //3.请求推荐数据
     getRecommend().then(res => {
      this.recommends = res.data.list
     })

     //4.给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
     this.getThemeTopY = debounce(() => {
       //根据最新的数据，对应的DOM已经被渲染出来了
       //但是图片依然没有加载完(目前获取的offsetTop不包含其中的图片)
       this.themeTopYs = []
       this.themeTopYs.push(0)
       this.themeTopYs.push(this.$refs.params.$el.offsetTop)
       this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
       this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
       this.themeTopYs.push(Number.MAX_VALUE)
     }, 100)
    },
    methods:{
      ...mapActions(['addCart']),
      imageLoad(){
        this.$refs.scroll.refresh()

        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position){
        //1.获取y值
        const positionY = -position.y
        //2.positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        for (let i = 0; i < length-1; i++) {

          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
          // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY <
          // this.themeTopYs[i+1]) || (i === length - 1 && positionY > this.themeTopYs[i]))){
          //   this.currentIndex = i
          //   // console.log(this.currentIndex)
          //   this.$refs.nav.currentIndex = this.currentIndex
        }
            //3.显示是否回到顶部
         this.isShowBackTop = (-position.y) > 1000
      },
      addToCart(){
        //1.获取购物车需要展示的信息
        const produce = {}
        produce.iid = this.iid
        produce.image = this.topImages[0]
        produce.title = this.goods.title
        produce.desc = this.goods.desc
        produce.price = this.goods.realPrice
            
        //2.将商品添加到购物车
        this.addCart(produce).then(res => {
          // this.show = true
          // this.message = res

          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // },1500)
          this.$toast.show()
        })

        // this.$store.dispatch('addCart', produce).then(res => {
        //   console.log(res)
        // })
      }
    },
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content{
    height: calc(100% - 44px - 49px);
  /*  overflow: hidden; */
  }
</style>
