import {debounce} from './utils.js'

import BackTop from "components/content/backTop/BackTop"

export const itemListenerMixin = {
  data(){
    return {
       itemImgListener: null
    }
  },
  mounted() {
  //1.图片加载完成的事件监听
         this.refresh = debounce(this.$refs.scroll.refresh, 100)
         //对监听的事件进行保存
         this.itemImgListener = () =>{
           this.refresh()
        }
       this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components:{
    BackTop
  },
  data(){
    return {
      isShowBackTop: false
    }
  },
  methods:{
    backClick(){
      this.$refs.scroll.scrollTo(0,0,300)
    }
  }
}
