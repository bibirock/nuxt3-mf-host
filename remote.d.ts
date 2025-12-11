// 遠端模組類型聲明
declare module "remoteApp/Widget" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
