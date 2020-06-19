<template>
  <div class="wrapper">
  <ul class="content">
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
    <li>分类列表</li>
  </ul>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

    export default {
        name: "Category",
        data(){
          return{
            scroll: null
          }
        },

        // 组件创建完后调用
        created(){
         // this.scroll = new BScroll('.wrapper',{

         //  })
        },
        mounted(){
          this.scroll = new BScroll(document.querySelector('.wrapper'),{
            probeType: 2,
            pullingUp: true
           })
           this.scroll.on('scroll', (position) => {
             console.log(position)
           })
           this.scroll.on('pullingUp', () => {
             console.log("上拉加载更多")
           })
        }
    }
</script>

<style scoped>
  .wrapper{
    height: 150px;
    background-color: red;

    overflow: hidden;
    /* overflow-f: scroll; */
  }
</style>
