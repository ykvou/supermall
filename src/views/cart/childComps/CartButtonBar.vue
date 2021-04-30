<template>
  <div class="button-bar">
    <div class="check-content">
      <check-button :is-check="isSelectAll"
                    class="check-button"
                    @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="total-price">
      合计:{{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去计算: ({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/checkButton/CheckButton";
  import {mapGetters} from 'vuex'
  export default {
    name: "CartButtonBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice(){
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue,item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkLength(){
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll(){
        if (this.cartList.length == 0) return false

        //1.使用filter
        //只要一个不选中就不是全选，当所有都选中，返回的长度为0，取反为true
        // return !(this.cartList.filter(item => !item.checked).length)

        //2.使用find
        //find函数性能更高，找到一个没选中的就返回，然后取反，没有找到的就返回undefined，取反为true
        return !(this.cartList.find(item => !item.checked))

        //3.普通遍历方式
        /*for(let item of this.cartList){
          if(!item.checked){
            return false
          }
        }
        return true*/
      }
    },
    methods:{
      checkClick(){
        if (this.isSelectAll){//全部选中
          this.cartList.forEach(item => item.checked = false)
        }else{//部分或全不选中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick(){
        if (!this.isSelectAll){
          this.$toast.show('请选择购买的商品')
        }
      }
    }
  }
</script>

<style scoped>
  .button-bar{
    height: 40px;
    position: relative;
    line-height: 40px;
    background-color: #eeeeee;
    display: flex;
    font-size: 14px;
  }
  .check-content{
    display: flex;
    align-items: center;
    width: 80px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin: 0 10px;
  }
  .total-price{
    flex: 1;
  }
  .calculate{
    width: 85px;
    background-color: var(--color-tint);
    color: #fff;
    text-align: center;
  }
</style>
