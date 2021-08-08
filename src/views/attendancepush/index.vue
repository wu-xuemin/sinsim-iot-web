<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition"
        style="width: 170px"
        class="filter-item"
        placeholder="姓名"
        @keyup.enter.native="handleFilter"
        prefix-icon="el-icon-search"
        clearable
      />
      <el-input
        v-model="listQuery.staffNum"
        style="width: 170px"
        class="filter-item"
        placeholder="工号"
        @keyup.enter.native="handleFilter"
        prefix-icon="el-icon-search"
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
      <el-select
        v-model="section"
        placeholder="单位"
        style="width: 220px"
        @change="selectSection"
        clearable
        multiple
        filterable
      >
        <el-option
          v-for="item in skills"
          :key="item.tagId"
          :label="item.tagName"
          :value="item.tagId"
        ></el-option>
      </el-select>

      <!-- <el-select
        v-model="equip"
        placeholder="设备"
        style="width: 120px"
        @change="equipSection"
        clearable
      >
        <el-option
          v-for="item in equipList"
          :key="item.deviceId"
          :label="item.deviceName"
          :value="item.deviceId"
        ></el-option>
      </el-select> -->

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

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleFilter"
        >搜索</el-button
      >
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        @click="getExcel"
        >导出考勤统计</el-button
      >
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        @click="getDetailExcel"
        >导出考勤详情</el-button
      >
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
      <el-table-column prop="staffName" label="姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.staffName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="staffNumber" label="工号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.staffNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="园区" prop="parkId" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.staffParkName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单位" prop="id" align="center" width="280">
        <template slot-scope="{ row }">
          <el-tooltip placement="top">
            <div slot="content">
              <el-tag style="margin: 5px">{{ row.staffTagName }}</el-tag>
            </div>
            <el-tag style="margin: 5px">{{ row.staffTagName }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="正常天数" prop="normal" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.normal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常天数" prop="abnormal" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.abnormal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平均时长" prop="averageTime" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.averageTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作时长" prop="countTime" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.countTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="在职状态" prop="valid" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.valid">在职</span>
          <span v-else-if="!row.valid">离职</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column
        label="查看"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <i
            class="el-icon-view"
            style="margin-right: 20px; cursor: pointer"
            @click="handleView(row)"
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
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :before-close="handleChannelClose"
    >
      <el-row>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          @click="getStaffDetailExcel"
          >导出个人考勤详情</el-button
        >
      </el-row>
      <el-table :data="temp" style="width: 100%">
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
        :total="viewTotal"
        :page.sync="viewQuery.page"
        :limit.sync="viewQuery.limit"
        @pagination="getDetail"
      />
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCloseChannelDialog">确定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { getParkSearch } from '@/api/park'
import {
  getAttendanceSearch,
  getAttendanceExport,
  setAttendancePush,
  getAttendanceCount,
  getAttendanceCountExport,
  getAttendanceDetail,
  getAttendanceDetailExcel,
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
    // this.getTagList()
    this.getParkList()
    this.park = this.listQuery.parkId
    this.parkSection()
    this.getList()
  },
  data() {
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
      pushTime: '',
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
      temp: [],
      viewQuery: {},
      dialogTitle: '',
      viewTotal: 0,
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
    handleChannelClose(done) {
      done()
      this.handleCloseChannelDialog()
    },
    handleCloseChannelDialog() {
      this.dialogFormVisible = false
      this.dialogTitle = ''
      this.viewQuery = {}
      this.temp = []
      this.viewTotal = 0
    },
    dateFormat(fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
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
      return getAttendanceCount(this.listQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
        })
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
      return getAttendanceCount(this.listQuery)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.list
            this.total = res.data.total
            return res
          } else if (res.code == 400) {
            this.tableData = []
            this.total = 0
            return res
          }
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
      return getAttendanceCountExport(excelData)
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
    getStaffDetailExcel() {
      let excelData = {
        condition: '',
        signTime: this.time[0] ? this.time[0] : '',
        signOutTime: this.time[1] ? this.time[1] : '',
        tagIds: [],
        parkId: '',
        staffNum: this.viewQuery.staffNum,
        page: 0,
        limit: 0,
      }
      return getAttendanceDetailExcel(excelData)
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
    getDetailExcel() {
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
      return getAttendanceDetailExcel(excelData)
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
    handleView(row) {
      this.dialogFormVisible = true
      this.dialogTitle = row.staffName + ' 考勤详情'
      this.viewQuery = {
        condition: '',
        signTime: this.time[0],
        signOutTime: this.time[1],
        parkId: '',
        staffNum: row.staffNumber,
        tagIds: [],
        page: 1,
        limit: 10,
      }
      this.getDetail()
    },
    getDetail() {
      getAttendanceDetail(this.viewQuery)
        .then((res) => {
          this.temp = res.data.list
          this.viewTotal = res.data.total
          // this.getTagList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    selectPTime() {
      // console.log(this.pushTime)
      if (this.pushTime && this.pushTime.length > 0) {
        this.pShow = false
      }
    },
    manualPush() {
      if (this.pushTime && this.pushTime.length > 0) {
        this.butLoading = true
        let data = {
          signTime: this.pushTime[0],
          signOutime: this.pushTime[1],
        }
        return setAttendancePush(data)
          .then((res) => {
            this.pShow = false
            this.butLoading = false
            if (res.code == 200) {
              this.$message({
                message: '补推成功',
                type: 'success',
              })
              this.dialogFormVisible = false
            } else {
              this.$message({
                message: '补推失败',
                type: 'error',
              })
            }
            return res
          })
          .catch((err) => {
            this.pShow = false
            console.log(err)
          })
      } else {
        this.pShow = true
      }
      // return setAttendancePush()
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
.abnormal {
  color: red;
  // width: 100%;
  // height: 100%;
  font-weight: bold;
}
</style>
