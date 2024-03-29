/**
 * 封装微信提示 参数sms, icon, fun, t
 */
function showTip(sms, icon, fun, t) {
    if (!t) {
        t = 1000;
    }
    wx.showToast({
        title: sms,
        icon: icon,
        duration: t,
        success: fun
    })
}
/**
 * 封装微信弹窗 参数c,t,fun
 */
function showModal(c,t,fun) {
    if(!t)
        t='提示'
    wx.showModal({
        title: t,
        content: c,
        showCancel:false,
        success: fun
    })
}
module.exports.showTip = showTip;
module.exports.showModal = showModal;