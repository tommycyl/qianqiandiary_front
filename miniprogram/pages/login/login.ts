const lottie = require('lottie-miniprogram');
const {login,getUserInfo,wxlogin} = require('../../api/login');
Page({
  data: {
    username: "",
    password: "",
    avatarUrl: ''
  },
  onReady() {
    this.initLottie()
  },
  initLottie() {
    wx.createSelectorQuery()
      .select('#lottieCanvas') // 对应 wxml 的 id
      .node(res => {
        const canvas = res.node
        if (!canvas) return

        const context = canvas.getContext('2d')
        lottie.setup(canvas) // 必须先 setup

        try {
          // 1. 获取文件管理器
          const fs = wx.getFileSystemManager()
          // 2. 读取本地 JSON（路径从项目根目录开始，不要写 ../）
          const jsonData : string = fs.readFileSync('assets/anima/logindog.json', 'utf8') as string;
          const animationData = JSON.parse(jsonData)

          // 3. 渲染动画
          lottie.loadAnimation({
            loop: true,
            autoplay: true,
            animationData: animationData, // 直接传对象，不写 path
            rendererSettings: { context }
          })
        } catch (err) {
          console.error("加载失败，请检查文件路径是否正确", err)
        }
      }).exec()
  },

  onUsernameInput(e: WechatMiniprogram.Input) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e: WechatMiniprogram.Input) {
    this.setData({ password: e.detail.value });
  },

  async onLoginTap() {
    const { username, password } = this.data as {
      username: string;
      password: string;
    };

    if (!username || !password) {
      wx.showToast({
        title: "请输入用户名和密码",
        icon: "none"
      });
      return;
    }

    try {
      const loginRes =  await login(this.data);
      wx.setStorageSync('token', loginRes.token);
      wx.setStorageSync('userInfo', {id:loginRes.id,username:loginRes.username} || {});
      wx.showToast({
        title: "登录成功",
        icon: "success"
      });
      setTimeout(() => {
        wx.redirectTo({
          url: "/pages/index/index"
        });
      }, 200);
    } catch (error) {
      wx.showToast({
        title:"用户名或密码错误",
        icon: "error"
      })
    }
  },

  onRegisterTap() {
    wx.navigateTo({
      url: "/pages/register/register"
    });
  },
  async onWxLoginTap(){
    wx.showLoading({ title: '正在登录...' });
    const res = await wx.login();
    console.log(res.code);
    
    const resWxlogin = await wxlogin({
      code:res.code
    });
    wx.setStorageSync('token', resWxlogin.token);
      wx.setStorageSync('userInfo', {id:resWxlogin.id,username:resWxlogin.username} || {});
      wx.showToast({
        title: "登录成功",
        icon: "success"
      });
      setTimeout(() => {
        wx.redirectTo({
          url: "/pages/index/index"
        });
      }, 200);
  }
});

