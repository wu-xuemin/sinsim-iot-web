<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        style="width: 390px"
        v-model="time"
        type="datetimerange"
        range-separator="至"
        format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="selectTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        :clearable="false"
      ></el-date-picker>
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
      <!-- 
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleFilter"
        >搜索</el-button
      > -->

      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        @click="getExcel"
        >导出</el-button
      >
      <!-- <el-button
        v-if="role == 1"
        class="filter-item"
        style="margin-left: 10px; float: right"
        type="primary"
        @click="handleConfigList"
        >配置考勤时间</el-button
      > -->
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        style="float: right"
        @click="handlePush"
        >手动补推</el-button
      > -->
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="园区" prop="parkId" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.staffParkName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="day" align="center">
      </el-table-column>
      <el-table-column label="总人数" prop="totalStaff" align="center">
      </el-table-column>
      <el-table-column label="打卡人数" prop="normal" align="center">
      </el-table-column>
      <el-table-column label="平均时长" prop="averageTime" align="center">
      </el-table-column>
      <el-table-column label="总时长" prop="countTime" align="center">
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog title="考勤时间段" :visible.sync="dialogRuleVisible">
      <el-row>
        <el-button
          v-if="!configTemp.length"
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          @click="handleAddConfig"
          >新增规则</el-button
        >
      </el-row>
      <el-table :data="configTemp" style="width: 100%">
        <el-table-column property="name" label="规则名称" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column property="startTime" label="上班时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column property="endTime" label="下班时间" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row, $index }">
            <i
              class="el-icon-edit"
              style="margin-right: 20px; cursor: pointer"
              @click="handleUpdateConfig(row)"
            ></i>
            <!-- <i
              class="el-icon-delete"
              style="cursor: pointer"
              @click="handleDeleteConfig(row, $index)"
            ></i> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="pushTime" :rules="rules" ref="pushTime">
        <el-form-item label="规则名称：" prop="name" class="is-required">
          <el-input style="width: 220px" v-model="pushTime.name" clearable />
        </el-form-item>
        <el-form-item label="上班时间：" prop="startTime" class="is-required">
          <el-time-picker
            v-model="pushTime.startTime"
            format="HH:mm:ss"
            placeholder="上班时间"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下班时间：" prop="endTime" class="is-required">
          <el-time-picker v-model="pushTime.endTime" placeholder="下班时间">
          </el-time-picker>
          <!-- <p class="el-form-item__error">请上传访客照片或填写访客卡号</p> -->
        </el-form-item>
        <el-button
          type="primary"
          @click="manualPush('pushTime')"
          :loading="butLoading"
          >配置</el-button
        >
      </el-form>
      <!-- <el-table :data="configTemp" style="width: 100%">
        <el-table-column label="员工姓名" prop="deviceId" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="deviceId" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.day }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上班时间" prop="deviceId" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.signTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下班时间" prop="deviceId" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.signOutTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考勤状态" prop="status" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.status == 'normal'" class="normal">
              <span>正常</span>
            </div>
            <div v-else class="abnormal">
              <span>异常</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="configTotal"
        :page.sync="configQuery.page"
        :limit.sync="configQuery.limit"
        @pagination="getConfigList"
      /> -->
    </el-dialog>

    <el-dialog title="提示" :visible.sync="deleteConfirmVisible" width="400px">
      <span>
        确认要删除 [<b>{{ this.pushTime.name }}</b
        >] 吗？
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false" icon="el-icon-close"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="deleteData"
          icon="el-icon-check"
          :loading="butLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { getParkSearch } from '@/api/park'
import {
  getAttendanceSearch,
  getAttendanceExport,
  getParkAttendanceExport,
  setAttendancePush,
  getAttendanceCount,
  getAttendanceConfigList,
  addAttendanceConfigList,
  updateAttendanceConfigList,
  deleteAttendanceConfigList,
  getParkAttendanceSearch,
} from '@/api/attendanceRecord'
import { getTagNameByTagId } from '@/api/util'
import { getDeviceList } from '@/api/device'
import { updatePage } from '@/utils/update-page'
import {
  getTagSearch,
  getTagList,
  addTag,
  updateTag,
  deleteTag,
  checkTagName,
  getParkTagSearch,
} from '@/api/staff'

export default {
  name: 'Attendance',
  computed: {
    ...mapGetters(['name']),
    role() {
      return JSON.parse(Cookies.get('User')).role
    },
  },
  directives: { waves },
  components: { Pagination },
  created() {
    let Mdate = new Date()
    Mdate.setDate(1)
    Mdate.setHours(0)
    Mdate.setSeconds(0)
    Mdate.setMinutes(0)
    this.time = [
      this.dateFormat('YYYY-mm-dd HH:MM:SS', Mdate),
      this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date()),
    ]
    //获取表格数据
    // updatePage(this.getList, true)
    //获取部门数据
    this.getSection()
    //获取设备列表
    // this.getEquipment()
    this.getTagList()
    this.getParkList()
    this.park = this.listQuery.parkId
    this.parkSection()
  },
  data() {
    const validateStart = (rule, value, callback) => {
      if (this.pushTime.endTime) {
        this.$refs.pushTime.validateField('endTime')
      }
      callback()
    }
    const validateEnd = (rule, value, callback) => {
      if (this.pushTime.startTime) {
        if (
          this.pushTime.startTime.getHours() * 3600 +
            this.pushTime.startTime.getMinutes() * 60 +
            this.pushTime.startTime.getSeconds() <
          value.getHours() * 3600 + value.getMinutes() * 60 + value.getSeconds()
        ) {
          callback()
        } else {
          console.log(22)
          console.log(this.pushTime.startTime)
          console.log(value)
          callback(new Error('下班时间不得早于上班时间'))
        }
      } else {
        callback()
      }
    }
    return {
      tagQuery: {
        condition: '',
        tagType: '',
        page: 0,
        limit: 0,
      },
      tagList: [],
      total: 0,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        parkId: localStorage.getItem('parkId'),
        tagIds: [],
        signOutTime: '',
        signTime: '',
        condition: '',
        staffNum: '',
      },
      dialogStaffName: '手动补推',
      dialogFormVisible: false,
      skills: [],
      equip: '',
      equipList: [],
      section: '',
      time: [],
      tableData: [],
      pushTime: {
        name: '',
        startTime: '',
        endTime: '',
      },
      pShow: false,
      butLoading: false,
      parkList: [],
      parkQuery: {
        tagIds: null,
        name: null,
        page: 0,
        size: 0,
      },
      selectP: localStorage.getItem('parkId').length > 0,
      park: '',
      dialogTitle: '',
      configQuery: {
        name: '',
        startTime: '',
        endTime: '',
      },
      configTemp: [],
      configTotal: '',
      dialogRuleVisible: false,
      deleteConfirmVisible: false,
      configStatus: '',
      rules: {
        name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        startTime: [
          { required: true, message: '请输入上班时间', trigger: 'change' },
          { validator: validateStart, trigger: 'blur' },
        ],
        endTime: [
          { required: true, message: '请输入下班时间', trigger: 'change' },
          { validator: validateEnd, trigger: 'blur' },
        ],
      },
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
    handleDeleteConfig(row) {
      this.deleteConfirmVisible = true
      this.pushTime = row
    },
    handleUpdateConfig(row) {
      this.pushTime.id = row.id
      this.pushTime.name = row.name
      this.pushTime.startTime = new Date(
        this.timeToSec(row.startTime) * 1000 - 28800000
      )
      this.pushTime.endTime = new Date(
        this.timeToSec(row.endTime) * 1000 - 28800000
      )
      this.dialogFormVisible = true
      this.dialogTitle = '考勤时间修改'
      this.configStatus = 'update'
    },
    handleConfigList() {
      this.dialogRuleVisible = true
      this.configQuery = {
        page: 1,
        limit: 10,
      }
      this.getConfigList()
    },
    handleAddConfig(row) {
      this.pushTime = {}
      this.dialogFormVisible = true
      this.dialogTitle = '考勤时间配置'
      this.configStatus = 'add'
    },
    getConfigList() {
      getAttendanceConfigList(this.configQuery)
        .then((res) => {
          console.log(res)
          this.configTemp = res.data.list
          this.configTotal = res.data.total
          // this.getTagList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteData() {
      this.butLoading = true
      deleteAttendanceConfigList(this.pushTime.id)
        .then((res) => {
          if (res.code == 200) {
            this.deleteConfirmVisible = false
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.butLoading = false
            this.pushTime = {}
            this.getConfigList()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
            })
            this.deleteConfirmVisible = false
            this.butLoading = false
            this.getConfigList()
          }
        })
        .catch((err) => {
          this.butLoading = false
          console.log(err)
        })
    },
    manualPush(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.configStatus == 'add') {
            let addQuery = {
              name: this.pushTime.name,
              startTime: this.dateFormat('HH:MM:SS', this.pushTime.startTime),
              endTime: this.dateFormat('HH:MM:SS', this.pushTime.endTime),
            }
            return addAttendanceConfigList(addQuery)
              .then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '新增成功',
                    type: 'success',
                  })
                } else {
                  this.$message({
                    message: '新增失败',
                    type: 'error',
                  })
                }
                this.dialogFormVisible = false
                this.getConfigList()
              })
              .catch((err) => {
                console.log(err)
              })
          }
          if (this.configStatus == 'update') {
            let updateQuery = {
              id: this.pushTime.id,
              name: this.pushTime.name,
              startTime: this.dateFormat('HH:MM:SS', this.pushTime.startTime),
              endTime: this.dateFormat('HH:MM:SS', this.pushTime.endTime),
            }
            return updateAttendanceConfigList(updateQuery)
              .then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '更新成功',
                    type: 'success',
                  })
                } else {
                  this.$message({
                    message: '更新失败',
                    type: 'error',
                  })
                }
                this.dialogFormVisible = false
                this.getConfigList()
              })
              .catch((err) => {
                console.log(err)
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // console.log(this.pushTime)
      // let ptime = [
      //   this.dateFormat('HH:MM:SS', this.pushTime.signTime),
      //   this.dateFormat('HH:MM:SS', this.pushTime.signOutTime),
      // ]
      // console.log(ptime)
      // if (this.pushTime && this.pushTime.length > 0) {
      //   this.butLoading = true
      //   let data = {
      //     signTime: this.pushTime[0],
      //     signOutime: this.pushTime[1],
      //   }
      //   return setAttendancePush(data)
      //     .then((res) => {
      //       this.pShow = false
      //       this.butLoading = false
      //       if (res.code == 200) {
      //         this.$message({
      //           message: '补推成功',
      //           type: 'success',
      //         })
      //         this.dialogFormVisible = false
      //       } else {
      //         this.$message({
      //           message: '补推失败',
      //           type: 'error',
      //         })
      //       }
      //       return res
      //     })
      //     .catch((err) => {
      //       this.pShow = false
      //       console.log(err)
      //     })
      // } else {
      //   this.pShow = true
      // }
      // return setAttendancePush()
    },
    timeToSec(time) {
      if (time !== null) {
        var s = ''
        var hour = time.split(':')[0]
        var min = time.split(':')[1]
        var sec = time.split(':')[2]
        s = Number(hour * 3600) + Number(min * 60) + Number(sec)
        return s
      }
    },
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear() ? date.getFullYear().toString() : '', // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          )
        }
      }
      return fmt
    },
    //选择部门
    selectSection() {
      this.listQuery.tagIds = this.section
      console.log(this.section)
      this.getList()
    },

    //选择设备
    equipSection() {
      this.listQuery.deviceName = this.equip
      this.getList()
    },

    parkSection() {
      this.listQuery.parkId = this.park
      if (this.park == '') {
        this.getSection()
      } else {
        getParkTagSearch({ parkId: this.park, page: 0, size: 0 })
          .then((res) => {
            this.skills = res.data.list
          })
          .catch((err) => {
            console.log(err)
          })
      }
      this.section = ''
      this.listQuery.tagIds = []
      this.getList()
    },

    //选择时间
    selectTime() {
      if (!this.time) {
        let Mdate = new Date()
        Mdate.setDate(1)
        Mdate.setHours(0)
        Mdate.setSeconds(0)
        Mdate.setMinutes(0)
        this.time = [
          this.dateFormat('YYYY-mm-dd HH:MM:SS', Mdate),
          this.dateFormat('YYYY-mm-dd HH:MM:SS', new Date()),
        ]
      }
      this.listQuery.signTime = this.time[0]
      this.listQuery.signOutTime = this.time[1]
      // console.log(this.time)
      this.getList()
    },
    //搜索框
    handleFilter() {
      this.getList()
    },
    handleDownload() {
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          'name',
          'staffId',
          'tagName',
          'firstDevice',
          'lastDevice',
          'firstTime',
          'lastTime',
        ]
        const filterVal = [
          'name',
          'staffId',
          'tagName',
          'firstDevice',
          'lastDevice',
          'firstTime',
          'lastTime',
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '考勤列表',
        })
      })
    },
    formatJson(filterVal) {
      return this.tableData.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getTagList() {
      // getTagSearch(this.tagListQuery)
      getTagSearch(this.tagQuery)
        .then((res) => {
          this.tagList = res.data.list
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //获取表格数据
    getList() {
      this.listQuery.signTime = this.time[0]
      this.listQuery.signOutTime = this.time[1]
      // console.log(this.listQuery)
      return getParkAttendanceSearch(this.listQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //导出excel
    getExcel() {
      let excelData = {
        condition: this.listQuery.condition,
        signTime: this.time[0] ? this.time[0] : '',
        signOutTime: this.time[1] ? this.time[1] : '',
        tagIds: this.listQuery.tagIds,
        parkId: this.listQuery.parkId,
        staffNum: this.listQuery.staffNum,
        page: 0,
        limit: 0,
      }
      return getParkAttendanceExport(excelData)
        .then((res) => {
          if (res.code == 400) {
            this.$message.error('导出失败')
          } else {
            window.open(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //获取部门数据
    getSection() {
      getTagList()
        .then((res) => {
          this.skills = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //根据标签id查询标签名称
    getTagNameByTagId(tagId) {
      const tagIds = tagId.split(',')
      return getTagNameByTagId(tagIds, this.tagList)
    },
    //获取设备列表
    getEquipment() {
      getDeviceList()
        .then((res) => {
          this.equipList = res.data
        })
        .catch((err) => {
          console.log(err)
        })
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
    handlePush() {
      this.dialogFormVisible = true
    },
    // selectTime() {
    //   // console.log(this.pushTime)
    //   if (this.pushTime && this.pushTime.length > 0) {
    //     this.pShow = false
    //   }
    // },
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
</style>
