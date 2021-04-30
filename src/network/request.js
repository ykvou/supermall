import axios from "axios";

//终极版，因为instance本身就是Promise对象
export function request(config) {
  //1.创建axios的实例
  const instance = axios.create({
    baseURL:'http://152.136.185.210:7878/api/m5',
    timeout:5000
  })

  //2.axios的拦截器
  //请求拦截的作用
  instance.interceptors.request.use(config => {
    return config//拦截之后要记得返回
  },error => {
    console.log(error)
  });//拦截请求

  instance.interceptors.response.use(res => {
    return res.data//拦截之后要记得返回，返回需要的数据
  },err => {
    console.log(err)
  })//拦截响应

  //发送真正的网络请求
  return instance(config)
}


