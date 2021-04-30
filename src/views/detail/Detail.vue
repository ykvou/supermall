<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" :probe-type="3" @imageLoad="imageLoad"/>
      <detail-params-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop" class="back-top"/>
    <toast :message="message" :show="show"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamsInfo from "./childComps/DetailParamsInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop";
  import Toast from "components/common/toast/Toast";

  import {getDetail,GoodsInfo,Shop,GoodsParam,getRecommend} from "network/detail";
  import {debounce} from "common/utils";

  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    data(){
      return {
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
        isShowBackTop:false,
        message:"",
        show:false
      }
    },
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamsInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      BackTop,
      Toast
    },
    created() {
      //1.获取的iid
      this.iid = this.$route.params.iid
      //2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        //获取顶部的图片轮播数据
        const data = res.result
        this.topImages = data.itemInfo.topImages

        //获取商品信息
        this.goods = new GoodsInfo(data.itemInfo,data.columns,data.shopInfo.services)

        //获取店铺信息
        this.shop = new Shop(data.shopInfo)

        //获取商品详情信息
        this.detailInfo = data.detailInfo

        //获取参数
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        //获取评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }

        /*this.$nextTick(() => {
          this.themeTopYs = []

          this.themeTopYs.push(44)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop+44)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop+44)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop+44)

          console.log(this.themeTopYs);
        })*/
      })
      //3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
      //4.给getThemeTopY赋值，进行防抖
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
        this.themeTopYs.push(Number.MAX_VALUE)
      })
    },
    updated() {

    },
    methods:{
      ...mapActions(['addCart']),
      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],300)
      },
      contentScroll(position){
        //1.获取y值，滚动的位置
        const positionY = -position.y
        //2.positionY和主题中的值进行对比
        let length = this.themeTopYs.length
        for(let i = 0;i < length; i++){
          /*
          * 2.positionY和主题中值进行对比
          * [0, 13749, 15031, 15247]
          * positionY在 0 和 13749 之间，index = 0
          * positionY在 13749 和 15031 之间，index = 1
          * positionY在 15031 和 15247 之间，index = 2
          * positionY在 15247 以上，index = 3
          *
          * 以下的判断包括三部分：
          * 1. this.currentIndex !== i -->防止赋值的过程过于频繁
          * 2. && 后面的第一个括号中用来判断滚动的位置是否在两个数之间，i < length - 1 --> 不是最后一个边界值
          * 3. || 后面的括号中用来将滚动位置与数组中最后一个边界值进行比较，超过这个位置的就是最后的状态
          * */
          /*if(this.currentIndex !== i &&
            ((i < length -1 && positionY > this.themeTopYs[i]
              && positionY < this.themeTopYs[i+1])
              || (i === length - 1 && positionY > this.themeTopYs[i]))){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }*/
          /*hack做法*/
          if(this.currentIndex !== i && (i < length -1 && positionY > this.themeTopYs[i]
            && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        //3.是否显示回到顶部
        this.isShowBackTop = (-position.y) > 1000
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0,300)
      },
      addToCart(){
        //1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid//用于判断添加的商品是否唯一

        //2.将商品添加到购物车里(1.Promise 2.mapActions)
        //this.$store.cartList.push(product)
        // this.$store.commit('addCart',product)
        /*this.$store.dispatch('addCart',product).then(res => {
          console.log(res);
        })*/
        this.addCart(product).then(res => {
          /*this.show = true
          this.message = res

          setTimeout(() => {
            this.show = false
            this.message = ""
          },2000)*/
          this.$toast.show(res,2000)
        })
      }
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
    height: calc(100% - 44px - 58px);
    overflow: hidden;
  }
  .back-top{
    position: fixed;
    bottom: 55px;
  }
</style>
