var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var app = getApp()
var that;
Page({


  data: {
    userPic:'',
    nickName:'',
    real_name: '',
    team_name: '',
    allScore: '',
    page_index: 0,
    has_more: true,
    rankList: [],
  },

  
  onLoad: function (options) {
    that = this;
  },



  clear0:function(){
    wx.showLoading({
      title: '置0中...',
    })

    const queryUser = Bmob.Query("_User");
    queryUser.equalTo("allScore", "!=", 0);
    queryUser.find().then(res => {
      console.log(res)
      if(res.length>0){
        for (var i = 0; i < res.length; i++) {

          queryUser.get(res[i].objectId).then(res => {
            res.set('allScore', 0)
            res.save()
            console.log(res)
          }).catch(err => {
            console.log(err)
          })
        }
      }
      else{
        wx.showToast({
          title: '全部置0',
          icon: 'success',
          duration: 2000
        })
        wx.hideLoading();
      }

      
      wx.hideLoading();
    });

  },


  onShow:function(){
    // wx.showLoading({
    //   title: '加载中...',
    // })
    let current = Bmob.User.current();
    var currentUserId = current.objectId;
    const queryUser = Bmob.Query('_User');
    queryUser.get(currentUserId).then(res => {

      that.setData({
        userPic: res.userPic,
        nickName: res.nickName,
        real_name: res.real_name,
        team_name: res.team_name,
        allScore: res.allScore,
      });


    }).catch(err => {
      console.log(err)
    })

    // that.loadRankList();
  },




//   loadRankList: function () {
//     wx.showLoading({
//       title: '加载中...',
//     })
//     var page_size = 100;

//     var rankList=new Array();
// ///////////**********************////////////////////******************** */
//     const queryUser = Bmob.Query("_User");
//     queryUser.order('-allScore');
//     queryUser.equalTo("allScore", ">", 0);
//     queryUser.skip(0 * page_size);
//     queryUser.limit(page_size);
//     queryUser.find().then(res0 => {
//       console.log(res0)

//       queryUser.order('-allScore');
//       queryUser.equalTo("allScore", ">", 0);
//       queryUser.skip(1 * page_size);
//       queryUser.limit(page_size);
//       queryUser.find().then(res1 => {
//         console.log(res1)

//         queryUser.order('-allScore');
//         queryUser.equalTo("allScore", ">", 0);
//         queryUser.skip(2 * page_size);
//         queryUser.limit(page_size);
//         queryUser.find().then(res2 => {
//           console.log(res2)

//           queryUser.order('-allScore');
//           queryUser.equalTo("allScore", ">", 0);
//           queryUser.skip(3 * page_size);
//           queryUser.limit(page_size);
//           queryUser.find().then(res3 => {
//             console.log(res3)

    
//             rankList = res0.concat(res1).concat(res2).concat(res3)
//             console.log(rankList)
//             var currentUser = Bmob.User.current();
//             var currentUserId = currentUser.objectId;
//             for (var i = 0; i < rankList.length; i++) {
//               if (currentUserId == rankList[i].objectId) {
//                 var rank=i+1;
//                 console.log('第' + rank)
//                 that.setData({
//                   rank: rank,
//                 });
//                 break;
//               }
//             }
          

//           });

//         });


//       });


//     });

   


    


   


    


   



    
///////////**********************////////////////////******************** */
  
  


  //   wx.hideLoading()
    

  // },

  
})