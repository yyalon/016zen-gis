/* eslint-disable indent */

const config = {
  appDownloadUrl: 'http://119.3.208.229:8080/ynefsapp.apk',

  infoTypes: {
    // InforType_Heatbeat = 100 // 心跳包
    // InforType_Regist   = 200 // 注册包
    // InforType_Video    = 300 // 视频包
    // InforType_Picture  = 400 // 图片包
    // InforType_Reboot   = 500 // 重启包

    100: { label: '心跳包', style: 'success' },
    200: { label: '注册包', style: 'warning' },
    300: { label: '视频包', style: 'primary' },
    400: { label: '图片包', style: 'primary' },
    500: { label: '重启包', style: 'danger' }
  },
  permTypes: {
    1: { label: '数据权限', style: 'success' },
    2: { label: '功能权限 ', style: 'primary' },
    3: { label: '前端权限', style: 'info' },
    4: { label: '目录', style: 'warning' },
    5: { label: '菜单', style: '' }
  },
  tdtKeys: [
    '4c4b415ba1154b03714bc3d10a8137d2',
    'ba0195f3e1ad7a78a870d3a30d1c1f58',
    '308e181a8e240eed5c22a6222ccb0054',
    'b05cb480d7d431f3391c32e3700089eb',
    '9e6f858dd49d087215159e9d86207ded',
    'af0ba1425b04375a1c59147633eb74ae',
    '6a3f389abbce4eadb4d45525be3d9a88',
    '20d1221d2b0d88666b7fffda0315adb3',
    'a004516cb52d909a067625be810b4cb1',
    '39d069bd177251d1e13412704f624d8f',
    '5cc4c1de2db8febccffd2c39fcfa345f',
    'f84396ef8e71ef86fbfd3db36d423d6f',
    '3e3886c0822774ee10a49076249283ec',
    'edcdf14a0322fe6c8a6300b95dc6e004',
    'c5f75ce02993e2abc2219d93ca4d9a98',
    'fdc3dcb5024361982a9cdd379b5d7c14',
    'dabd15c6f4ec5a5cff4dcadb0316e8d9',
    'd525910a7b039ae4ca3e9f145fe7c96d',
    'dc52489d29c6ecd003c7bb4db87a739c',
    '172382fd8347369b236876d44c180f41',
    '5a4ef2aec7a84442e134063c2c82b95d',
    '61971d1f660096cf61a5bf05d740c52b',
    'ac0f64a36aa936e131085ba062fa2ad1',
    '2ff3d41bf43032da1106025f457029cd',
    'b36c62843014f17f9acf32c9d8e1ce84',
    '9768b7a54c43056b14fb51456667d4e7',
    'c3f5e0d1bc84af4a205e3bd0bcbb6497',
    '77942043fbae21d13ff130dfdce90055',
    '2932efbd0a66063c459349bc3a8f5f4b',
    '20d8e2b4827125cf376bab584481a9b6',
    '3ac26fd230b0ac343fa989325c4dec73',
    'af05007d5c41867d00e0231a46c5b53c',
    'b2f14b2169567f0277afc70854e9266e',
    'f75cc812547577be3d295423bb5b74fb',
    'c3ec3af2b7a2fb891e8f7ebe451db5ea',
    '2c6c07cd4aab665e51fbe2d263fe6e8d',
    'fdaa10c21310ea6de9c234137042020f',
    '50b885ebe0ad97423c2ebb672ba1d49c',
    'de94b5f1dfd200a8db16a3f23586842c'
  ],
  map3d: {
    scene: {
      center: {
        lng: 121.3248679,
        lat: 30.65194,
        alt: 820000,
        heading: 0,
        pitch: -90
      },
      scene3DOnly: true,
      shadows: false,
      removeDblClick: true,
      sceneMode: 3,
      showSun: false,
      showMoon: false,
      showSkyBox: false,
      showSkyAtmosphere: false,
      fog: false,
      fxaa: true,
      requestRenderMode: true,
      globe: {
        depthTestAgainstTerrain: false,
        baseColor: '#546a53',
        showGroundAtmosphere: true,
        enableLighting: false
      },
      cameraController: {
        zoomFactor: 3.0,
        minimumZoomDistance: 5000,
        maximumZoomDistance: 820000,
        enableRotate: true,
        enableTranslate: true,
        enableTilt: true,
        enableZoom: true,
        enableCollisionDetection: true,
        minimumCollisionTerrainHeight: 15000
      }
    },
    control: {
      homeButton: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      vrButton: false,
      fullscreenButton: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      infoBox: false,
      geocoder: false,
      selectionIndicator: false,
      defaultContextMenu: true,
      mouseDownView: false,
      zoom: { insertIndex: 1 },
      compass: { right: '-100px', top: '10px' },
      locationBar: {
        fps: false,
        crs: 'CGCS2000_GK_Zone_3',
        crsDecimal: 0,
        template:
          "<div>经度:{lng}</div> <div>纬度:{lat}</div> <div>海拔：{alt}米</div> <div class='hide700'>视高：{cameraHeight}米</div>"
      }
    }
  }
}
export default config
