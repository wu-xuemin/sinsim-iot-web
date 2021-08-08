<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition"
                style="width: 200px"
                class="filter-item"
                placeholder="请输入角色名称"
                @keyup.enter.native="getList"
                prefix-icon="el-icon-search"
                clearable />
      <el-button class="filter-item"
                 style="margin-left: 10px"
                 type="primary"
                 @click="getList">搜索</el-button>
      <el-button class="filter-item"
                 style="margin-left: 10px"
                 type="primary"
                 @click="handleCreate">添加角色</el-button>
    </div>

    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column label="角色名称"
                       prop="roleName"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色描述"
                       prop="remark"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间"
                       prop="createTime"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="更新时间"
                       prop="updateTime"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.updateTime | time }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"
                       align="center"
                       width="230"
                       class-name="small-padding fixed-width">
        <template v-if="row.roleId != 1"
                  slot-scope="{ row, $index }">
          <i class="el-icon-edit"
             style="margin-right: 20px; cursor: pointer"
             @click="handleEdit(row)"></i>
          <i class="el-icon-delete"
             style="cursor: pointer"
             @click="handleDelete(row, $index)"></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList" />

    <el-dialog :visible.sync="dialogVisible"
               :title="dialogType === 'edit' ? '编辑角色' : '角色添加'"
               :before-close="handleClose">
      <el-form :model="temp"
               label-width="80px"
               label-position="left"
               :rules="rules"
               ref="ruleForm">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="temp.roleName"
                    @blur="nameSearch"
                    style="width: 240px" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="temp.remark"
                    style="width: 240px" />
        </el-form-item>
        <el-form-item label="角色权限"
                      id="roles">
          <el-tree ref="tree"
                   :check-strictly="checkStrictly"
                   :data="routesData"
                   :props="defaultProps"
                   :default-checked-keys="defaultKeys"
                   @check-change="checkedTree"
                   show-checkbox
                   node-key="path"
                   class="permission-tree" />
          <p v-if="perror"
             class="el-form-item__error">角色权限不能为空</p>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="confirmRole('ruleForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import {
  addRole,
  deleteRole,
  getRoleSearch,
  roleSearch,
  updateRole,
} from '@/api/role'
import Cookies from 'js-cookie'
import { Route } from './routes.js'
import { deepClone } from '../../utils/index'
import { updatePage } from '@/utils/update-page'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: [],
}
export default {
  name: 'Rolesadd',
  directives: { waves },
  components: { Pagination },
  created() {
    updatePage(this.getList, true)
    //路由表

    this.getRoutes()
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
      return Y + M + D
    },
  },
  computed: {
    ...mapGetters(['name']),
    routesData() {
      this.keys = {}
      this.routes.map((item) => {
        const data = item
        if (data.path === '/visitor') {
          // data.disabled = true;

          for (
            var i = 0, flag = true, len = data.children.length;
            i < len;
            flag ? i++ : i
          ) {
            if (data.children[i] && data.children[i].title != '访客信息') {
              data.children.splice(i, 1)
              flag = false
            } else {
              flag = true
            }
          }
          data.children = data.children.map((p) => {
            // p.disabled = true;
            if (Array.isArray(p.children)) {
              this.keys[p.path] = p.children.map((c) => c.path)
            }
            // console.log(p)
            // console.log(1)
            return {
              ...p,
              children: [],
            }
          })
        }
        return data
      })
      return this.routes
    },
  },
  data() {
    var pat =
      /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (value === '') {
        if (rule.field == 'roleName') {
          callback(new Error('请输入角色名称'))
        }
      } else if (pat.test(value)) {
        if (rule.field == 'roleName') {
          callback(new Error('角色名称不能包含特殊字符'))
        }
      } else {
        callback()
      }
    }
    return {
      checkedArr: [],
      defaultKeys: [],
      perror: false,
      dialogType: 'new',
      role: Object.assign({}, defaultRole),
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      routes: [],
      dialogVisible: false,
      checkList: [],
      dialogFormVisible: false,
      total: 0,
      downloadLoading: false,
      rules: {
        roleName: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
      },
      listQuery: {
        page: 1,
        limit: 10,
        condition: '',
        roleId: '',
      },
      temp: {
        roleName: '',
        remark: '',
        roleId: '',
      },
      tableData: [],
      keys: [],
    }
  },
  methods: {
    //关闭窗口
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.$refs['ruleForm'].resetFields()
          done()
        })
        .catch((_) => {})
    },
    //树形控件被选中触发
    checkedTree() {
      this.perror = false
    },
    confirmRole(formName) {
      console.log(this.routesData)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const checkedKeys = this.$refs.tree.getCheckedKeys()
          if (checkedKeys == '[]') {
            this.perror = true
            return
          } else {
            let k = []
            for (const [key, value] of Object.entries(this.keys)) {
              if (checkedKeys.includes(key)) {
                k = [].concat(k, value)
              }
            }
            const checkedKeysAndChildren = [].concat(checkedKeys, k)
            this.role.routes = this.generateTree(
              deepClone(this.serviceRoutes),
              '/',
              checkedKeysAndChildren
            )
            if (this.role.routes.length == 0) {
              this.perror = true
              return
            } else {
              const role = {
                scope: JSON.stringify(this.role.routes),
                roleName: this.temp.roleName,
                remark: this.temp.remark,
              }
              //console.log(role.scope)
              let account = JSON.parse(Cookies.get('User')).account

              //这里是更新
              if (this.dialogType == 'edit') {
                const updataInfo = {
                  scope: JSON.stringify(this.role.routes),
                  roleName: this.temp.roleName,
                  remark: this.temp.remark,
                  roleId: this.temp.roleId,
                }
                //console.log(role.scope)
                updateRole(account, updataInfo)
                  .then((res) => {
                    if (res.code == 200) {
                      this.$message({
                        message: '角色更新成功',
                        type: 'success',
                      })
                    } else {
                      this.$message({
                        message: '角色更新失败',
                        type: 'error',
                      })
                    }

                    this.getList()
                    this.dialogVisible = false
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              } else {
                //这里是新增
                addRole(account, role)
                  .then((res) => {
                    if (res.code == 200) {
                      this.$message({
                        message: '角色添加成功',
                        type: 'success',
                      })
                    } else {
                      this.$message({
                        message: '角色添加失败',
                        type: 'error',
                      })
                    }
                    this.dialogVisible = false
                    this.getList()
                    this.dialogFormVisible = false
                  })
                  .catch((err) => {
                    console.log(err)
                  })
              }
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getScopeKeys(arr, key = []) {
      for (let i = 0; i < arr.length; i++) {
        const obj = arr[i]
        key.push(obj.path)
        if (obj.children && obj.children.length >= 1) {
          this.getScopeKeys(obj.children, key)
        }
      }
      return key
    },
    //更新
    handleEdit(row) {
      this.dialogType = 'edit'

      this.dialogVisible = true

      this.checkStrictly = true

      this.role = deepClone(row)
      this.$nextTick(() => {
        this.temp = { ...row }
        const routes = this.generateRoutes(row.scope)
        this.defaultKeys = this.getScopeKeys(routes)
        this.checkStrictly = false
        this.$refs['ruleForm'].resetFields()
      })
    },
    async getRoutes() {
      const routes = Route
      this.serviceRoutes = routes
      this.routes = this.generateRoutes(routes)
    },
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        if (route.hidden) {
          continue
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(
          route.children,
          route
        )

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title,
        }

        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter((item) => !item.hidden)

      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },
    //删除
    handleDelete(row) {
      const account = JSON.parse(Cookies.get('User')).account
      deleteRole(account, row.roleId)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '角色删除成功',
              type: 'success',
            })
          } else {
            this.$message({
              message: '角色删除失败',
              type: 'error',
            })
          }
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //查询角色名称是否存在
    nameSearch() {
      if (this.temp.roleName == '') {
        return
      } else {
        const roleName = this.temp.roleName
        let test = {
          name: roleName,
        }
        roleSearch(test)
          .then((res) => {
            if (res.data == true) {
              this.$message.error('角色重复，请重新输入')
              this.temp.roleName = ''
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },

    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        if (route.children) {
          route.children = this.generateTree(
            route.children,
            routePath,
            checkedKeys
          )
        }

        if (
          checkedKeys.includes(routePath) ||
          (route.children && route.children.length >= 1)
        ) {
          res.push(route)
        }
      }
      return res
    },
    handleDownload() {},

    //新增
    handleCreate() {
      this.temp = {
        roleName: '',
        remark: '',
        roleId: '',
      }
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    getList() {
      return getRoleSearch(this.listQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.tableData.forEach((p) => {
            p.scope = JSON.parse(p.scope)
            //console.log(222)
            //console.log(p.scope)
          })
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-checkbox-group {
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
