const {getAllDays,getDiary,getOnedayDiary,addDiary,deleteDiary} = require("../../api/diary")
const {addVirtue,getVirtue,updateVirtue} = require('../../api/virtue')
Page({
  data: {
    showVision:false,
    array: ['职业成就', '身体健康', '人际关系', '个人成长','日常微光'],
    // 当前选择的索引值（默认0，即第一项）
    index: 0,
    diary:{},
    title:'',
    content:'',
    showdetail:false,
    showPopUp: false, // 控制弹出卡片显示的标志
    showUpdate: false,
    editingid:"",
    editingindex:0,
    editingTitle: '',   // 中转站：存储当前正在编辑的标题
    editingContent: '',
    type:0,  // 中转站：存储当前正在编辑的内容
    username:'',
    // 当前 tab：home | diary | virtue | vision | stats | mine
    currentTab: 'home',
    navTitle: '闪光时刻',
    tabPlaceholder: '功能开发中',
    // 当前日期
    currentDate: '',
    // 是否显示行动指南
    showGuide: false,
    // 是否已打卡
    isChecked: false,
    // 日记：日历（1:1 设计：可切换月份、可选日期）
    calendarYear: 2026,
    calendarMonth: 3,
    calendarMonthName: '三月',
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    days: [] as number[],
    daysWithStatus:[{}],
    selectedDay: 0,        // 当前选中的日期（0 表示未选）
    recordsWithEntry: [7], // 当前月有记录的日期（示例：3 月 7 日）
    // todayRecords: [
    //   { id: 1, tag: '日常微光', tagClass: 'tag-daily', icon: '☀', content: '早起给自己做了一顿丰盛的早餐。' },
    //   { id: 2, tag: '个人成长', tagClass: 'tag-growth', icon: '📖', content: '读完了一章《小狗钱钱》，做了笔记。' }
    // ],
    // 高光时刻/今日日记列表（>2 条时折叠，点击「查看全部记录」展开）
    showAllHighlights: false,
    highlights: [] as any,
    Virtue: [{
      name: '友好亲和',
      description: '最美好的事情莫过于温和待人。',
      guidelines: [
        '祝愿他人生活幸福',
        '不伤害他人，不介入纷争',
        '谦虚尊重他人，我不必永远正确'
      ]
    },
    {
      name: '勇于承担',
      description: '最美好的事情莫过于直面责任。',
      guidelines: [
        '遇事坚定自主抉择',
        '专注自身能做的事',
        '动承担责任，赋予自我权力'
      ]
    },
    {
      name: '善待他人',
      description: '最美好的事情莫过于温暖待人。',
      guidelines: [
        '多称赞他人，沉默也比伤人好',
        '不随意批评身边的人',
        '用心聚焦他人的优点'
      ]
    },
    {
      name: '帮助给予',
      description: '最美好的事情莫过于帮助他人',
      guidelines: [
        '祝愿身边的人一切顺利',
        '主动表达善意与温暖',
        '把帮助别人当作最大的快乐'
      ]
    },
    {
      name: '感恩之心',
      description: '最美好的事情莫过于心怀感激',
      guidelines: [
        '感恩生活中的日常小事',
        '在困境中积极寻找希望',
        '珍惜身边的每一份陪伴'
      ]
    },
    {
      name: '勤学不辍',
      description: '最美好的事情莫过于持续成长',
      guidelines: [
        '始终保持谦恭好学的心态',
        '坚持读书、记录，向他人学习',
        '只与过去的自己较劲，持续进化'
      ]
    },
    {
      name: '值得信赖',
      description: '最美好的事情莫过于信守承诺',
      guidelines: [
        '用良好习惯成就更好的自己',
        '坚信自律比天赋更为重要',
        '始终守时守信，信守每一个承诺'
      ]
    }
    ],
    // 当前美德
    currentVirtue: {},
    // 愿景板列表
    visions: [
      {
        id: 1,
        image: 'https://pic.tommy.xx.kg/life.jpg'
      },
      {
        id: 2,
        image: 'https://pic.tommy.xx.kg/dream.jpg'
      },
      {
        id: 3,
        image: 'https://pic.tommy.xx.kg/money.jpg'
      },
      {
        id: 3,
        image: 'https://pic.tommy.xx.kg/love.jpg'
      }
    ]
  },

  onLoad() {
    this.initVirtue();
    this.updateCurrentDate();
    const userInfo = wx.getStorageSync('userInfo');
    const now = new Date();
    const month = now.getMonth() + 1;
    this.setData({
      username: userInfo.username || '新用户',
      calendarMonth:month
    });
    // 调用 buildCalendar 即可完成初始化渲染
    this.buildCalendar();
    this.getOnedaydiary();
  },

  onShow() {
    this.updateCurrentDate();
  },
  async initVirtue() {
    const {Virtue} = this.data;
    const rond = Math.trunc(Math.random() * 7);
    const userInfo = wx.getStorageSync('userInfo');
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const localDate = `${year}-${month}-${day}`; 

    const resGetVirtue = await getVirtue({
      user_id:userInfo.id,
      create_time:localDate
    })
    
    if (!resGetVirtue) {
      await addVirtue({
        user_id:userInfo.id,
        type:rond,
        state:0
      })
      this.setData({
        currentVirtue:Virtue[rond],
      }) 
    }else{
      this.setData({
        currentVirtue:Virtue[resGetVirtue.type],
        isChecked:resGetVirtue.state == 0 ? false : true
      })
    }
  },

  async getOnedaydiary(){
    const now = new Date();
    const calendarYear = now.getFullYear();
    const calendarMonth = now.getMonth() + 1;
    const day = now.getDate();
    const userInfo = wx.getStorageSync('userInfo');
      // 确保月份是 "2026-03" 这种格式
    const time = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const res = await getOnedayDiary({
      user_id:userInfo.id,
      create_time:time
    });
    this.setData({
      highlights:res
    })
  },

  async buildCalendar() {
    
    const { calendarYear, calendarMonth, monthNames } = this.data;
    // 1. 计算当前月有多少天
    const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();
    // 2. 计算第一天是周几 (0-6)
    const firstDay = new Date(calendarYear, calendarMonth - 1, 1).getDay();
    
    const days: number[] = [];
    // 填充月初空白
    for (let i = 0; i < firstDay; i++) days.push(0);
    // 填充日期
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
  
    const calendarMonthName = monthNames[calendarMonth - 1] || '';
    
    // 3. 模拟获取当前月有记录的日期（实际开发中这里应该调用 API）
    // 仅 2026 年 3 月示例有记录，其它月份为空
    // const recordsWithEntry = (calendarYear === 2026 && calendarMonth === 3) ? [7, 8, 9] : [];
    let recordsWithEntry: number[] = [];
    try {
      const userInfo = wx.getStorageSync('userInfo');
      // 确保月份是 "2026-03" 这种格式
      const time = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}`;
      
      const resAlldays = await getAllDays({
        user_id: userInfo.id,
        create_time: time
      });
  
      recordsWithEntry = resAlldays;
      // 【关键检查】如果接口返回的是字符串数组，转成数字数组
      if (resAlldays && resAlldays.data) {
        
      }
    } catch (err) {
      console.error("获取日历记录失败:", err);
      // 即使失败也给个空数组，保证页面不崩溃
      recordsWithEntry = [];
    }
    
    // 4. 【核心修复】同步更新 daysWithStatus
    const daysWithStatus = days.map(item => {
      return {
        value: item,
        hasRecord: recordsWithEntry.includes(item)
      };
    });
  
    // 一次性 setData
    this.setData({ 
      days, 
      calendarMonthName, 
      selectedDay: 0, 
      recordsWithEntry,
      daysWithStatus // 更新这个数组，WXML 才会变化
    });
  },
  prevMonth() {
    let { calendarYear, calendarMonth } = this.data;
    calendarMonth--;
    if (calendarMonth < 1) { calendarMonth = 12; calendarYear--; }
    this.setData({ calendarYear, calendarMonth });
    this.buildCalendar();
  },

  nextMonth() {
    let { calendarYear, calendarMonth } = this.data;
    calendarMonth++;
    if (calendarMonth > 12) { calendarMonth = 1; calendarYear++; }
    this.setData({ calendarYear, calendarMonth });
    this.buildCalendar();
  },

  async onSelectDay(e: WechatMiniprogram.TouchEvent) {
    const day = e.currentTarget.dataset.day as number;
    const month = this.data.calendarMonth;
    const year = this.data.calendarYear;
    const time = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const userInfo = wx.getStorageSync('userInfo');
    const resdiary =  await getOnedayDiary({
      user_id:userInfo.id,
      create_time:time
    });
    
    this.setData({
      highlights:resdiary
    })
    
    if (day == null || day <= 0) return;
    // 2. 核心逻辑：判断是否是“二次点击”
    if (this.data.selectedDay === day) {
    // 如果当前选中的就是这个号，则取消选中（设为 0）
    this.setData({ selectedDay: 0 });
    
    } else {
    // 否则，切换到新选中的日期
    this.setData({ selectedDay: day });
    }
  },

  onEditRecord(e: WechatMiniprogram.TouchEvent) {
    const  {id,title, content,index,type}  = e.currentTarget.dataset; 
    
    this.setData({
      showUpdate:!this.data.showUpdate,
      editingid:id,
      editingTitle:title,
      editingContent:content,
      editingindex:index,
      type:type
    })
  },

  closeUpdate(e:any){
    this.setData({
      showUpdate:false
    })
  },

  updateDiary(e:any){
    const {diaryid,title,content,index} = e.detail;
    const update = {
      id:diaryid,
      title:title,
      content:content
    }
    // 更换原数组的数据
    const highlights = this.data.highlights;
    highlights.splice(index,1,update);
    
    this.setData({
      highlights:highlights
    })
  },

  onDeleteRecord(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    const highlights = this.data.highlights;
    wx.showModal({
      title: '提示',
      content: '确定删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          deleteDiary({
            id:id
          });
          wx.showToast({ title: '已删除', icon: 'success' });
          highlights.splice(index,1)
          this.setData({
            highlights:highlights
          })
        }
      }
    });
  },

  onNavRightTap() {
    if (this.data.currentTab === 'home') this.onSettingsTap();
    else wx.showToast({ title: '统计', icon: 'none' });
  },

  // 更新当前日期
  updateCurrentDate() {
    const now = new Date();
    const year = now.getFullYear()
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    this.setData({
      currentDate: `${month}月${date}日 ${weekday}`,
      calendarYear: year,
      calendarMonth:month
    });
  },

  // 切换行动指南显示
  toggleGuide() {
    this.setData({
      showGuide: !this.data.showGuide
    });
  },

  // 标记今日已践行
  async onCheckVirtue() {
    const userInfo = wx.getStorageSync("userInfo")
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const localDate = `${year}-${month}-${day}`; 

    try {
      const res = updateVirtue({
        user_id:userInfo.id,
        create_time:localDate,
        state:1
      })
      if (!res) {
        wx.showToast({
          title: '更新信息失败',
          icon: "error",
          duration: 1500
        });
        return;
      }
      this.setData({
        isChecked: true
      });
      wx.showToast({
        title: '打卡成功！',
        icon: 'success',
        duration: 1500
      });
    } catch (error) {
      wx.showToast({
        title: '获取信息失败',
        icon: "error",
        duration: 1500
      });
    }
  },


  // 统计按钮
  onStatistics(e: WechatMiniprogram.TouchEvent) {
    wx.navigateTo({
      url: '/pages/statistics/statistics' 
    });
  },

  // 设置按钮
  onSettingsTap() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none',
      duration: 1500
    });
  },



  // 点击高光时刻项
  onHighlightTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
  },

  // 查看全部记录 / 收起：展开或收起今日日记（仅当数量 >2 时显示）
  onToggleAllRecords() {
    this.setData({ showAllHighlights: !this.data.showAllHighlights });
  },

  // 美德统计
  onVirtueStats(e:WechatMiniprogram.TouchEvent) {
    
    wx.navigateTo({
      url: '/pages/virtueStat/virtueStat' 
    });
  },

  // 查看全部愿景
  onViewAllVisions() {
    this.setData({
      currentTab:'vision'
    })
  },

  // 点击愿景
  onVisionTap(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id;
  },

  // 底部导航切换（不跳转页面，只切换上方内容）
  onTabTap(e: WechatMiniprogram.TouchEvent) {
    const tab = e.currentTarget.dataset.tab as string;
    const titles: Record<string, string> = {
      home: '闪光时刻',
      diary: '成功足迹',
      virtue: '美德',
      vision: '愿景',
      mine: '我的'
    };
    const placeholders: Record<string, string> = {
      virtue: '美德功能开发中',
      // vision: '愿景功能开发中',
      stats: '统计功能开发中',
      mine: '我的功能开发中'
    };
    this.setData({
      currentTab: tab,
      navTitle: titles[tab] || '闪光时刻',
      tabPlaceholder: placeholders[tab] || ''
    });
    if (tab == "home") {
      this.getOnedaydiary()
    }
    if (tab == "vision") {
      this.setData({
        showVision:true
      })
    }else{
      this.setData({
        showVision:false
      })
    }
  },
  // 弹出日记的动作
  togglePopUp(e: WechatMiniprogram.TouchEvent){
    this.setData({
      title:"",
      content:"",
      showPopUp: !this.data.showPopUp
    });
  },
  submit(e: WechatMiniprogram.TouchEvent){
    const userInfo = wx.getStorageSync('userInfo');
    const highlights = this.data.highlights;
    const adddiary = {
      user_id:userInfo.id,
      title:this.data.title,
      content:this.data.content,
      type:this.data.index,
      create_time:""
    };
    if (highlights.length >= 5) {
      wx.showToast({
        title:"单日超过五条",
        icon:"error"
      });
      return;
    }
    if (!this.data.title.trim() || !this.data.content.trim()) {
      wx.showToast({
        title:"不能为空",
        icon:"none"
      });
    }else if(this.data.title.trim().length > 15) {
      wx.showToast({
        title:"标题不能超过15字",
        icon:"error"
      });
    }else{
      try {
        addDiary(adddiary);
        highlights.push(adddiary)
        wx.showToast({
          title:"创建成功",
          icon:"success"
        });
        this.setData({
          highlights:highlights,
          showPopUp: !this.data.showPopUp
        });
      } catch (error) {
        wx.showToast({
          title:"创建失败",
          icon:"error"
        });
      }
    }
  },
  onshowdetail(e: WechatMiniprogram.TouchEvent){
    const diary = e.currentTarget.dataset.item;
    this.setData({
      showdetail:true,
      diary:diary
    })
  },
  closedetail(e: WechatMiniprogram.TouchEvent){
    this.setData({
      showdetail:false
    })
  },
  // 监听选择改变
  bindPickerChange: function(e:WechatMiniprogram.TouchEvent) {
    this.setData({
      index: e.detail.value
    })
  },
  quit(){
    wx.navigateTo({
      url: "/pages/login/login"
    });
    wx.clearStorageSync();
  },
});
