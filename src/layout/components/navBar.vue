<template>
  <div class="navbar" :class="$store.state.app.mode === 'web' ? 'web' : ''">
    <div class="left-menu">
      <div class="menu-item"></div>
    </div>
    <div class="middle-menu" />
    <div class="right-menu">
      <div class="menu-item" @click="handleToMS">
        <svg-icon icon-class="gear" />
      </div>
      <div class="menu-item">
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <img
              v-if="user && user.headImg"
              :src="user.headImg"
              class="user-avatar"
            />
            <img v-else src="@/assets/img/user.svg" class="user-avatar" />
            <span v-if="user" class="user-name">
              {{ user.nickName || user.name }}
            </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-switch-button" command="logout"
              >退出系统</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskMenu from './taskMenu'
import { toAdmin } from '@/utils/auth'
export default {
  components: { TaskMenu },
  props: {},
  computed: {
    ...mapGetters(['sidebar', 'user'])
  },
  mounted() {},
  methods: {
    handleToMS() {
      toAdmin()
    },
    handleCommand(command) {
      if (command === 'alarm') {
        this.handleToAlarm()
        return false
      }
      if (command === 'logout') {
        this.logout()
        return false
      }
    },
    handleToDashboard() {
      this.$router.push('/gis/dashboard')
    },
    handleToAlarm() {
      this.$router.push('/alarm')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          toAdmin('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss">
.zen-logo {
  height: 50px;
  position: absolute;
  top: 5px;
}
.el-popover {
  min-width: 124px;
}
.downloadQrCode {
  width: 100px;
  text-align: center;
  font-size: 14px;
  img {
    margin: 0 auto;
  }
}
</style>
<style lang="scss" scoped>
.navbar {
  border-top: 3px solid #06a5fd;
  user-select: none;
  height: 55px;
  overflow: visible;
  position: relative;
  transition: all 0.4s ease-in-out;
  background: linear-gradient(90deg, #39aef5 0%, #23a1ea 50%, white 95%);
  color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  &.web {
    background: #0faafb;
  }
  .menu-item {
    display: inline-block;
    font-size: 16px;
    color: #001a3e;
    line-height: 40px;
    cursor: pointer;
  }
  .middle-menu {
    text-align: center;
    .menu-item {
      &:last-child {
        border-left: 1px solid #3b526c;
      }
      &.link {
        font-weight: bold;
      }
    }
  }
  .left-menu {
    float: left;
    .menu-item {
      &.title-wrapper {
        width: 600px;
        height: 50px;
      }
    }
  }
  .right-menu {
    position: absolute;
    top: 0;
    right: 0;
    .menu-item {
      padding: 0 10px;
      &:hover {
        transition: all 0.3s ease;
        background: #06a5fd;
        color: #ffffff;
      }
      .el-dropdown {
        height: 100%;
      }
    }
  }
  .left-menu,
  .right-menu {
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .menu-item {
      display: inline-block;
      height: 100%;
      vertical-align: text-bottom;
      line-height: 50px;
      .user-info {
        display: flex;
        font-size: 12px;
        height: 100%;
        align-items: center;
      }
    }
    .sys-title {
      background: url('../../assets/img/title.png') no-repeat;
      position: absolute;
      top: -6px;
      width: 600px;
      height: 58px;
      background-size: cover;
    }
    .user-avatar {
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 10px;
    }
    .user-name {
      color: #001a3e;
      margin: 0 5px;
      &:hover {
        color: white;
      }
    }
  }
}
</style>
