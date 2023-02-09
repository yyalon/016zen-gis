<template>
  <div class="task-menu" :class="$store.state.app.mode === 'web' ? 'web' : ''">
    <el-menu ref="gisMenu" mode="horizontal" text-color="#000000">
      <template v-for="(menu, index) in routes">
        <el-submenu
          v-show="!menu.hidden"
          v-if="menu.children && menu.children.length > 0"
          :key="index"
          :index="index + ''"
        >
          <template slot="title">{{ menu.meta.title }} </template>
          <template v-for="(menuItem, indexItem) in menu.children">
            <el-submenu
              v-show="!menuItem.hidden"
              v-if="menuItem.children && menuItem.children.length > 0"
              :key="indexItem"
              :index="`${index}-${indexItem}`"
              ><template slot="title">{{ menuItem.meta.title }} </template>
              <template
                v-for="(menuSubItem, indexSubItem) in menuItem.children"
              >
                <el-menu-item
                  :key="indexSubItem"
                  :index="`${index}-${indexItem}-${indexSubItem}`"
                  @click="handleToPath(menuSubItem.path)"
                  >{{ menuSubItem.meta.title }}
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item
              v-else
              :key="indexItem"
              :index="`${index}-${indexItem}`"
              @click="handleToPath(menuItem.path)"
              >{{ menuItem.meta.title }}
            </el-menu-item></template
          >
        </el-submenu>
        <el-menu-item
          v-else
          v-show="!menu.hidden"
          :key="index"
          :index="index + ''"
          @click="handleToPath(menu.path)"
        >
          {{ menu.meta.title }}</el-menu-item
        >
      </template>
      <!-- <el-menu-item @click="handleToSHS()"> 卫星遥感</el-menu-item> -->
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TaskInfo',
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['user']),
    activeMenuItem() {
      const route = this.$route
      const { path } = route
      return path
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    routes() {
      const otherRoute = this.$router.options.routes.filter(item => {
        return item.meta && item.meta.gis
      })
      let menu = []
      otherRoute.forEach(route => {
        menu.push(route.children[0])
      })
      menu = [...menu]
      return menu
    }
  },
  mounted() {},
  methods: {
    handleToPath(path) {
      this.$router.push(path)
    },
    handleCommand(item) {
      if (item && item.path) {
        this.$router.push(item.path)
      }
    },
    checkActiveMenu(menu) {
      const route = this.$route
      const { matched } = route
      let active = false
      if (matched) {
        matched.forEach(item => {
          if (item.name === menu.name) {
            active = true
          }
        })
      }
      return active
    },
    handleToSHS() {
      window.open('/shs', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.task-menu {
  position: absolute;
  color: #53c8d6;
  bottom: 0;
  left: 270px;
  line-height: 21px;
  font-size: 14px;
  padding: 10px;
  z-index: 200;
  &.web {
    position: relative;
    left: unset;
    bottom: unset;
    padding: 0 30px;

    ::v-deep .el-menu {
      height: 50px;
      &.el-menu--horizontal {
        border-bottom: none;
        background: none;
        > .el-menu-item.is-active {
          border-bottom: 2px solid white;
          color: white;
        }
        > .el-menu-item:not(.is-disabled):focus,
        > .el-menu-item:not(.is-disabled):hover {
          background: none;
        }
      }
      .el-submenu {
        line-height: 52px;
        .el-submenu__title {
          line-height: 52px;
          height: 52px;
          transition: 0.1s all ease-in-out;
          &:hover {
            background: #8accef;
          }
        }
      }
      .el-menu-item {
        height: 52px;
        line-height: 52px;
        transition: 0.1s all ease-in-out;
        &:hover {
          background: #0d244447;
          color: white !important;
        }
      }
    }
    .item {
      background: none;
      color: #001a3e;
      margin: 0;
      min-width: 76px;
      font-size: 14px;

      padding: 10px 5px 0;
      .title {
        padding: 5px 10px;
      }
      &:hover {
        text-decoration: none;
        color: #00a8ff;
        background: none;
        .title {
          border-radius: 5px;
          background: #00a8ff14;
        }
      }
      &.active {
        text-decoration: none;
        color: #00a8ff;
        background: none;
        .title {
          border-bottom: 3px transparent solid;
          border-image: linear-gradient(
              90deg,
              #79d1fe 0%,
              #79d1fe 50%,
              white 95%
            )
            1 10;
          padding-bottom: 4px;
        }
      }
    }
  }
  .item {
    color: white;
    display: inline-block;
    padding: 10px 20px;
    margin-right: 5px;
    font-size: 16px;
    text-decoration: none;
    transition: all 0.4s ease-in-out;
    &:hover {
      color: white;
      background: linear-gradient(
        180deg,
        rgba(139, 230, 237, 0),
        rgba(83, 200, 214)
      );
    }
    &.active {
      color: white;
      background: url('../../assets/img/item.png') no-repeat;

      background-size: 100% 100%;
    }
  }
}
.el-menu-item:hover {
  background-color: #06a5fd5c;
}
::v-deep .el-submenu__title:hover {
  background-color: #06a5fd5c;
}
</style>
