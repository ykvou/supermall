<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    props:{
      link:String,
      activeColor:{
        type:String,
        default:"#f98995"
      }
    },
    data(){
      return {
        // isActive: true
      }
    },
    computed:{
      isActive(){
        //动态判断该路由是否活跃
        // /home -> item1(/home) = true
        return this.$route.path.indexOf(this.link) !== -1
      },
      activeStyle(){
        return this.isActive ? {color:this.activeColor} : {}
      }
    },
    methods:{
      itemClick(){
        this.$router.replace(this.link).catch(err => err)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 13px;
  }
  .tab-bar-item img{
    vertical-align: middle;
    margin-top: 6px;
    margin-bottom: 2px;
  }
</style>
