export default defineAppConfig({
  pages: [
    // 'pages/index/index',
    'pages/swiper/index',
    // 'pages/fate/fate',
    'pages/webview/index',
    'pages/datepicker/index',
  ],
  // entryPagePath: 'TestSub/Test/index',
  subPackages: [
    // {
    //   root: 'TestSub',
    //   pages: [
    //     'Test/index'
    //   ]
    // }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
