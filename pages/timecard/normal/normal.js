
// pages/timecard/normal/normal.js
//获取应用实例
var app = getApp()
var util = require('../../../utils/util.js')
var amapFile = require('../../../utils/amap-wx.js');

const AV = require('../../../utils/av-weapp-min');
const Check = require('../../../model/check')

Page({
  data: {
    result: '',
    latitude: 0,
    longitude: 0,
    displayTime: null,
    uindex: null,
    index: 0,
    title: null,
    loading: false, // 更新地理位置加载状态
    checkMode: {},
    showTopTips: false,
    content: "",
    userInfo: {},
    openid:{},
    errorMessage: "提示消息",
    UI: [
      { checkType: "打卡目的", current: "Internet ID", locName: "位置名称", locDesc: "详细位置", locNameContent: "等待获取", locDescContent: "等待获取", locButton: "更新定位", submitButton: "提交" }
    ]
  },
  onLoad: function (options) {
    // get global info'
    // var that = this;
    app.getUserInfo();
    let userInfo = app.globalData;
    console.log(userInfo);
    // this.setData({
    //   userId: userInfo.nickName
    // });
  //  console.log(app.globalData);
    // var userInfo = getApp().globalData;
    // console.log(userInfo);

    // 获得传来CourseID
    let info = JSON.parse(options.infoStr);
    this.setData({
      id: info.id
    });
    // var id = info.id;
    // console.log(id);
    // 页面初始化 options为页面跳转所带来的参数
     
    this.setData({
      loading: true
    })
    var selectedLanguage = app.globalData.settings.language;
    var toastTitle = ['定位成功', 'Got Location', '取得完了'][selectedLanguage];
    var that = this;
    var ui = that.data.UI;
    var amap = new amapFile.AMapWX({ key: '8ebbe699d71eed6674889848604e411a' });
    amap.getRegeo({
      success: function (data) {
        //成功回调
        wx.showToast({
          title: toastTitle,
          icon: 'success',
          duration: 1000
        })
        // 改写UI，反映在视图层
        // console.log(data[0])
        ui[selectedLanguage].locNameContent = data[0].name
        ui[selectedLanguage].locDescContent = data[0].desc
        var lat = data[0].latitude;
        var lon = data[0].longitude;
        that.setData({
          UI: ui,
          latitude: lat,
          longitude: lon,
          loading: false
        })
      }
    })
  },

  onReady: function () {
    // 页面渲染完成
    this.setData({
      displayTime: util.currentTime()
    });
  },
  onShow: function () {
    // 设置app语言的全局变量  
    var selectedLanguage = app.globalData.settings.language;
    // console.log('Current Language:' + selectedLanguage + ' (0: ZH-ch 1: ENG 2:JP)');
    var title = ["签到", "Timecard", "打刻"][selectedLanguage];
    this.setData({
      uindex: selectedLanguage,
      title: title
    })
    // 时间显示
    var that = this;
    setInterval(function () {
      that.setData({
        displayTime: util.currentTime()
      });
    }, 1000)
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindemailInput: function (e) {
    this.setData({
      email: e.detail.value
    });
  },
  bindPublish: function (e) {
    if (this.data.email === undefined || this.data.email === "") {
      this.setData({
        errorMessage: "邮箱地址不能为空！"
      });
      this.showTopTips()
      return
    }
    var self = this;
    wx.showToast({
      title: '签到发布中...',
      icon: 'loading',
      duration: 3000
    });

    var that = this //创建一个名为that的变量来保存this当前的值  
    debugger;
    wx.request({
      url: 'https://www.todaynowork.group/wechat-du-1.0//courseParticipant/checkin',
      method: 'post',
      data: {
        "email": this.data.email, //这里是发送给服务器的参数（参数名：参数值） 
        "number": this.data.id,
        "userId": this.userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  //这里注意POST请求content-type是小写，大写会报错  
      },
      success: function (res) {
        // that.setData({ //这里是修改data的值  
        //   test: res.data //test等于服务器返回来的数据  
        // });
        // wx.navigateTo({
        //   url: "../../settings/settings"
        // })
        console.log(res.data)
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 3000
        });
        // wx.navigateTo({
        //   url: '../../index/index',
        // })
      }, fail: function () {
        wx.showToast({
          title: '预约失败',
          icon: 'success',
          duration: 3000
        });
      }
    });
  }
})

