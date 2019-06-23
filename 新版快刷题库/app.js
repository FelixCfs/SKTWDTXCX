var Bmob = require('dist/Bmob-1.6.1.min.js');
//为了可以拉黑用户 传入MasterKey
Bmob.initialize("2929699fb077942d66bd028aae448482", "44b72528bac09c4becaef853089fe915","9bdefda1e155a01af4c7fa0a784ee909");
App({



  onLaunch: function () {
    var that=this;

    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });


    Bmob.User.auth().then(res => {
      console.log(res)
      that.globalData.userId = res.objectId;
      const queryUser = Bmob.Query('_User');
      queryUser.get(res.objectId).then(res => {
        res.set('openid', res.authData.weapp.openid)
        res.save()
      }).catch(err => {
        console.log(err)
      })
      console.log('一键登陆成功')
    }).catch(err => {
      console.log(err);
    });
    console.log(that.globalData)
 
  },

  globalData: {
    finishAnswer:false,
    getScore:0,
    test_name: '',
    question_number:null,
  }
}) 