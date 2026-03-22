// components/vision/vision.ts
import { addVision,getVision } from "../../api/vision";

Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    text:"",
    array: ['生活健康', '梦想远方', '物质财富', '感情日常','书籍阅读'],
    // 当前选择的索引值（默认0，即第一项）
    index: 0,
    showPopUp:false,
    vision:[] as any,
    visions: [
      {
        id: 1,
        image: 'https://pic.tommy.xx.kg/life.jpg',
        text: ''
      },
      {
        id: 2,
        image: 'https://pic.tommy.xx.kg/dream.jpg',
        text: ''
      },
      {
        id: 3,
        image: 'https://pic.tommy.xx.kg/money.jpg',
        text: ''
      },
      {
        id: 4,
        image: 'https://pic.tommy.xx.kg/love.jpg',
        text: ''
      },
      {
        id: 5,
        image: 'https://pic.tommy.xx.kg/book.jpg',
        text: ''
      }
    ]
  },

  lifetimes:{
    attached: function() {
      this.getvisions()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange: function(e:WechatMiniprogram.TouchEvent) {
      this.setData({
        index: e.detail.value
      })
    },
// 创建愿景
    async submit(){
      const vision = this.data.vision
      const userInfo = wx.getStorageSync("userInfo")
      const request = {
        user_id:userInfo.id,
        type:this.data.index,
        text:this.data.text
      };
      try {
        wx.showLoading({
          title:"正在添加",
          mask:true
        });
        const res = await addVision(request)
        if (res == 1) {
          wx.hideLoading();
          wx.showToast({
            title:"创建成功",
            icon:"success"
          })
        } else {
          wx.showToast({
            title:"失败",
            icon:"success"
          })
        }
        vision.push(request);
        this.setData({
          showPopUp:false,
          vision:vision
        })
      } catch (error) {
  
      }
    },
    // 按钮事件
    creat_vison(){
      this.setData({
        text:"",
        showPopUp:true
      })
    },
    togglePopUp(){
      this.setData({
        showPopUp:false
      })
    },

    async getvisions(){
      const userInfo = wx.getStorageSync("userInfo")
      const visions = await getVision({
        user_id:userInfo.id
      })
      this.setData({
        vision:visions
      }) 
    }
  }
})