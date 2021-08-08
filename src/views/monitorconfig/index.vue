<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition"
        style="width: 200px;"
        class="filter-item"
        placeholder="任务名称"
        @keyup.enter.native="getTaskList"
        prefix-icon="el-icon-search"
        clearable
      />
      <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="getTaskList"
            >搜索</el-button
          >
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
      >添加</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="任务名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="人员标签" align="center">
        <template slot-scope="{ row }">
          <el-tag
            v-for="tagName in getTagNameByTagId(row.tagIds).split(',')"
            :key="tagName"
            style="margin: 5px"
          >{{ tagName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="监控设备" align="center">
        <template slot-scope="{ row }">
          <el-tag
            v-for="tagName in getDeviceNameByDeviceId(row.deviceIds).split(',')"
            :key="tagName"
            style="margin: 5px"
          >{{ tagName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="监控类型" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.mode == 0">未比中报警</span>
          <span v-if="row.mode == 1">比中报警</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="比对阈值" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="状态" align="center">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.enabled }}</span> -->
          <el-switch
            v-model="row.enabled"
            active-color="#568dbc"
            inactive-color="#a7a5a6"
            @change="handleSwitch(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="创建时间" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.createTime | time}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" align="center" width="200">
        <template slot-scope="{ row, $index }">
          <i
            class="el-icon-edit"
            style="margin-right: 20px;cursor:pointer"
            @click="handleUpdate(row)"
          ></i>
          <i class="el-icon-delete" style="cursor:pointer" @click="handleDelete(row, $index)"></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getTaskList"
    />

    <el-dialog
      :title="dialogName"
      :before-close="handleCloseTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="布控名称:" prop="taskName">
          <el-input v-model="temp.taskName" @blur="nameSearch" />
          <!-- <div class="el-form-item__error">布控名称不能为空</div> -->
        </el-form-item>

        <el-form-item label="监控类型" prop="mode">
          <el-select v-model="temp.mode" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签:" prop="tagIds">
          <el-select v-model="tagIds" filterable multiple default-first-option placeholder="请选择标签" style="width:100%">
            <el-option
              v-for="item in tagList"
              :key="item.tagId"
              :label="item.tagName"
              :value="item.tagId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备:" prop="deviceIds">
          <el-select
            v-model="deviceIds"
            filterable
            multiple
            default-first-option
            placeholder="请选择设备"
            style="width:100%">
            <el-option
              v-for="item in deviceList"
              :key="item.deviceId"
              :label="item.deviceName"
              :value="item.deviceId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="阈值:">
          <el-slider v-model="temp.score"></el-slider>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog()">取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import Cookies from 'js-cookie'

import {
  getTaskSearch,
  addTask,
  updateTask,
  deleteTask,
  checkTaskName
} from '@/api/monitoringTask'
import { getTagList } from '@/api/staff'
import { getDeviceList } from '@/api/device'
import { updatePage } from '@/utils/update-page'
import {
  ErrorMsg,
  SuccessMsg
} from '@/utils/message'

export default {
  name: 'Monitorconfig',
  computed: {
    ...mapGetters(['name'])
  },
  directives: { waves },
  components: { Pagination },
  created() {
    this.getTagInfoList()
    this.getDeviceInfoList()
    updatePage(this.getTaskList, true)
    this.account = JSON.parse(Cookies.get('User')).account
  },
  data() {
    var pat = /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (value === '') {
        if (rule.field == 'taskName') {
          callback(new Error('请输入任务名称'))
        }
      } else if (pat.test(value)) {
        if (rule.field == 'taskName') {
          callback(new Error('任务名称不能包含特殊字符'))
        }
      } else {
        callback()
      }
    }
    return {
      nameRepet: false,
      dialogFormVisible: false,
      dialogStatus: 'create',
      dialogName: '新建任务',
      total: 0,
      downloadLoading: false,
      rules: {
        taskName: [
          { required: true, validator: validateForm, trigger: 'change' }
        ],

        deviceIds: [
          { required: true, message: '设备不能为空', trigger: 'blur' }
        ],
        mode: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        tagIds: [{ required: true, message: '标签不能为空', trigger: 'blur' }]
      },
      listQuery: {
        condition: '',
        tagIds: [],
        deviceIds: [],
        type: '',
        page: 1,
        limit: 10
      },
      options: [
        {
          value: 0,
          label: '未比中报警'
        },
        {
          value: 1,
          label: '比中报警'
        }
      ],
      temp: {
        taskId: '',
        taskName: '',
        enabled: true,
        score: 0.0,
        deviceIds: '',
        tagIds: '',
        mode: ''
      },
      tableData: [],
      tagList: [],
      deviceList: [],
      tagIds: [],
      deviceIds: [],
      account: ''
    }
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
  methods: {
    //查询角色名称是否存在
    nameSearch() {
      checkTaskName(this.temp.taskName)
        .then(res => {
          console.log(res)
          if (res.data == true) {
            this.$message.error('任务名称重复')
          }
          this.nameRepet = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleDownload() {},

    handleCloseTitle(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.resetFormData()
          done()
        })
        .catch(_ => {})
    },
    // 数据置空
    resetFormData() {
      this.temp = {
        taskId: '',
        taskName: '',
        enabled: true,
        score: 0.0,
        deviceIds: '',
        tagIds: '',
        model: ''
      }
      this.tagIds = []
      this.deviceIds = []
      this.$refs['dataForm'].resetFields()
    },

    //添加
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.dialogName = '新建任务'
    },
    createData() {
      this.temp.tagIds = this.tagIds.toString()
      this.temp.deviceIds = this.deviceIds.toString()
      if (this.nameRepet) {
        this.nameSearch()
        return
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addTask(this.account, this.temp)
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.resetFormData()
                this.getTaskList()
              } else {
                this.$message.error('添加失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    //修改
    handleUpdate(row) {
      Object.assign(this.temp, row)
      this.dialogStatus = 'update'
      this.dialogName = '修改任务'
      this.tagIds = row.tagIds.split(',')
      this.deviceIds = row.deviceIds.split(',')
      this.dialogFormVisible = true
    },
    handleSwitch(row) {
      updateTask(this.account, row)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.getTaskList()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateData() {
      this.temp.tagIds = this.tagIds.toString()
      this.temp.deviceIds = this.deviceIds.toString()
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateTask(this.account, this.temp)
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.resetFormData()
                this.getTaskList()
              } else {
                this.$message.error('修改失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    //删除
    handleDelete(row) {
      deleteTask(this.account, row.taskId)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getTaskList()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //任务列表
    getTaskList() {
      return getTaskSearch(this.listQuery)
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list
            this.total = res.data.total
          }
          return res
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取标签列表
    getTagInfoList() {
      getTagList()
        .then(res => {
          if (res.code == 200) {
            this.tagList = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //获取设备列表
    getDeviceInfoList() {
      this.deviceList = []
      getDeviceList()
        .then(res => {
          res.data.forEach(item => {
            // if (item.deviceType == 0) {
              this.deviceList.push(item)
            // }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据设备ID查询设备名称
    getDeviceNameByDeviceId(deviceId) {
      const deviceIds = deviceId.split(',')
      let deviceName = ''
      for (let i = 0; i < deviceIds.length; i++) {
        for (let j = 0; j < this.deviceList.length; j++) {
          if (deviceIds[i] == this.deviceList[j].deviceId) {
            if (deviceName == '' || deviceName == null) {
              deviceName = this.deviceList[j].deviceName
            } else {
              deviceName = deviceName + ',' + this.deviceList[j].deviceName
            }
          }
        }
      }
      return deviceName
    },
    // 根据标签id查询标签名称
    getTagNameByTagId(tagId) {
      const tagIds = tagId.split(',')
      let tagNames = ''
      for (let i = 0; i < tagIds.length; i++) {
        for (let j = 0; j < this.tagList.length; j++) {
          if (tagIds[i] == this.tagList[j].tagId) {
            if (tagNames == '' || tagNames == null) {
              tagNames = this.tagList[j].tagName
            } else {
              tagNames = tagNames + ',' + this.tagList[j].tagName
            }
          }
        }
      }
      return tagNames
    },
    // 关闭弹窗
    handleCloseDialog() {
      this.dialogFormVisible = false
      this.resetFormData()
    }
  }
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
</style>
