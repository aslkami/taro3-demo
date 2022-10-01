import { WebView } from "@tarojs/components";

definePageConfig({
  navigationBarTitleText: "首页",
  navigationStyle: "custom",
  enableShareAppMessage: true,
  // enableShareTimeline: true,
});
function Index() {
  return <WebView src="http://10.0.0.3:3000"></WebView>;
}

export default Index;
