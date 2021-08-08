<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition"
        style="width: 200px;"
        class="filter-item"
        placeholder="策略名称"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getAccessPolicyList"
        clearable
      />

      <el-select
        v-model="listQuery.tagIds"
        multiple
        filterable
        collapse-tags
        default-first-option
        placeholder="标签名称"
        @change="getAccessPolicyList"
      >
        <el-option
          v-for="item in tagList"
          :key="item.tagId"
          :label="item.tagName"
          :value="item.tagId"
        />
      </el-select>

      <el-select
        v-model="listQuery.deviceIds"
        multiple
        filterable
        collapse-tags
        default-first-option
        placeholder="设备名称"
        @change="getAccessPolicyList"
      >
        <el-option
          v-for="item in deviceList"
          :key="item.deviceId"
          :label="item.deviceName"
          :value="item.deviceId"
        />
      </el-select>

      <el-select
        v-model="listQuery.policyType"
        clearable
        placeholder="策略类型"
        style="width: 120px"
        @change="getAccessPolicyList"
      >
        <el-option
          v-for="item in skills"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      
      <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="getAccessPolicyList"
            >搜索</el-button
          >

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        @click="handleCreate"
        >添加</el-button
      >
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="策略名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.policyName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="策略类型" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.policyType !== 'STAFF'">访客</span>
          <span v-else>员工</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="允许通行人员" align="center">
        <template slot-scope="{ row }">
          <el-tag
            v-for="tagName in getTagNameByTagId(row.tagIds).split(',')"
            :key="tagName"
            style="margin: 5px"
            >{{ tagName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="通行设备" align="center">
        <template slot-scope="{ row }">
          <el-tag
            v-for="deviceId in getDeviceNameByDeviceId(row.deviceIds).split(
              ','
            )"
            :key="deviceId"
            style="margin: 5px"
            >{{ deviceId }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" align="center">
        <template slot-scope="{ row, $index }" v-if="row.policyType !== 'VISITOR'">
          <i
            class="el-icon-edit"
            style="margin-right: 20px;cursor:pointer"
            @click="handleUpdate(row)"
          ></i>
          <i
            class="el-icon-delete"
            style="cursor:pointer"
            @click="handleDelete(row, $index)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getAccessPolicyList"
    />

    <el-dialog
      :title="dialogName"
      :before-close="handleCloseTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="policy"
        label-position="right"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="策略名称:" prop="policyName">
          <el-input v-model="policy.policyName" />
        </el-form-item>

        <!-- <el-form-item label="策略类型:" prop="type" v-if="dialogName !='创建策略'">
          <el-select v-model="policy.type" clearable placeholder="请选择类型">
            <el-option
              v-for="item in skills"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>-->

        <el-form-item label="允许通行人员:" prop="tagIds">
          <el-select
            v-model="tagIds"
            filterable
            multiple
            default-first-option
            placeholder="请选择标签"
            style="width:100%">
            <el-option
              v-for="item in testtagList"
              :key="item.tagId"
              :label="item.tagName"
              :value="item.tagId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="允许通行设备:" prop="deviceIds">
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
            />
          </el-select>
        </el-form-item>

        <el-form-item label="通行时间:" prop="time1">
          <template>
            <el-time-picker
              is-range
              v-model="policy.time"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
            <el-checkbox-group v-model="policy.time1">
              <el-checkbox
                v-for="item in Array(7)
                  .fill(0)
                  .map((_, i) => i + 1)"
                :key="item"
                :label="'周' + timeOptions[item]"
              ></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </el-form>

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
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import Cookies from 'js-cookie'

import {
  getPolicySearch,
  addPolicy,
  updatePolicy,
  deletePolicy
} from '@/api/accessPolicy'
import { getDeviceList } from '@/api/device'
import { getTagList } from '@/api/staff'
import { updatePage } from '@/utils/update-page'
import moment from 'moment'

export default {
  name: 'Tactics',
  computed: {
    ...mapGetters(['name'])
  },
  directives: { waves },
  components: { Pagination },
  created() {
    this.getDeviceInfo()
    this.getTagInfo()
    updatePage(this.getAccessPolicyList, true)
    this.account = JSON.parse(Cookies.get('User')).account
  },
  data() {
    var pat = /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (value === '') {
        if (rule.field == 'policyName') {
          callback(new Error('请输入策略名称'))
        }
      } else if (pat.test(value)) {
        if (rule.field == 'policyName') {
          callback(new Error('策略名称不能包含特殊字符'))
        }
      } else {
        callback()
      }
    }
    const timeOptions = ['', '一', '二', '三', '四', '五', '六', '日']
    return {
      timeOptions: timeOptions,
      testtagList: [],
      dialogFormVisible: false,
      dialogStatus: '',
      dialogName: '创建策略',
      total: 0,
      downloadLoading: false,
      rules: {
        policyName: [
          { required: true, validator: validateForm, trigger: 'blur' }
        ],
        policyType: [
          { required: true, message: '策略类型不能为空', trigger: 'change' }
        ],
        tagIds: [{ required: true, message: '标签不能为空', trigger: 'blur' }],
        deviceIds: [
          { required: true, message: '设备不能为空', trigger: 'blur' }
        ],
        time1: {
          required: true,
          validator: (rule, value, callback) => {
            if (!value.length) {
              callback(new Error('通行日必填'))
            } else {
              callback()
            }
          }
        }
      },
      listQuery: {
        condition: '',
        tagIds: [],
        deviceIds: [],
        policyType: '',
        page: 1,
        limit: 20
      },
      skills: [
        {
          value: 'STAFF',
          label: '员工'
        },
        {
          value: 'VISITOR',
          label: '访客'
        }
      ],
      value1: '',
      value: '',
      options: '',
      time: '',
      policy: {
        policyId: '',
        policyName: '',
        tagIds: '',
        deviceIds: '',
        policyType: 'STAFF',
        tag: '',
        entry: '',
        remark: '',
        picture: '',
        time: [new Date(2000, 1, 1, 0, 0), new Date(2000, 1, 1, 23, 59)],
        time1: Array(7)
          .fill(0)
          .map((_, i) => '周' + timeOptions[i + 1])
      },
      tableData: [],
      deviceList: [],
      tagList: [],
      tagIds: [],
      deviceIds: [],
      account: ''
    }
  },
  methods: {
    handleDownload() {},
    handleCloseTitle(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.$refs['dataForm'].resetFields()
          this.resetFormData()
          done()
        })
        .catch(_ => {})
    },

    // 数据置空
    resetFormData() {
      this.policy = {
        policyName: '',
        deviceIds: '',
        tagIds: '',
        policyType: 'STAFF',
        time: [new Date(2000, 1, 1, 0, 0), new Date(2000, 1, 1, 23, 59)],
        time1: Array(7)
          .fill(0)
          .map((_, i) => '周' + this.timeOptions[i + 1])
      }
      this.tagIds = []
      this.deviceIds = []
    },

    // 添加通行策略
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.dialogName = '创建策略'
    },
    // 修改通行策略
    handleUpdate(row) {
      Object.assign(this.policy, row)
      this.tagIds = row.tagIds.split(',')
      this.deviceIds = row.deviceIds.split(',')
      this.dialogName = '修改策略'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.policy.time = [
        '2000-01-01 ' + row.startTime,
        '2000-01-01 ' + row.endTime
      ]
      this.policy.time1 = row.validWeekday
        .split(',')
        .map(_ => '周' + this.timeOptions[_])
    },
    // 通行策略列表
    getAccessPolicyList() {
      return getPolicySearch(this.listQuery)
        .then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 设备列表
    getDeviceInfo() {
      this.deviceList = []
      getDeviceList().then(res => {
        res.data.forEach(item => {
          if (item.deviceType != 0) {
            this.deviceList.push(item)
          }
        })
      })
    },
    // 标签列表
    getTagInfo() {
      getTagList().then(res => {
        this.tagList = res.data
        let arr = res.data
        arr.forEach(item => {
            this.testtagList.push(item)
          
        })
        console.log(this.testtagList)
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
      this.$refs['dataForm'].resetFields()
      this.resetFormData()
    },
    // 添加
    createData() {
      this.policy.tagIds = this.tagIds.toString()
      this.policy.deviceIds = this.deviceIds.toString()
      let start_timestamp= new Date(this.policy.time[0]).getTime()
      let end_timestamp= new Date(this.policy.time[1]).getTime()
      if (this.policy.time) {
        const valid_time = {
          start_date: moment(new Date()).format('YYYY-MM-DD'),
          startTime: moment(this.policy.time[0]).format('HH:mm:ss'),
          start_timestamp: start_timestamp,
          endTime: moment(this.policy.time[1]).format('HH:mm:ss'),
          end_timestamp: end_timestamp,
          mode: 3,
          validWeekday: this.policy.time1
            .map(_ => this.timeOptions.findIndex(o => o === _.slice(1)))
            .join(',')
        }
        this.policy = Object.assign(this.policy, valid_time)
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addPolicy(this.account, this.policy)
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.getAccessPolicyList()
                this.resetFormData()
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
    // 修改
    updateData() {
      this.policy.tagIds = this.tagIds.toString()
      this.policy.deviceIds = this.deviceIds.toString()
      let start_timestamp= new Date(this.policy.time[0]).getTime()
      let end_timestamp= new Date(this.policy.time[1]).getTime()
      if (this.policy.time) {
        const valid_time = {
          start_date: moment(new Date()).format('YYYY-MM-DD'),
          startTime: moment(this.policy.time[0]).format('HH:mm:ss'),
          start_timestamp: start_timestamp,
          endTime: moment(this.policy.time[1]).format('HH:mm:ss'),
          end_timestamp: end_timestamp,
          mode: 3,
          validWeekday: this.policy.time1
            .map(_ => this.timeOptions.findIndex(o => o === _.slice(1)))
            .join(',')
        }
        this.policy = Object.assign(this.policy, valid_time)
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updatePolicy(this.account, this.policy)
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.getAccessPolicyList()
                this.resetFormData()
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
      deletePolicy(this.account, row.policyId)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getAccessPolicyList()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
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
