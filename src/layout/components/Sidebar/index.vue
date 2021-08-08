<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />

    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="block">
        <el-avatar :size="50" :src="circleUrl"></el-avatar>
        <p>{{ account }}</p>
        <p>{{ userName }}</p>
        <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button> -->
        <!-- <i class="el-icon-edit front" @click="latout"></i>
        <i class="el-icon-edit behind" @click="latout"></i> -->
        <el-button type="primary" size="mini" @click="handleUpdate"
          >修改</el-button
        >
        <el-button type="warning" size="mini" @click="latout">注销</el-button>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <el-dialog
      title="修改信息"
      :visible.sync="dialogFormVisible"
      :modal-append-to-body="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formInfo"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >

        <el-form-item label="姓名:" prop="userName">
          <el-input v-model="formInfo.userName" />
        </el-form-item>

        <el-form-item label="密码:" prop="password">
          <el-input v-model="formInfo.password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Cookies from 'js-cookie'
import circleUrl from '@/assets/avatar.png'
import { Decrypt, Encrypt } from '@/utils/crypto'
import { accountDetail,updateAccount } from '@/api/system'

export default {
  data() {
    var pat = /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (value === '') {
        if (rule.field == 'account') {
          callback(new Error('请输入用户名'))
        } else if (rule.field == 'userName') {
          callback(new Error('请输入姓名'))
        } else if (rule.field == 'password') {
          callback(new Error('请输入密码'))
        }
      } else if (pat.test(value) && rule.field == 'account') {
        callback(new Error('用户名不能包含特殊字符'))
      } else if (
        !(
          /[\@\#\$\%\^\&\*\(\)\_\+\!]/.test(value) &&
          /[a-z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[A-Z]/.test(value) &&
          /^.{6,}$/.test(value)
        ) &&
        rule.field == 'password'
      ) {
        callback(new Error('密码须大于6位，且包含大小写字母、数字及特殊字符'))
      } else {
        callback()
      }
    }
    return {
      status: true,
      circleUrl: circleUrl,
      dialogFormVisible: false,
      formInfo: {
        accountId: '',
        userName: '',
        password: '',
      },
      rules: {
        account: [{ required: true, validator: validateForm, trigger: 'blur' }],
        userName: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        password: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
      },
    }
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route

      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    account() {
      return JSON.parse(Cookies.get('User')).account
    },
    userName() {
      return JSON.parse(Cookies.get('User')).userName
    },
    accountId() {
      return JSON.parse(Cookies.get('User')).account_id
    },
    role() {
      return JSON.parse(Cookies.get('User')).role
    }
  },
  methods: {
    confirm() {
      this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    latout() {
      this.$store.dispatch('user/logOutDialog', true)
    },
    async confirmLatout() {
      await this.$store.dispatch('user/logOutDialog', false)
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleCloseDialog() {
      this.dialogFormVisible = false
      this.restFormData()
    },
    restFormData() {
      this.formInfo = {
        accountId: '',
        userName: '',
        password: '',
      }
      this.$refs['dataForm'].resetFields()
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formInfo.password = Encrypt(this.formInfo.password)
          updateAccount(this.account, this.formInfo)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '用户修改成功，请重新登陆',
                  type: 'success',
                })
                this.dialogFormVisible = false
                this.restFormData()
                this.confirmLatout()
              } else {
                this.$message({
                  message: '用户修改失败',
                  type: 'error',
                })
                this.dialogFormVisible = false
                this.restFormData()
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    },
    handleUpdate() {
      accountDetail(this.accountId).then((res) => {
        if (res.code == 200) {
          this.dialogFormVisible = true
          this.formInfo.accountId = this.accountId
          this.formInfo.userName = res.data.userName
          this.formInfo.password = Decrypt(res.data.password)
        } else {
          this.$message({
            message: '获取用户信息失败，请重试',
            type: 'error',
          })
        }
      })

      // this.formInfo.password = Decrypt(this.password)
    },
  },
}
</script>

<style lang="scss" scoped>
.block {
  position: relative;
  text-align: center;
  padding: 30px;
  .el-avatar {
    width: 83px !important;
    height: 83px !important;
  }
  .el-button--mini {
    padding: 4px 5px;
    font-size: 12px;
    border-radius: 3px;
  }
  .front {
    position: absolute;
    top: 46%;
    left: 25%;
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    border: 1px solid #e6a23c;
    border-radius: 50%;
    background: #e6a23c;
  }
  .behind {
    position: absolute;
    top: 46%;
    left: 62%;
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    border: 1px solid #2c71ab;
    border-radius: 50%;
    background: #2c71ab;
  }
  p:first-of-type {
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
  }
  p:last-of-type {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(158, 160, 165, 1);
  }
}
</style>
