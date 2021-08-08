<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition"
        style="width: 200px"
        class="filter-item"
        placeholder="请输入姓名、用户名"
        @keyup.enter.native="getList"
        prefix-icon="el-icon-search"
        clearable
      />

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="getList"
        >搜索</el-button
      >

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleCreate"
        >添加用户</el-button
      >
    </div>

    <el-table :data="tableData" style="width: 100%">
      <!-- <el-table-column label="ID" prop="accountId" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.accountId }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="用户名" prop="account" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="userName" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色" prop="account" align="center">
        <template slot-scope="{ row }">
          <span>{{ getRoleNameByRoleId(row.roleId) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="园区" prop="parkId" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.parkId">{{
            getParkNameByParkId(row.parkId)[0]
          }}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <!-- 
      <el-table-column label="创建时间" prop="createTime" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | time }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="更新时间" prop="updateTime" align="center">
        <template slot-scope="{ row }">
          <span
            v-if="
              row.updateTime != 0 &&
              row.updateTime != null &&
              row.updateTime != ''
            "
            >{{ row.updateTime | time }}</span
          >
        </template>
      </el-table-column>

      <el-table-column prop="name" label="操作" align="center" width="200">
        <template v-if="row.accountId != 1" slot-scope="{ row, $index }">
          <i
            class="el-icon-edit"
            style="margin-right: 20px; cursor: pointer"
            @click="handleUpdate(row)"
          ></i>
          <i
            class="el-icon-delete"
            style="cursor: pointer"
            @click="handleDelete(row, $index)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="dialogName"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="formInfo"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item
          label="用户名:"
          prop="account"
          v-if="accountShow == false"
        >
          <el-input v-model="formInfo.account" @blur="searchAccount" />
        </el-form-item>

        <el-form-item label="用户名:" prop="account" v-if="accountShow">
          <el-input v-model="formInfo.account" />
        </el-form-item>

        <el-form-item label="姓名:" prop="userName">
          <el-input v-model="formInfo.userName" />
        </el-form-item>

        <el-form-item label="密码:" prop="password">
          <el-input v-model="formInfo.password" type="password" />
        </el-form-item>

        <el-form-item label="园区:" prop="parkId">
          <el-select
            v-model="formInfo.parkId"
            filterable
            default-first-option
            placeholder="请选择园区"
            style="width: 100%"
          >
            <el-option
              v-for="item in parkList"
              :key="item.parkId"
              :label="item.parkName"
              :value="item.parkId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色:" prop="roleId">
          <el-select v-model="formInfo.roleId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-alert
        v-if="isError"
        style="margin-top: 20px; padding: 5px"
        :title="errorMsg"
        type="error"
        :closable="false"
        show-icon
      ></el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getRoleList, updateAccount, deleteAccount } from '@/api/system'
import { addAccount, accountSearch, getList } from '@/api/system'
import { updatePage } from '@/utils/update-page'
import { Decrypt, Encrypt } from '@/utils/crypto'
import { getParkNameByParkId } from '@/api/util'
import { getParkSearch } from '@/api/park'
export default {
  name: 'System',
  computed: {
    ...mapGetters(['name']),
  },
  directives: { waves },
  components: { Pagination },
  created() {
    //表格数据
    updatePage(this.getList, true)
    //角色
    this.getRoleList()
    this.getParkList()
    this.account = JSON.parse(Cookies.get('User')).account
  },
  filters: {
    // 转化时间戳
    time(value) {
      let date = new Date(value)
      let Y = date.getFullYear() + '-'
      let M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      let s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
  },
  data() {
    //自定义表单验证
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
      accountShow: false,
      formInfo: {
        accountId: '',
        account: '',
        userName: '',
        password: '',
        roleId: '',
        parkId: '',
      },
      isError: false,
      dialogStatus: 'create',
      dialogFormVisible: false,
      dialogName: '添加用户',
      total: 0,
      startRow: 1,
      downloadLoading: false,
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
      listQuery: {
        page: 1,
        limit: 10,
        condition: '',
        roleId: '',
      },
      options: [],
      tableData: [],
      account: '',
      parkList: [],
      parkQuery: {
        tagIds: [],
        name: null,
        page: 0,
        size: 0,
      },
    }
  },
  methods: {
    test() {
      console.log(this.formInfo)
    },
    getParkNameByParkId(parkId) {
      const parkIds = parkId.split(',')
      return getParkNameByParkId(parkIds, this.parkList)
    },
    //账户查重
    searchAccount() {
      if (this.formInfo.account == '') {
        return
      }
      accountSearch(this.formInfo.account)
        .then((res) => {
          if (res.data == true) {
            this.$message.error('用户名重复请重新输入')
            this.formInfo.account = ''
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //关闭窗口
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.$refs['dataForm'].resetFields()
          done()
        })
        .catch((_) => {})
    },
    //查询账户是否重复
    accountSearch() {
      if (this.formInfo.account == '') {
        return
      } else {
        accountSearch(this.formInfo.account)
          .then((res) => {
            if (res.data == true) {
              this.$message.error('用户名重复，请重新输入')
              this.formInfo.account = ''
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    getParkList() {
      // getTagSearch(this.tagListQuery)
      getParkSearch(this.parkQuery)
        .then((res) => {
          this.parkList = res.data.list
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //创建用户
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formInfo.password = Encrypt(this.formInfo.password)
          addAccount(this.account, this.formInfo)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '用户添加成功',
                  type: 'success',
                })
              } else {
                this.$message({
                  message: '用户添加失败',
                  type: 'error',
                })
              }

              this.restFormData()
              this.getList()
            })
            .catch((err) => {
              console.log(err)
            })
          this.dialogFormVisible = false
        }
      })
    },
    //修改用户
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formInfo.password = Encrypt(this.formInfo.password)
          updateAccount(this.account, this.formInfo)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '用户修改成功',
                  type: 'success',
                })
                this.dialogFormVisible = false
                this.restFormData()
                this.getList()
              } else {
                this.$message({
                  message: '用户修改失败',
                  type: 'error',
                })
                this.dialogFormVisible = false
                this.restFormData()
                this.getList()
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    },
    //删除用户
    handleDelete(row) {
      deleteAccount(this.account, row.accountId)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
            })
          }
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //角色
    getRoleList() {
      getRoleList()
        .then((res) => {
          this.options = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleDownload() {},
    //点击添加
    handleCreate() {
      ;(this.formInfo = {
        accountId: '',
        account: '',
        userName: '',
        password: '',
        roleId: '',
      }),
        (this.accountShow = false)
      this.dialogFormVisible = true
      this.dialogName = '添加用户'
      this.dialogStatus = 'create'
    },
    //用户列表
    getList() {
      return getList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //点击修改
    handleUpdate(row) {
      this.accountShow = true
      Object.assign(this.formInfo, row)
      this.formInfo.password = Decrypt(row.password)
      this.dialogFormVisible = true
      this.dialogName = '修改用户'
      this.dialogStatus = 'update'
    },
    handleCloseDialog() {
      this.dialogFormVisible = false
      this.restFormData()
    },
    //数据复位
    restFormData() {
      this.formInfo = {
        accountId: '',
        account: '',
        userName: '',
        password: '',
        roleId: '',
      }
      this.$refs['dataForm'].resetFields()
    },
    //查询用户信息
    getRoleNameByRoleId(id) {
      if (id != null || id != '') {
        let roleName = ''
        for (let i = 0; i < this.options.length; i++) {
          if (id == this.options[i].roleId) {
            roleName = this.options[i].roleName
          }
        }
        return roleName
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.mouse {
  cursor: pointer;
}
</style>
