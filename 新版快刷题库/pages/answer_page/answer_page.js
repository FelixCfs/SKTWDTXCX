var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
var util = require('../../utils/util.js');
Page({


  data: {
    getScore:0,
    countDownNum:30,
    hadChose:false,
    questionList:[],
    nowQuestionNumber:0,
    answerResult:null,
    test_name: '',
    closeTime:null,
    currentUserId:'',
    costTime:null,
    question_number:null
  },

  
  onLoad: function (options) {
    that=this;
    var test_name = getApp().globalData.test_name;
    var question_number = getApp().globalData.question_number;
    wx.showLoading({
      title: '加载中...',
    })
   
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.objectId;

    that.setData({
      test_name: test_name,
      currentUserId: currentUserId,
      question_number: question_number
    })

    const querySet = Bmob.Query('setting');
    querySet.get('2quOZZZb').then(res => {
      var closeTime = res.closeTime.iso;
      closeTime = closeTime.replace(/-/g, '/')
      closeTime = Date.parse(new Date(closeTime));
      that.setData({
        closeTime: closeTime
      }) 

      const queryQB = Bmob.Query("question_bank_01");
      queryQB.find().then(res => {
        that.shuffle(res);
      });
    

    }).catch(err => {
      console.log(err)
    })


  },

  shuffle:function(array){
    var tmp, current, top =array.length;
    if(top) while(--top){
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
    that.setData({
      questionList: array
    })
    wx.hideLoading();
    console.log(that.data.questionList)
    that.countDown();
  },

  countDown: function () {
    var countDownNum = that.data.countDownNum;//获取倒计时初始值
    that.setData({

      
      timer: setInterval(function () {
        console.log(getApp().globalData.finishAnswer)
        if (getApp().globalData.finishAnswer == true){
          clearInterval(that.data.timer);
        } 
        else{
          var nowTime = util.formatTime(new Date());
          nowTime = Date.parse(new Date(nowTime));
          var closeTime = that.data.closeTime;
          console.log(nowTime)
          console.log(closeTime)
          if (nowTime > closeTime) {
            clearInterval(that.data.timer);
            console.log('大了')
            setTimeout(function () {
              wx.showLoading({
                title: '上传数据中...',
              })
              var getScore = that.data.getScore;
              getApp().globalData.getScore = getScore;
              getApp().globalData.finishAnswer = true;
              let current = Bmob.User.current();
              var currentUserId = current.objectId;
              const queryUser = Bmob.Query('_User');
              queryUser.get(currentUserId).then(res1 => {
                var real_name = res1.real_name;
                var team_name = res1.team_name;
                var tele = res1.tele;
                var allScore = getScore;
                var nickName = res1.nickName;
                var userPic = res1.userPic;
                res1.set('allScore', allScore)
                res1.save();



                var test_name = getApp().globalData.test_name;
                
                const queryHistory = Bmob.Query('history');
                queryHistory.set("currentUserId", that.data.currentUserId)
                queryHistory.set("test_name", test_name)
                queryHistory.set("getScore", getScore)
                queryHistory.set("answerNumber", that.data.nowQuestionNumber+1);
                queryHistory.set("costTime", that.data.costTime);
                queryHistory.set("real_name", real_name)
                queryHistory.set("team_name", team_name)
                queryHistory.set("tele", tele)
                queryHistory.set("nickName", nickName)
                queryHistory.set("userPic", userPic)
                queryHistory.save().then(res3 => {
                  that.setData({
                    getScore: getScore,
                    answerResult: null,
                  })
                  clearInterval(that.data.timer);
                  wx.hideLoading();
                  wx.switchTab({
                    url: '../first_page/first_page'
                  })
                }).catch(err => {
                  console.log(err)
                })

              }).catch(err => {
                console.log(err)
              })
            }, 1000)
          }
          else {
            console.log('小了')
            if (that.data.hadChose == true) {
              clearInterval(that.data.timer);
              that.setData({
                hadChose: false
              })
              that.countDown();
            }
            else {
              var costTime = that.data.costTime;
              costTime++;
              countDownNum--;

              that.setData({
                costTime: costTime,
                countDownNum: countDownNum
              })
              //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
              if (countDownNum == 0) {
                //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
                //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
                that.chose_option('blank');
                //关闭定时器之后，可作其他处理codes go here
              }
            }
          }
        }


    
      }, 1000)
    })
  },

  chose_option:function(e){
    console.log(that.data.nowQuestionNumber+1)
    var finish=false; 
    var question_number = that.data.question_number-1;
    if (that.data.nowQuestionNumber == question_number){
      finish=true;
    }

    var finishAnswer=getApp().globalData.finishAnswer;
    if (finishAnswer == true || that.data.answerResult == true || that.data.answerResult == false){
      return
    }
    else {

      if (e != 'blank') {
        var index = e.currentTarget.dataset.index;
      }
      else {
        var index = 'blank';
      }
      console.log(that.data.questionList[that.data.nowQuestionNumber])
      if (index == that.data.questionList[that.data.nowQuestionNumber].answer) {
        that.setData({
          answerResult: true,
        })

        if (finish == true) {
          wx.showLoading({
            title: '上传数据中...',
          })
          setTimeout(function () {
            var getScore = that.data.getScore;
            getScore++;
            getApp().globalData.getScore = getScore;
            getApp().globalData.finishAnswer = true;


            let current = Bmob.User.current();
            var currentUserId = current.objectId;
            const queryUser = Bmob.Query('_User');
            queryUser.get(currentUserId).then(res1 => {
              var real_name = res1.real_name;
              var team_name = res1.team_name;
              var tele = res1.tele;
              var nickName = res1.nickName;
              var userPic = res1.userPic;
              var allScore = getScore;
              res1.set('allScore', allScore)
              res1.save();






              var test_name = getApp().globalData.test_name;


              const queryHistory = Bmob.Query('history');
              queryHistory.set("currentUserId", that.data.currentUserId)
              queryHistory.set("test_name", test_name)
              queryHistory.set("getScore", getScore)
              queryHistory.set("answerNumber", that.data.nowQuestionNumber+1);
              queryHistory.set("costTime", that.data.costTime);
              queryHistory.set("real_name", real_name)
              queryHistory.set("team_name", team_name)
              queryHistory.set("tele", tele)
              queryHistory.set("nickName", nickName)
              queryHistory.set("userPic", userPic)
              queryHistory.save().then(res3 => {
                that.setData({
                  getScore: getScore,
                  answerResult: null,
                })
                wx.hideLoading();
                wx.switchTab({
                  url: '../first_page/first_page'
                })

              }).catch(err => {
                console.log(err)
              })
            }).catch(err => {
              console.log(err)
            })

          }, 1000)
        }
        else {
          setTimeout(function () {
            var nowQuestionNumber = that.data.nowQuestionNumber;
            var getScore = that.data.getScore;
            nowQuestionNumber++;
            getScore++;
            that.setData({
              getScore: getScore,
              answerResult: null,
              countDownNum: 30,
              hadChose: true,
              nowQuestionNumber: nowQuestionNumber
            })
          }, 1000)
        }
      }
      else {
        that.setData({
          answerResult: false,
        })

        if (finish == true) {
          wx.showLoading({
            title: '上传数据中...',
          })
          setTimeout(function () {
            var getScore = that.data.getScore;
            getApp().globalData.getScore = getScore;
            getApp().globalData.finishAnswer = true;



            let current = Bmob.User.current();
            var currentUserId = current.objectId;
            const queryUser = Bmob.Query('_User');
            queryUser.get(currentUserId).then(res1 => {
              var real_name = res1.real_name;
              var team_name = res1.team_name;
              var tele = res1.tele;
              var nickName = res1.nickName;
              var userPic = res1.userPic;
              var allScore = getScore;
              res1.set('allScore', allScore)
              res1.save();






              var test_name = getApp().globalData.test_name;


              const queryHistory = Bmob.Query('history');
              queryHistory.set("currentUserId", that.data.currentUserId)
              queryHistory.set("test_name", test_name)
              queryHistory.set("getScore", getScore)
              queryHistory.set("answerNumber", that.data.nowQuestionNumber+1);
              queryHistory.set("costTime", that.data.costTime);
              queryHistory.set("real_name", real_name)
              queryHistory.set("team_name", team_name)
              queryHistory.set("tele", tele)
              queryHistory.set("nickName", nickName)
              queryHistory.set("userPic", userPic)
              queryHistory.save().then(res3 => {
                that.setData({
                  getScore: getScore,
                  answerResult: null,
                })
                wx.hideLoading();
                wx.switchTab({
                  url: '../first_page/first_page'
                })

              }).catch(err => {
                console.log(err)
              })








            }).catch(err => {
              console.log(err)
            })





          }, 1000)
        }
        else {
          setTimeout(function () {
            var nowQuestionNumber = that.data.nowQuestionNumber;
            nowQuestionNumber++;
            that.setData({
              answerResult: null,
              countDownNum: 30,
              hadChose: true,
              nowQuestionNumber: nowQuestionNumber
            })
          }, 1000)
        }
      }

    }



  },


  onUnload: function () {
    getApp().globalData.finishAnswer == true;
  }




})