





var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
var util = require('../../utils/util.js');
Page({


  data: {
    rankList:[],
    page_index: 0,
    has_more: true,
    openPageTime:null,
    closePageTime:null
  },

  
  onLoad: function (options) {
    that=this;
  },

  onShow:function(){
    var nowTime = util.openclosePageTime(new Date());
    that.setData({
      rankList: [],
      page_index: 0,
      has_more: true,
      openPageTime:nowTime,
    });
    that.loadRankList();
  },

  loadRankList:function(){
    wx.showLoading({
      title: '加载中...',
    })
    var page_size = 100;
    //const queryUser = Bmob.Query("_User");
    //queryUser.order('-allScore');
    //queryUser.equalTo("allScore", ">", 0);

    const queryUser = Bmob.Query("history");
    queryUser.order("-getScore",'costTime');
    queryUser.equalTo("getScore", ">", 0);
    
    queryUser.skip(that.data.page_index * page_size);
    queryUser.limit(page_size);
    queryUser.find().then(res => {
      var rankList = that.data.rankList;
      var nowTime = util.openclosePageTime(new Date());
      that.setData({
        rankList: rankList.concat(res),
        closePageTime: nowTime
      });
      if (res.length < page_size) {
        that.setData({
          has_more: false
        });
      }
      wx.hideLoading()
      console.log(that.data.rankList)
    });
  },

  onReachBottom: function () {
    if (!that.data.has_more) {
      return;
    }
    var page_index = that.data.page_index;
    that.setData({
      page_index: ++page_index
    });
    that.loadRankList();
  },
  

})