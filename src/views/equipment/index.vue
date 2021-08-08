<template>
  <div class="app-container">
    <!-- <div class="app-left">
        <div class="tag">
          <div class="tag-top">
            <div class="tag-h3">区域</div>
            <i class="el-icon-more" @click="handleAreaAdd"></i>
          </div>

          <el-input
            v-model="areaNameQuery.condition"
            placeholder="请输入区域名称"
            prefix-icon="el-icon-search"
            @keyup.native="getAreaInfoSearch"
            clearable
          ></el-input>

          <div>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全部</el-checkbox
            >
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                style="display: block"
                v-for="city in cities"
                :label="city"
                :key="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div> -->
    <div>
      <div class="filter-container">
        <el-input
          v-model="listQuery.condition"
          style="width: 300px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
          prefix-icon="el-icon-search"
          placeholder="输入设备ID、名称"
          clearable
        />
        <el-select
          v-model="park"
          placeholder="园区"
          style="width: 170px"
          @change="parkSection"
          :disabled="selectP"
          clearable
          filterable
        >
          <el-option
            v-for="item in parkList"
            :key="item.parkId"
            :label="item.parkName"
            :value="item.parkId"
          ></el-option>
        </el-select>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          @click="handleFilter"
          >搜索</el-button
        >
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="设备ID" prop="device_id" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.device_id }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="设备名称"
          prop="device_meta.device_name"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.device_meta.device_name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="设备类型"
          prop="device_meta.type"
          align="center"
        >
          <template slot-scope="{ row }">
            <span v-if="row.device_meta.type == 2">门禁</span>
            <span v-else-if="row.device_meta.type == 3">闸机</span>
            <span v-else>抓拍机</span>
          </template>
        </el-table-column>

        <el-table-column label="版本" prop="device_meta.version" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.device_meta.version == null || row.deviceName == ''"
              >--</span
            >
            <span v-else>{{ row.device_meta.version }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="设备位置"
          prop="device_meta.location"
          align="center"
        >
          <template slot-scope="{ row }">
            <span
              v-if="
                row.device_meta.location == null ||
                row.device_meta.location == ''
              "
              >--</span
            >
            <span v-else>{{ row.device_meta.location }}</span>
          </template>
        </el-table-column>

        <el-table-column label="设备状态" align="center">
          <template slot-scope="{ row }">
            <div>
              <span>
                <i
                  :class="
                    getDeviceStateIcon(
                      row.deviceStatus.status,
                      row.deviceStatus.status_detail
                    )
                  "
                ></i>
                {{
                  getDeviceState(
                    row.deviceStatus.status,
                    row.deviceStatus.status_detail
                  )
                }}</span
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getDeviceSearch"
      />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import Cookies from 'js-cookie'
import { getParkSearch } from '@/api/park'
import {
  feachImage,
  getTagNameByTagId,
  verifyValue,
  verifyStaffNum,
  verifyNum,
  verifyIp,
} from '@/api/util'
import { ErrorMsg, SuccessMsg } from '@/utils/message'

import {
  getDeviceList,
  getDeviceSearch,
  updataDevice,
  deleteDevice,
  addDevice,
  checkDeviceId,
  checkDeviceIp,
  issued,
} from '@/api/device'

import {
  getAreaSearch,
  getAreaList,
  addArea,
  updateArea,
  deleteArea,
} from '@/api/device'

import { updatePage } from '@/utils/update-page'
import request from '@/utils/request'
import md5 from 'blueimp-md5'

let cityOptions = []
const DeviceState = {
  all: '全部状态',
  block: '故障',
  connecting: '连接中',
  deleting: '删除中',
  upgrading: '升级中',
  online: '在线',
  internet_error: '网络错误',
  unknown: '未知',
  password_error: '用户名密码错误',
  unknown_host: 'IP有误',
  device_type_unmatched: '设备类型不匹配',
  device_type_not_support: '不支持该型号设备',
  device_disconnect_from_park: '设备主动断开',
  version_does_not_match: '版本不匹配',
  upgrade_version: '请将设备升级到3.0.0及以上版本',
  connection_failed: '连接失败',
}

export default {
  name: 'Employee',
  components: { Pagination },
  directives: { waves },
  data() {
    //var pat = /[`~!@#$%^&*()\+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (rule.field == 'deviceIp') {
        if (verifyIp(value)) {
          callback(new Error('请输入正确的ip地址'))
        }
      }

      if (value == '' || value == null) {
        callback(new Error('该项不能为空'))
      } else if (verifyValue(value)) {
        callback(new Error('该项不能包含特殊字符'))
      } else {
        callback()
      }
    }
    return {
      testArr: [],
      areaData: [],
      checkedCities: cityOptions,
      cities: cityOptions,
      dialogName: '',
      deviceIdShow: false,
      butLoading: false,
      deleteConfirmVisible: false,
      ChannelFormVisible: false,
      total: 0,
      deviceType: [
        {
          label: '智能盒子',
          value: 0,
        },
        {
          label: '人脸门禁',
          value: 1,
        },
        {
          label: '人脸闸机',
          value: 2,
        },
      ],
      deviceStatus: [
        {
          label: '在线',
          value: 'OK',
        },
        {
          label: '密码错误',
          value: 'PASSWORD_ERROR',
        },
        {
          label: '网络错误',
          value: 'NETWORK_ERROR',
        },
      ],
      dialogImageUrl: '',
      dialogAreaVisible: false,
      dialogVisible: false,
      issuedVisible: false,
      dialogAreaStatus: 'create',
      dialogAreaName: '创建区域',
      areaList: [],
      value: [],
      input: '',
      checkAll: true,
      areaCities: [],
      areaTotal: 0,
      isIndeterminate: false,
      listQuery: {
        condition: '',
        parkId: '',
        page: 1,
        limit: 10,
      },
      temp: {
        deviceId: '',
        deviceName: '',
        deviceIp: '',
        deviceAccount: '',
        devicePassword: '',
        areaId: '',
        deviceType: '',
        location: '',
      },
      channelTemp: [],
      areaInfo: {
        areaId: '',
        areaName: '',
      },
      areaQuery: {
        page: 1,
        limit: 10,
      },
      areaNameQuery: {
        condition: '',
      },
      downloadLoading: false,
      tableData: [],
      dialogFormVisible: false,
      rules: {
        deviceType: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
        ],
        deviceId: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        deviceName: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        deviceIp: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        deviceAccount: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        devicePassword: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        areaId: [{ required: true, validator: validateForm, trigger: 'blur' }],
      },
      areaRules: {
        areaName: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
      },
      account: '',
      query: {
        page: 1,
        limit: 10,
        deviceId: null,
      },
      device: {},
      selectP: localStorage.getItem('parkId').length > 0,
      parkList: [],
      park: '',
      parkQuery: {
        tagIds: null,
        name: null,
        page: 0,
        size: 0,
      },
    }
  },
  created() {
    // 自动更新
    this.listQuery.parkId = localStorage.getItem('parkId')
    this.park = localStorage.getItem('parkId')
    this.getParkList()
    updatePage(this.getDeviceSearch, true)
    // this.getAreaInfoSearch()
    // this.getAreaList()
    this.account = JSON.parse(Cookies.get('User')).account
  },
  methods: {
    parkSection() {
      this.listQuery.parkId = this.park
      this.getDeviceSearch()
    },
    getParkList() {
      // getTagSearch(this.tagListQuery)
      getParkSearch(this.parkQuery)
        .then((res) => {
          this.parkList = res.data.list
          // this.getTagList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getDeviceStateIcon(status, statusDetail) {
      switch (status) {
        case 'WAITING':
          return 'el-icon-loading'
        case 'RUNNING':
          switch (statusDetail) {
            case 'OK':
              return 'el-icon-check'
            case 'STARTING':
              return 'el-icon-loading'
            case 'UPGRADING':
              return 'el-icon-refresh'
            case 'DISCONNECT':
              return 'el-icon-close'
            case 'DEVICE_VERSION_UNMATCHED':
              return 'el-icon-warning-outline'
            case 'CONNECTED_FAILED':
              return 'el-icon-close'
            default:
              return 'el-icon-warning-outline'
          }
        case 'ERROR':
          switch (statusDetail) {
            case 'DISCONNECT':
              return 'el-icon-close'
            default:
              return 'el-icon-close'
          }
        case 'DELETING':
          return 'el-icon-delete'
        case 'ACTIVE_DELETING':
          return 'el-icon-delete'
        default:
          return 'el-icon-warning-outline'
      }
    },
    getDeviceState(status, statusDetail) {
      switch (status) {
        case 'WAITING':
          return DeviceState.connecting
        case 'RUNNING':
          switch (statusDetail) {
            case 'OK':
              return DeviceState.online
            case 'STARTING':
              return DeviceState.connecting
            case 'UPGRADING':
              return DeviceState.upgrading
            case 'DISCONNECT':
              return DeviceState.internet_error
            case 'DEVICE_VERSION_UNMATCHED':
              return DeviceState.device_version_unmatched
            case 'CONNECTED_FAILED':
              return DeviceState.connected_failed
            default:
              return DeviceState.unknown
          }
        case 'ERROR':
          switch (statusDetail) {
            case 'DISCONNECT':
              return DeviceState.internet_error
            default:
              return DeviceState.block
          }
        case 'DELETING':
          return DeviceState.deleting
        case 'ACTIVE_DELETING':
          return DeviceState.active_deleting
        default:
          return DeviceState.unknown
      }
    },
    //id查重
    searchID() {
      checkDeviceId(this.temp.deviceId)
        .then((res) => {
          if (res.data == true && this.dialogStatus === 'create') {
            this.$message.error('id错误,请重新输入')
            this.temp.deviceId = ''
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //ip查重
    searchIP() {
      checkDeviceIp(this.temp.deviceIp)
        .then((res) => {
          if (res.data == true && this.dialogStatus === 'create') {
            this.$message.error('ip错误,请重新输入')
            this.temp.deviceIp = ''
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //数据重置
    restTempData() {
      this.temp = {
        deviceId: '',
        deviceName: '',
        deviceIp: '',
        deviceAccount: '',
        devicePassword: '',
        areaId: '',
        deviceType: '',
        location: '',
      }
    },

    handleFilter() {
      this.getDeviceSearch()
    },
    //全选区域
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
      if (val) {
        this.listQuery.areaIds = []
      }

      if (this.checkedCities.length > 0) {
        this.getDeviceSearch()
      } else {
        this.tableData = []
      }
    },
    //选择单个区域
    handleCheckedCitiesChange(value) {
      this.listQuery.areaIds = []
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
      if (value.length == 0) {
        this.tableData = []
        return
      }
      const tagIds = []
      for (let i = 0; i < checkedCount; i++) {
        for (let k = 0; k < this.testArr.length; k++) {
          if (this.testArr[k].areaName === value[i]) {
            this.listQuery.areaIds.push(this.testArr[k].areaId)
          }
        }
      }

      this.getDeviceSearch()
    },
    //更新
    handleUpdate(row) {
      this.dialogName = '修改设备'
      this.deviceIdShow = true
      row.mate = null
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    //更新
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.butLoading = true
          updataDevice(this.account, this.temp)
            .then((res) => {
              this.$message({
                message: '修改成功',
                type: 'success',
              })
              this.dialogFormVisible = false
              this.butLoading = false
              this.restTempData()
              this.getDeviceSearch()
            })
            .catch((err) => {
              this.butLoading = false
              console.log(err)
            })
        }
      })
    },

    //删除
    handleDelete(row) {
      this.deleteConfirmVisible = true
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
    },

    handleWebsite(row) {
      const self = window.open('http://' + row.deviceIp, '_blank')
      console.log(self)
    },

    //删除
    deleteData() {
      this.butLoading = true
      deleteDevice(this.account, this.temp.deviceId)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.deleteConfirmVisible = false
            this.butLoading = false
            this.getDeviceSearch()
          }
        })
        .catch((err) => {
          this.butLoading = false
          console.log(err)
        })
    },
    //显示添加
    handleCreate() {
      this.dialogName = '创建设备'
      this.dialogStatus = 'create'
      this.temp = {}
      this.dialogFormVisible = true
      this.deviceIdShow = false
    },

    //添加
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.butLoading = true
          this.deviceIdShow = true
          addDevice(this.account, this.temp)
            .then((res) => {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
              this.dialogFormVisible = false
              this.butLoading = false
              this.restTempData()
              this.getDeviceSearch()
            })
            .catch((err) => {
              this.butLoading = false
              console.log(err)
            })
        }
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
    handleChannelClose(done) {
      done()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    getDeviceSearch() {
      return getDeviceSearch(this.listQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //多选框区域标签
    getAreaInfoSearch() {
      getAreaSearch(this.areaNameQuery)
        .then((res) => {
          let areaList = res.data.list
          this.testArr = res.data.list
          cityOptions.splice(0)
          this.listQuery.areaIds.splice(0)
          areaList.forEach((p) => {
            cityOptions.push(p.areaName)
            this.listQuery.areaIds.push(p.areaId)
          })
          this.handleFilter()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //分页展示区域信息
    getAreaInfo() {
      getAreaSearch(this.areaQuery)
        .then((res) => {
          if (res.code == 200) {
            this.areaData = res.data.list
            this.areaTotal = res.data.total
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //区域列表
    getAreaList() {
      getAreaList()
        .then((res) => {
          this.areaList = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getAreaNameByAreaId(areaId) {
      if (areaId != null && areaId != '') {
        for (let i = 0; i < this.testArr.length; i++) {
          if (areaId == this.testArr[i].areaId) {
            return this.testArr[i].areaName
          }
        }
      }
    },
    handleCloseDialog() {
      this.dialogFormVisible = false
      this.$refs['dataForm'].resetFields()
      this.restTempData()
    },
    handleCloseChannelDialog() {
      this.ChannelFormVisible = false
    },
    handleChannelInfo(data) {
      this.ChannelFormVisible = true
      this.channelTemp = eval('(' + data + ')')
    },
    handleAreaAdd() {
      this.dialogAreaVisible = true
      this.dialogAreaStatus = 'create'
      this.dialogAreaName = '创建区域'
      this.getAreaInfo()
    },
    handleCreateArea() {
      this.dialogVisible = true
    },
    handleUpdateArea(row) {
      this.dialogAreaName = '修改区域'
      this.dialogVisible = true
      this.dialogAreaStatus = 'update'
      Object.assign(this.areaInfo, row)
    },
    handleCloseArea() {
      this.dialogVisible = false
      this.areaInfo.areaName = ''
    },
    createArea() {
      this.$refs['areaForm'].validate((valid) => {
        if (valid) {
          addArea(this.account, this.areaInfo)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                })
                this.getAreaInfoSearch()
                this.getAreaInfo()
                this.dialogVisible = false
                this.areaInfo.areaName = ''
                this.getAreaList()
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    },
    updateArea() {
      this.$refs['areaForm'].validate((valid) => {
        if (valid) {
          updateArea(this.account, this.areaInfo)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.getAreaInfoSearch()
                this.getAreaInfo()
                this.dialogVisible = false
                this.areaInfo.areaName = ''
                this.getAreaList()
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    },
    deleteAreaInfo(row) {
      deleteArea(this.account, row.areaId)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
          }
          this.getAreaInfoSearch()
          this.getAreaInfo()
          this.getAreaList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleIssued(row) {
      if (row) {
        row.status = '1'
      }
      if (this.device.length == 0) {
        this.$message({
          message: '无可下发人员！',
          type: 'warning',
        })
        return
      }
      console.log(row)
      let data = []
      if (row) {
        data = row ? [row] : []
      } else {
        const deviceId = { deviceId: this.query.deviceId }
        data.push(deviceId)
      }
      console.log(data)
      return issued(data).then((v) => {
        this.$message({
          type: v.code === 200 ? 'success' : 'error',
          message: v.code === 200 ? '下发成功' : '下发失败',
        })
        this.getDeviceError(row)
      })
    },
    getDeviceError(row) {
      this.query.deviceId = row.deviceId
      return request({
        method: 'post',
        url: '/device/info/search/not_issued_staff',
        data: this.query,
      }).then((v) => {
        console.log(v.data)
        this.device = v.data
        this.issuedVisible = true
        return v.data
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  line-height: 30px;
  margin-right: 38px;
}
.dashboard {
  &-container {
    margin: 30px;
    display: flex;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style lang="scss" scoped>
#twolines .app-container {
  display: grid;
  grid-template-columns: 13% 87%;
}
.tag {
  padding-right: 20px;
  .el-input {
    margin: 20px 0;
  }
  .tag-top {
    display: flex;
    justify-content: space-between;
  }
}

.area {
  width: 200px;
  padding: 0 20px;
}

.channelSpan {
  color: #2c71ab;
  // color: red
}

.channelSpan:hover {
  cursor: pointer;
}
.el-icon-close {
  color: #f56c6c;
}
.el-icon-check {
  color: #67c23a;
}
.el-icon-warning-outline {
  color: #e6a23c;
}
.el-icon-delete {
  color: #909399;
}
</style>
