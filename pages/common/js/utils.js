export const event_getNavHeight = () => {
  let {
    titleBarHeight,
    statusBarHeight,
    model
  } = wx.getSystemInfoSync();

  return {
    titleBarHeight: titleBarHeight || 40,
    statusBarHeight
  }
};