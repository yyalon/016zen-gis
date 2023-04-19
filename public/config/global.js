config = {
  baseURL: 'http://119.3.208.229:8079',
  geoserverURL: 'http://139.9.41.23:8078',
  appDownloadBaseURL: 'http://119.3.208.229',
  iconPath: 'data/icon/',
  pointIconBase: 'data/icon/mark/point/',
  polyIconBase: 'data/icon/mark/poly/',
  publicData: 'data/',
  istimer: false, // 是否开启拉取告警的定时器
  areaTopic: 'mls', // 主页项目介绍标识
  areaZTTJ: 'zttj', // 资源概况标识
  geoTitle: 'fsl', // 区域轮廓标识
  mapCenter: [103.007005, 22.719810, 180000], // 地图中心点 经度-纬度-高度
  thematicMap: {
    min: [
      'http://119.3.208.229:9000/mapimg/fsl/fsl-dwfb-min.webp',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-gnfq-min.webp',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-qs-min.webp',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-tdly-min.webp',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-yjxm-min.webp',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-zwfb-min.webp',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-zwt-min.webp',
    ],
    max: [
      'http://119.3.208.229:9000/mapimg/fsl/fsl-dwfb-min.jpg',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-gnfq-min.jpg',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-qs-min.jpg',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-tdly-min.jpg',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-yjxm-min.jpg',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-zwfb-min.jpg',
      'http://119.3.208.229:9000/mapimg/fsl/fsl-zwt-min.jpg',
    ]
  }
}
