// components/updata.ts
const {updateDiary} = require('../../api/diary')

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    diaryid:{
      type:String,
      value:''
    },
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    index: {
      type: Number,
      value: 0
    },
    type:{
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPopUp:true,

  },

  /**
   * 组件的方法列表
   */
  methods: {


    // 卡片弹出开关
    togglePopUp(e: WechatMiniprogram.TouchEvent){
      this.triggerEvent('close');
      this.setData({
        showPopUp: !this.data.showPopUp
      });
    },

    // 提交数据
    async submit(e:WechatMiniprogram.TouchEvent){
      const {diaryid,title,content,index,type} = this.properties;
      
      try {
        await updateDiary({
          id:diaryid,
          title:title,
          content:content,
          type:type
        })
        wx.showToast({
          title:"修改成功",
          icon:"success"
        })
        this.triggerEvent("updateDiary",{
          diaryid:diaryid,
          title:title,
          content:content,
          index:index,
          type:type
        })
        this.setData({
          showPopUp:false
        })
      } catch (error) {
        wx.showToast({
          title:"修改失败",
          icon:"error"
        })
      };
    }


  }
})