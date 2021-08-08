<template>
  <div id="app">
    <router-view />
    <el-dialog title="提示" :visible.sync="logOutDialog" width="30%">
      <span>确定登出账号吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <survive />
  </div>
</template>

<script>
import Survive from '@/components/survive/index'
export default {
  name: 'App',
  components: {
    Survive
  },
  data() {
    return {}
  },
  computed: {
    logOutDialog() {
      return this.$store.state.user.logOutDialog
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async confirm() {
      await this.$store.dispatch('user/logOutDialog', false)
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    cancel() {
      this.$store.dispatch('user/logOutDialog', false)
    }
  }
}
</script>
