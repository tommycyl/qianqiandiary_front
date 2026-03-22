const {getStat}  = require('../../api/stat');
// import { getStat } from "../../api/stat";

Page({
  data: {
    // 数据还原
    streakDays: 0,
    totalCount: 0,
    mosttype:0,
    // 图例和环形图数据
    chartData: [
      { name: '职业成就', count: 0, percentage: 0, color: '#fdd835', percentageColor: '#fdd835' }, // 鲜黄
      { name: '身体健康', count: 0, percentage: 0, color: '#ffb3ba' }, // 浅红
      { name: '人际关系', count: 0, percentage: 0, color: '#81c784' }, // 浅绿
      { name: '个人成长', count: 0, percentage: 0, color: '#e0cda7' }, // 浅棕
      { name: '日常微光', count: 0, percentage: 0, color: '#9575cd' }   // 浅紫
    ],
  },

  async onReady() {
    const userInfo = wx.getStorageSync('userInfo');
    let {chartData,streakDays,totalCount,mosttype} = this.data;
    try {
      const res =  await getStat({
        id:userInfo.id
      });
      // 找到出现最多次的成功类型
      
      streakDays = res.days;
      totalCount = res.totalCount;
      if (res.stats && res.stats.length > 0) {
        const allcounts = res.stats.map((item: any) => item.count);
        const maxindex = allcounts.indexOf(Math.max(...allcounts));
        mosttype = res.stats[maxindex].type
        res.stats.map((item:any) =>{
          chartData[item.type].count = item.count;
          chartData[item.type].percentage = Math.round((item.count/totalCount)*100);
        })
      }else{
        mosttype = 0
        chartData.map((item:any) =>{
          item.count = 0;
          item.percentage = 0;
        })
      }
    } catch (error) {
      console.log(error);
      
      wx.showToast({
        title:"数据请求错误",
        icon:"error"
      })
    };

    this.setData({
      chartData:chartData,
      streakDays:streakDays,
      totalCount:totalCount,
      mosttype:mosttype
    })

    this.initChart();
  },

  // 初始化并绘制环形图
  initChart() {
    const query = wx.createSelectorQuery()
    query.select('#ringChart')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        this.drawRingChart(ctx, res[0].width, res[0].height);
      })
  },

  drawRingChart(ctx: any, width: any, height: any) {
    const data = this.data.chartData;
    const colors = data.map(item => item.color);
    const percentages = data.map(item => item.percentage);
    
    // 绘图参数设置
    const cx = width / 2;
    const cy = height / 2;
    const outerRadius = width * 0.45; // 外半径
    const innerRadius = outerRadius * 0.6; // 内半径
  
    // 【核心修改 1】：计算环的厚度
    const ringWidth = outerRadius - innerRadius; 
    
    let startAngle = -0.5 * Math.PI; // 12点方向开始
  
    // 清除画布
    ctx.clearRect(0, 0, width * wx.getSystemInfoSync().pixelRatio, height * wx.getSystemInfoSync().pixelRatio);
  
    // 绘制环形扇区
    percentages.forEach((percentage, index) => {
      // 如果占比为 0，跳过绘制，防止出现多余的线条
      if (percentage <= 0) return;
  
      const angle = (percentage / 100) * 2 * Math.PI;
      const endAngle = startAngle + angle;
  
      ctx.beginPath();
  
      // 【核心修改 2】：使用 `arc` 的第 5 和第 6 个参数，并配合 `ctx.stroke()` 绘制有厚度的弧线
  
      // 1. 设置线条宽度为环的厚度
      ctx.lineWidth = ringWidth;
      // 2. 设置线条颜色（也就是扇区的颜色）
      ctx.strokeStyle = colors[index];
      // 3. 设置线条末端样式（'butt' 表示平齐，'round' 表示圆角，根据需要选择）
      ctx.lineCap = 'butt'; 
  
      // 4. 绘制圆弧。
      // 注意：这里的半径需要取【外半径和内半径的中间值】，因为 lineWidth 是向两侧扩展的。
      const middleRadius = (outerRadius + innerRadius) / 2;
      ctx.arc(cx, cy, middleRadius, startAngle, endAngle);
  
      // 5. 【核心修改 3】：使用 `stroke()`（描边）而不是 `fill()`（填充）
      ctx.stroke();
  
      startAngle = endAngle;
    });
  
    // 【核心修改 4】：彻底删除原有的“绘制中间白色圆圈”的代码块
    /* ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    */
  }
})