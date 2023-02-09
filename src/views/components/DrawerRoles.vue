<template>
  <el-drawer
    ref="drawer"
    title="请选择角色"
    size="400px"
    :visible.sync="drawerVisible"
    direction="rtl"
    :modal-append-to-body="false"
    :before-close="handleCloseDrawer"
  >
    <el-table
      height="100%"
      :data="roles"
      :show-header="false"
      style="width: 100%; cursor: pointer"
      stripe
      @row-click="selectRole"
    >
      <el-table-column type="index" />
      <el-table-column prop="roleName" />
    </el-table>
  </el-drawer>
</template>

<script>
import { getRoles } from '@/api/user'
export default {
  name: 'DrawerRoles',
  components: {},
  props: {
    drawerVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roles: []
    }
  },
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    selectRole(row) {
      this.$emit('close', { id: row.id })
    },
    getData() {
      getRoles().then(res => {
        const { code, data } = res
        if (code === 0 && data && data.roles && data.roles.length > 0) {
          this.roles = data.roles.filter(
            role => role.roleName.indexOf('模板') !== -1
          )
        }
      })
    },
    handleCloseDrawer() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  user-select: none;
}
</style>
