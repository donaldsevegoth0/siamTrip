// utils/checkLogin.js
export default function checkLogin() {
  const user = wx.getStorageSync('userinfo');
  console.log(user.name);
  if (!user.token) {
    wx.redirectTo({
      url: '/pages/login/login'
    });
    return false;
  }
  return true;
};
