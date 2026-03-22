const {regist} = require('../../api/regist')

Page({
  data: {
    username: "",
    password: "",
    confirmPassword: ""
  },

  onUsernameInput(e: WechatMiniprogram.Input) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e: WechatMiniprogram.Input) {
    this.setData({ password: e.detail.value });
  },

  onConfirmPasswordInput(e: WechatMiniprogram.Input) {
    this.setData({ confirmPassword: e.detail.value });
  },

  async onRegisterTap() {
    const { username, password, confirmPassword } = this.data as {
      username: string;
      password: string;
      confirmPassword: string;
    };

    if (!username || !password || !confirmPassword) {
      wx.showToast({
        title: "请完整填写信息",
        icon: "none"
      });
      return;
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: "两次密码不一致",
        icon: "none"
      });
      return;
    }

    try {
      const registRes = await regist(this.data);
      console.log(registRes);
      
      wx.setStorageSync("token", registRes.token);
      wx.setStorageSync("userInfo",{id:registRes.id,username:registRes.username} || {});
      wx.showToast({
        title: "注册成功",
        icon: "success"
      });
  
      setTimeout(() => {
        wx.redirectTo({
          url: "/pages/index/index"
        });
      }, 500);
    } catch (error) {
      console.log(error);
      
      wx.showToast({
        title: "注册失败",
        icon: "error"
      });
    }
    
    
  },

  onGoLoginTap() {
    // 返回上一页（登录页）
    wx.navigateBack();
  }
});

