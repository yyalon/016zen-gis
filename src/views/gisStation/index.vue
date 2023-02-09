<template>
  <div class="station_wrapper">
    <section id="container"></section>
    <aside v-if="showData" class="left-wrapper flex">
      <chart-inside></chart-inside>
      <chart-inside></chart-inside>
      <chart-inside></chart-inside>
      <chart-inside></chart-inside>
    </aside>
    <div v-if="showData" class="top-wrapper ">
      <chart-data></chart-data>
    </div>
    <div v-if="showData" class="bottom_wrapper">
      <chart-control-panel></chart-control-panel>
      <chart-air-cylinder></chart-air-cylinder>
    </div>
    <aside v-if="showData" class="right-wrapper flex">
      <chart-inside></chart-inside>
      <chart-inside></chart-inside>
      <chart-inside></chart-inside>
      <chart-inside></chart-inside>
    </aside>
  </div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

import ChartAirCylinder from './components/ChartAirCylinder'
import ChartControlPanel from './components/ChartControlPanel'
import ChartInside from './components/ChartInside'
import ChartData from './components/ChartData'

export default {
  components: { ChartInside, ChartData, ChartControlPanel, ChartAirCylinder },
  data() {
    return {
      showData: false,
      loading: false,
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      manager: null,
      grid: null,

      mixer: null,
      clock: new THREE.Clock(),

      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      selectedObjects: null,

      tween1: null,
      tween2: null,
      translateY: 0,

      composer: null,

      isDoorOpen: false,

      // 模型对象
      model: null, // 站点外景
      mds: {
        door1: null,
        door2: null
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()

      this.initModel()
      this.loaddoor()

      this.animate()

      document
        .getElementById('container')
        .addEventListener('click', this.mousedown, false)
      document
        .getElementById('container')
        .addEventListener('touchend', this.mousedown, false)
    })
  },
  methods: {
    init() {
      const dom = document.getElementById('container')

      // 初始化场景
      this.scene = new THREE.Scene()

      // 初始化相机
      this.camera = new THREE.PerspectiveCamera(
        75,
        dom.clientWidth / dom.clientHeight,
        0.1,
        10000
      )

      this.camera.position.x = 90
      this.camera.position.y = 300
      this.camera.position.z = 100

      console.log('camera', this.camera)

      // 环境光
      let ambient = new THREE.AmbientLight(0xffffff)
      this.scene.add(ambient)

      let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
      directionalLight2.position.set(-400, -100, -400)
      this.scene.add(directionalLight2)

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // alpha: true场景透明
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(dom.clientWidth, dom.clientHeight)
      this.renderer.setClearColor(0x000000, 1) // 透明度：0~1

      dom.appendChild(this.renderer.domElement)

      // 添加辅助网格
      this.grid = new THREE.GridHelper(100, 50, 0xa0c4ea, 0xa0c4ea)
      this.grid.material.opacity = 0.2
      this.grid.material.transparent = true
      this.scene.add(this.grid)

      // 初始化控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.autoRotate = true
      this.controls.screenSpacePanning = false
      this.controls.minDistance = 10 // 控制最大缩放尺寸
      this.controls.maxDistance = 100 // 控制最小缩放尺寸
      this.controls.maxPolarAngle = Math.PI / 2 // 控制上下旋转最大角度

      this.manager = new THREE.LoadingManager()
      this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
        this.loading = true
      }
      this.manager.onLoad = () => {
        setTimeout(() => {
          this.loading = false
        }, 200)
      }
      window.addEventListener('resize', this.onWindowResize)
    },

    onWindowResize() {
      const dom = document.getElementById('container')
      this.camera.aspect = dom.clientWidth / dom.clientHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(dom.clientWidth, dom.clientHeight)
    },

    animate() {
      this.renderer.render(this.scene, this.camera)
      TWEEN.update()

      requestAnimationFrame(this.animate)
    },

    initModel() {
      let loder = new GLTFLoader(this.manager)
      loder.load('data/3d/outside.glb', obj => {
        console.log('outside obj', obj)
        // 获取模型，并添加到场景
        this.model = obj.scene
        this.model.name = '站点'

        this.scene.add(this.model)

        let t1 = new TWEEN.Tween(this.camera.position)
          .to({ x: 18, y: 20, z: 15 }, 1500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            this.camera.lookAt(this.scene.position)
          })

        let t2 = new TWEEN.Tween(this.camera.position)
          .to({ x: 5, y: 5 }, 4000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => {
            this.camera.lookAt(this.scene.position)
          })

        t1.chain(t2)
        t1.start()
      })
    },

    loaddoor() {
      new GLTFLoader(this.manager).load('data/3d/door/door1.glb', obj => {
        console.log('door1', obj)

        let door = obj.scene
        door.traverse(child => {
          if (child.isMesh) {
            child.name = 'door1'
          }
        })
        door.name = 'door1_scene'
        door.position.set(0.68, 2.35, 1.98)
        this.mds.door1 = door
        this.scene.add(door)
      })

      new GLTFLoader(this.manager).load('data/3d/door/door2.glb', obj => {
        console.log('door2', obj)

        let door = obj.scene
        door.traverse(child => {
          if (child.isMesh) {
            child.name = 'door2'
          }
        })
        door.name = 'door2_scene'
        door.position.set(1.9, 2.35, 1.98)
        this.mds.door2 = door
        this.scene.add(door)
      })
    },

    loadInSite() {
      new GLTFLoader(this.manager).load('data/3d/insideScene.gltf', obj => {
        this.scene.remove(this.model)
        this.scene.remove(this.mds.door1)
        this.scene.remove(this.mds.door2)

        this.loadCamera() // 摄像头模型

        let md = obj.scene
        md.translateY(-8)
        this.scene.add(md)
        this.scene.remove(this.grid)
        this.renderer.setClearColor(0x000000, 0) // 透明度：0~1

        this.camera.position.set(190, 90, 200)
        new TWEEN.Tween(this.camera.position)
          .to({ x: 10, y: 25, z: 50 }, 1500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start()
          .onUpdate(() => {
            this.camera.lookAt(this.scene.position)
          })
          .onComplete(() => {
            this.showData = true
          })
      })
    },

    loadCamera() {
      new GLTFLoader(this.manager).load('data/3d/camera.glb', obj => {
        let cameraMd = obj.scene
        cameraMd.traverse(child => {
          if (child.isMesh) {
            child.name = 'camera'
          }
        })
        cameraMd.name = 'camera'
        cameraMd.position.set(17.157, 16.364, -6.357)
        cameraMd.translateY(-8)
        this.scene.add(cameraMd)
      })
    },

    mousedown(e) {
      if (e.type === 'click') {
        this.mouse.x =
          (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1
        this.mouse.y =
          -((e.clientY / this.renderer.domElement.clientHeight) * 2) + 1
      } else {
        let touch = e.changedTouches[0] // 获取第一个触点
        this.mouse.x =
          (Number(touch.clientX) / this.renderer.domElement.clientWidth) * 2 - 1
        this.mouse.y =
          -(
            (Number(touch.clientY) / this.renderer.domElement.clientHeight) *
            2
          ) + 1
      }
      this.raycaster.setFromCamera(this.mouse, this.camera)
      // 确定所点击位置上的物体数量
      let intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      )
      if (intersects.length) {
        let ms = intersects[0].object
        if (ms.name === 'door1' || ms.name === 'door2') {
          const door1 = this.scene.getObjectByName('door1')
          const door2 = this.scene.getObjectByName('door2')

          let position1 = door1.position
          let position2 = door2.position
          console.log('position', position1, position2)

          let x1 = 0
          let x2 = 0
          if (!this.isDoorOpen) {
            x1 = -1
            x2 = 1
          }
          console.log('x1, x2', x1, x2)

          this.tween1 = new TWEEN.Tween(position1)
            .to({ x: x1 }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()

          console.log(this.tween1)

          this.tween2 = new TWEEN.Tween(position2)
            .to({ x: x2 }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start()
            .onComplete(() => {
              this.loadInSite()
            })

          this.isDoorOpen = !this.isDoorOpen
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.station-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
#container {
  width: 100%;
  height: 100%;
  position: absolute;
  flex: 1;
  background: url(../../assets/img/bg_station.jpg) no-repeat center center;
  background-size: cover;
  background-color: #001a3e;
  top: 0;
  left: 0;
  z-index: 1000;
}
.flex {
  display: flex;
  flex: auto;
  flex-direction: column;
}
.left-wrapper,
.right-wrapper {
  z-index: 1000;
  width: 25%;
  height: 100%;
  position: absolute;
  top: 0;
  justify-content: space-between;
}
.top-wrapper {
  z-index: 1000;
  width: 50%;
  height: 24%;
  position: absolute;
  top: 0;
  left: 25%;
}

.bottom_wrapper {
  display: flex;
  flex-direction: row;
  z-index: 1000;
  width: 50%;
  height: 24%;
  position: absolute;
  bottom: 0;
  left: 25%;
}

.left-wrapper {
  left: 0;
}

.right-wrapper {
  right: 0;
}
</style>
