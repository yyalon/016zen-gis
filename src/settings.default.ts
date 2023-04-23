// 该文件为系统默认配置，请勿修改！！！

import type { RecursiveRequired, Settings } from '#/global'

const globalSettingsDefault: RecursiveRequired<Settings.all> = {
  app: {
    // 标题，此项修改后需要重启项目！！！ (包括初次加载雪花屏的标题 页面的标题 浏览器的标题)
    title: '陆海气协同防治可视化智慧决策支持平台',
    // 英文标题
    titleEn: 'Marine Governance Platform',
    // 简写
    abbreviation: '陆海气协同防治决策平台',
    // 英文简写
    abbreviationEn: 'MGP',
    colorScheme: 'light',
    elementSize: 'default',
    iconifyOfflineUse: false,
    enablePermission: false,
    enableProgress: true,
    enableDynamicTitle: false,
    routeBaseOn: 'filesystem',
    enableAppSetting: false,
  },
  home: {
    enable: true,
    title: '控制台',
  },
  layout: {
    enableMobileAdaptation: false,
  },
  menu: {
    baseOn: 'frontend',
    menuMode: 'side',
    switchMainMenuAndPageJump: false,
    subMenuUniqueOpened: true,
    subMenuCollapse: false,
    enableSubMenuCollapseButton: false,
    enableHotkeys: false,
  },
  topbar: {
    mode: 'static',
  },
  toolbar: {
    enableFullscreen: false,
    enablePageReload: false,
    enableColorScheme: false,
  },
  breadcrumb: {
    enable: true,
  },
  navSearch: {
    enable: true,
    enableHotkeys: true,
  },
  copyright: {
    enable: true,
    dates: '2020-2023',
    company: 'Fantastic-admin',
    website: 'https://hooray.gitee.io/fantastic-admin/',
    beian: '',
  },
}

export default globalSettingsDefault
