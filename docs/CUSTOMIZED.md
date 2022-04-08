# 定制化说明

## 基础设置

### 1. `favicon.ico`

替换 `/public/favicon.ico` 为学院的logo.

### 2. `package.json`

* 修改 `name` 为 项目名称;
* 修改 `version` 为 `1.0.0`;
* 增加 `"jsonwebtoken": "^8.5.1",` 依赖包用于解析 `AccessToken`;

### 3. `/src/assets`

* 替换 `logo.png` 和 `logo.svg` 文件, 用于左侧菜单栏上显示的 logo;
* 修改 `/src/components/base-layouts/side-menu/index.Vue` 的 `L30-35` 如下:

```vue
<div v-if="!isMix" class="ant-pro-sider-logo">
<router-link :to="{ name: 'index' }">
  <img src="@/assets/logo.svg" alt="logo" />
  <h1 v-if="!collapsed">sycamore</h1>
</router-link>
</div>
```

### 4. `/src/store/modules/app/state.js`

* 修改 `lang` 为 `zh-CN` 默认多语言选择中文;
* 修改 `title` 为 `sycamore`;
* 修改 `primaryColor` 为 `#BB133E`;
* 修改 `navTheme` 为 `light`;

> 修改之后, 需要在浏览器的 `Application` 中清除之前存储在 `LocalStorage` 中的配置, 否则无法生效;

### 5. `/App.vue`

* 修改默认页面国际化语言为中文: `L28` 将 `en-US` 修改为 `zh-CN`;

## 网络请求

网络请求定制化配置, 需要将脚手架中的与 `AccessToken` 相关的代码进行整合;

这部分定制化主要涉及三部分的内容:

* 修改 `/src/api` 中的关于用户数据的请求接口;
* 修改 `/src/store/modules/user` 中的存储部分;
* 修改 `/src/utils/request.js` 中 `axios` 的 hooks;

### 1. `/src/utils/request`

* 修改 `L5` 的 `REQUEST_TOKEN_KEY` 常量为 `Authorization`;
* 修改 `L10` 的 `timeout` 为 `60000`(60秒);
* 修改 `L41` 的默认添加 `Token` 到请求中的方式为`Bearer Token`;
* 修改 `L15 - 40` 的异常拦截处理器, 根据 API 接口的返回进行适配;

### 2. `/src/store/modules/user/state.js`

该文件定义了关于用户信息的存储字段;

* 修改 `role` 为 `roles`;

### 3. `/src/store/modules/user/mutations.js`

* 在 `SET_INFO` 方法中, 根据 API 接口的返回进行字段名称的修改;

### 4. `/src/api/user/login.js`

* 修改 `postAccountLogin` 方法, 采用微前端的方式, 无需在各个前端中处理登录的问题, 直接读取 `LocalStorage` 中的 `Token`;
* 修改 `getCurrentUser` 方法;
* 删除 `postLogout` 方法;

### 5. `/src/store/modules/user/actions.js`

该文件主要定义了 `user` 相关的方法;

* 修改 `LOGOUT` 中的方法, 删除请求, 只重置 `LocalStorage` 即可;

### 6. `.env.development` 和 `.env.production`

* 将 `VUE_APP_API_BASE_URL` 从 `.env` 中抽离出来, 分别进行设置;

## 权限管理

这部分暂时没有进行修改, 以框架自带的效果为准, 后续根据实际项目再进行修改;

## 发布路径

一般的子项目都是部署到非根目录上, 所以需要修改发布路径

* 修改 `.env` 中的 `VUE_APP_PUBLIC_PATH` 为需要发布的路径即可;

## 页面标题

* 修改 `/public/index.html` 中 `L9` 的标题为项目名称;
* TODO: `Loading` 效果
* TODO: CDN的使用

## 路由配置

将默认自带的路由提取备份至 `REFERENCE_ROUTERS.md` 文档中, 用于参考页面布局和组件的使用方法;
