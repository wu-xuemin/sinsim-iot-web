<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition"
                style="width: 170px"
                class="filter-item"
                placeholder="姓名"
                @keyup.enter.native="handleFilter"
                prefix-icon="el-icon-search"
                clearable />
      <el-input v-model="listQuery.staffNum"
                style="width: 170px"
                class="filter-item"
                placeholder="工号"
                @keyup.enter.native="handleFilter"
                prefix-icon="el-icon-search"
                clearable />
      <el-select v-model="park"
                 placeholder="园区"
                 style="width: 170px"
                 @change="parkSection"
                 :disabled="selectP"
                 clearable
                 filterable>
        <el-option v-for="item in parkList"
                   :key="item.parkId"
                   :label="item.parkName"
                   :value="item.parkId"></el-option>
      </el-select>
      <el-select v-model="section"
                 placeholder="单位"
                 style="width: 220px"
                 @change="selectSection"
                 clearable
                 filterable
                 multiple>
        <el-option v-for="item in skills"
                   :key="item.tagId"
                   :label="item.tagName"
                   :value="item.tagId"></el-option>
      </el-select>

      <el-date-picker style="width: 390px"
                      v-model="time"
                      type="datetimerange"
                      range-separator="至"
                      format="yyyy-MM-dd HH:mm:ss"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      @change="selectTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :clearable="false"></el-date-picker>

      <el-button class="filter-item"
                 style="margin-left: 10px"
                 type="primary"
                 @click="handleFilter">搜索</el-button>

      <el-button v-waves
                 :loading="downloadLoading"
                 class="filter-item"
                 type="primary"
                 @click="getExcel">导出</el-button>
    </div>

    <el-table :data="tableData"
              style="width: 100%">
      <el-table-column prop="staffName"
                       label="姓名"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.staffName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="staffNum"
                       label="员工号"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.staffNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="园区"
                       prop="staffParkName"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.staffParkName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单位"
                       prop="staffTagName"
                       align="center"
                       width="280">
        <template slot-scope="{ row }">
          <el-tooltip placement="top">
            <div slot="content">
              <el-tag style="margin: 5px">{{ row.staffTagName }}</el-tag>
            </div>
            <el-tag style="margin: 5px">{{ row.staffTagName }}</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column prop="signTime"
                       label="上班时间"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.signTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="signOutTime"
                       label="下班时间"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.signOutTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status"
                       label="状态"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ ReservationStatus[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark"
                       label="说明"
                       align="center">
        <template slot-scope="{ row }">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       width="230"
                       class-name="small-padding fixed-width">
        <template v-if="row.status == 'WAIT_CONFIRM'"
                  slot-scope="{ row }">
          <el-button class="filter-item"
                     style="margin-left: 10px"
                     type="primary"
                     @click="confirmRecord(row)">通过</el-button>
          <el-button class="filter-item"
                     style="margin-left: 10px"
                     type="primary"
                     @click="handleRefuse(row)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList" />

    <el-dialog title="拒绝原因"
               :visible.sync="dialogFormVisible"
               :before-close="handleClose">
      <el-form ref="dataForm"
               :model="reissueDTO"
               label-position="right"
               label-width="100px"
               style="width: 400px; margin-left: 50px">

        <el-form-item label="原因:"
                      prop="remark">
          <el-input v-model="reissueDTO.remark" />
        </el-form-item>
      </el-form>
      <el-alert v-if="isError"
                style="margin-top: 20px; padding: 5px"
                :title="errMsg"
                type="error"
                :closable="false"
                show-icon></el-alert>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary"
                   @click="refusedRecord()">确认</el-button>
      </div>
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
  getReissueRecord,
  confirmReissueRecord,
  ReservationStatus,
  exportReissueRecord,
} from '@/api/attendanceReissue'
import { getTagNameByTagId } from '@/api/util'
import { getDeviceList } from '@/api/device'
import { updatePage } from '@/utils/update-page'
import { getTagSearch, getTagList, getParkTagSearch } from '@/api/staff'

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
    updatePage(this.getList, true)
    //获取部门数据
    this.getSection()

    this.getParkList()
    this.park = this.listQuery.parkId
    this.parkSection()
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
      dialogFormVisible: false,
      isError: false,
      ReservationStatus: ReservationStatus,
      errMsg: '',
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
      skills: [],
      equip: '',
      equipList: [],
      section: '',
      time: [],
      tableData: [],
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
      configQuery: {
        name: '',
        startTime: '',
        endTime: '',
      },
      reissueDTO: {
        recordId: '',
        status: '',
        remark: '',
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.reissueDTO.remark = ''
          done()
        })
        .catch((_) => {})
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
      if (this.time != null || this.time != '') {
        this.listQuery.signTime = this.time[0]
        this.listQuery.signOutTime = this.time[1]
      }

      // console.log(this.listQuery)
      return getReissueRecord(this.listQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
        })
    },

    confirmRecord(data) {
      this.reissueDTO.recordId = data.id
      this.reissueDTO.status = 'CONFIRM'
      confirmReissueRecord(this.reissueDTO)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '确认通过',
              type: 'success',
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error',
            })
          }
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    handleRefuse(row) {
      this.reissueDTO.recordId = row.id
      this.reissueDTO.status = 'REFUSE'
      this.dialogFormVisible = true
      this.reissueDTO.remark = ''
    },

    refusedRecord() {
      confirmReissueRecord(this.reissueDTO)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '已拒绝',
              type: 'success',
            })
            this.dialogFormVisible = false
          } else {
            this.$message({
              message: res.message,
              type: 'error',
            })
            this.dialogFormVisible = false
          }
          this.getList()
        })
        .catch((err) => {
          console.log(err)
          this.dialogFormVisible = false
        })
    },

    getExcel() {
      if (this.time != null || this.time != '') {
        this.listQuery.signTime = this.time[0]
        this.listQuery.signOutTime = this.time[1]
      }
      return exportReissueRecord(this.listQuery)
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
