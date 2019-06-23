var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
var util = require('../../utils/util.js');
Page({


  data: {
    finishAnswer: false,
    showMask: true,
    showAuthorize: false,
    inputTele: '',
    verifyTele: false,
    getScore: 0,
    currentUserId: ''
  },


  onLoad: function (options) {
    that = this;
    wx.showLoading({
      title: '加载中...',
    })

    var interval = setInterval(function () {
      var currentUser = Bmob.User.current();
      var currentUserId = currentUser.objectId;
      if (currentUserId) {
        clearInterval(interval);
        const queryUser = Bmob.Query('_User');
        queryUser.get(currentUserId).then(res => {
          wx.hideLoading()
          if (res.authorize) {
            that.setData({
              showAuthorize: false,
              currentUserId: currentUserId
            });
            if (res.verifyTele) {
              that.setData({
                verifyTele: false,
                showMask: false,
              });
              // const querySetting = Bmob.Query('setting');
              // querySetting.get('2quOZZZb').then(res => {
              //   console.log(res)
              //   that.setData({
              //     open_time: res.openTime.iso,
              //     close_time: res.closeTime.iso,
              //   });
              // }).catch(err => {
              //   console.log(err)
              // })
            }
            else {
              that.setData({
                verifyTele: true
              });
            }
          }
          else {
            that.setData({
              showAuthorize: true,
              currentUserId: currentUserId
            });
          }

        }).catch(err => {
          console.log(err)
        })
      }
    }, 500);
  },

  onShow: function () {
    var finishAnswer = getApp().globalData.finishAnswer;
    var getScore = getApp().globalData.getScore;
    that.setData({
      finishAnswer: finishAnswer,
      getScore: getScore
    });
    setTimeout(function () {
      getApp().globalData.finishAnswer = false;
      that.setData({
        finishAnswer: false
      });
    }, 3000)
  },

  authorize: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    var userInfo = e.detail.userInfo;
    if (!userInfo) {
      wx.hideLoading();
      wx.showToast({
        title: '请同意授权',
        icon: 'none',
        duration: 20
      })
    }
    else {
      var nickName = userInfo.nickName;
      var userPic = userInfo.avatarUrl;
      const queryUser = Bmob.Query('_User');
      queryUser.set('id', currentUserId) //需要修改的objectId
      queryUser.set('nickName', nickName);
      queryUser.set('userPic', userPic);
      queryUser.set('authorize', true);
      queryUser.save().then(res => {
        that.setData({
          nickName: nickName,
          userPic: userPic,
        });
       

        if (!res.verifyTele) {
          wx.hideLoading()
          that.setData({
            verifyTele: true,
          });
        }
        else {
          wx.hideLoading()
          that.setData({
            showMask: false,
            verifyTele: false,
          });
        }




      }).catch(err => {

      })
    }

  },

  inputTele: function (e) {
    that.setData({
      inputTele: e.detail.value,
    })
  },

  verify: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var inputTele = that.data.inputTele;
    const querySU = Bmob.Query("select_user");
    querySU.equalTo("tele", "==", inputTele);
    querySU.find().then(res1 => {
      console.log(res1)
      if (res1.length == 1) {
        wx.hideLoading()
        wx.showToast({
          title: res1[0].real_name + '验证成功',
          icon: 'none',
          duration: 2000
        })
        var currentUser = Bmob.User.current();
        var currentUserId = currentUser.objectId;
        const queryUser = Bmob.Query('_User');
        queryUser.get(currentUserId).then(res2 => {
          res2.set('verifyTele', true)
          res2.set('real_name', res1[0].real_name)
          res2.set('team_name', res1[0].team_name)
          res2.set('allScore', 0)
          res2.set('tele', res1[0].tele)
          res2.save()
        }).catch(err => {
          console.log(err)
        })


        that.setData({
          showMask: false,
          verifyTele: false
        })
      }
      else {
        wx.hideLoading()
        wx.showToast({
          title: '验证失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  startAnswer: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var nowTime = util.formatTime(new Date());
    const querySet = Bmob.Query('setting');
    querySet.get('2quOZZZb').then(res => {
      console.log(res)
      getApp().globalData.question_number = res.question_number;
      getApp().globalData.test_name = res.test_name;
      var openTime = res.openTime.iso;
      openTime = openTime.replace(/-/g, '/')
      var closeTime = res.closeTime.iso;
      closeTime = closeTime.replace(/-/g, '/')
      nowTime = Date.parse(new Date(nowTime));
      openTime = Date.parse(new Date(openTime));
      closeTime = Date.parse(new Date(closeTime));
      console.log(nowTime)
      console.log(openTime)
      console.log(closeTime)
      if (nowTime > openTime && nowTime < closeTime) {

        //历史记录
        const queryHistory = Bmob.Query("history");
        queryHistory.equalTo("currentUserId", "==", that.data.currentUserId);
        queryHistory.equalTo("test_name", "==", res.test_name);
        queryHistory.find().then(res => {
          console.log(res)
          
           if (res.length != 0) {
             wx.hideLoading()
             wx.showToast({
               title: '已经答过啦',
               icon: 'none',
               duration: 2000
             })
           }
           else {
            getApp().globalData.finishAnswer = false;
            wx.redirectTo({
              url: '../answer_page/answer_page'
            })
            wx.hideLoading()
           }
         });
      }
      else {
        wx.hideLoading()
        wx.showToast({
          title: '等待开启通知',
          icon: 'none',
          duration: 2000
        })
      }

    }).catch(err => {
      console.log(err)
    })
  }

})