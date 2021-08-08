<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getVisitRecordList"
        clearable
      />

      <el-select
        v-model="listQuery.tagIds"
        multiple
        collapse-tags
        filterable
        default-first-option
        placeholder="标签"
        @change="getVisitRecordList"
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
        collapse-tags
        filterable
        default-first-option
        placeholder="设备"
        @change="getVisitRecordList"
      >
        <el-option
          v-for="item in deviceList"
          :key="item.deviceId"
          :label="item.deviceName"
          :value="item.deviceId"
        />
      </el-select>

      <el-select
        v-model="listQuery.type"
        placeholder="通过"
        style="width: 120px"
        @change="getVisitRecordList"
      >
        <el-option
          v-for="item in skills"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="getVisitRecordList"
      />
      <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="getVisitRecordList"
            >搜索</el-button
          >
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        @click="handleDownload"
      >导出</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.name==null || row.name==''">--</span>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="faceId" label="登记照" align="center">
        <template slot-scope="{ row }">
          <img v-if="row.faceId != null" :src="feachImage(row.faceId)" width="60" height="60" />
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="sceneId" label="抓拍照" align="center">
        <template slot-scope="{ row }">
          <img
            :src="feachSceneImage(row.sceneId)"
            width="60"
            height="60"
            @click="big(row.sceneId,row.location)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="tagNames" label="标签" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.tagNames != null && row.tagNames != ''">
            <el-tag
              style="margin: 5px"
              v-for="tagName in getTagNames(row.tagNames)"
              :key="tagName"
            >{{ tagName }}</el-tag>
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="recordType" label="设备类型" align="center">
        <template slot-scope="{ row }">
          <span>{{row.recordType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deviceName" label="设备名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="比分" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.score.toFixed(1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="设备区域" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.location==null || row.location==''">--</span>
          <span v-else>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recordTime" label="通行时间" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.recordTime | time}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="passResult" label="通行结果" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.passResult }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="imgDialogVisible"
      width="930px"
      style="padding:0px 40px"
      title="场景图预览"
    >
      <el-col class="location">{{location}}</el-col>
      <div align="center">
        <img :src="bigImg" height="560" />
      </div>
    </el-dialog>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getVisitRecordList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { feachImage, feachSceneImage } from '@/api/util'
import { fetchAccessRecord } from '@/api/visitRecord'
import { getTagList } from '@/api/staff'
import { getDeviceList } from '@/api/device'
import { visitExport } from '@/api/export'
import { updatePage } from '@/utils/update-page'
import Cookies from 'js-cookie'

export default {
  name: 'Thoroug',
  computed: {
    ...mapGetters(['name'])
  },
  directives: { waves },
  components: { Pagination },
  created() {
    this.defaultDate()
    this.fetchTagList()
    this.fetchDeviceList()
    updatePage(this.getVisitRecordList)
    this.account = JSON.parse(Cookies.get('User')).account
  },
  data() {
    return {
      total: 0,
      downloadLoading: false,
      imgDialogVisible: false,
      bigImg: '',
      listQuery: {
        condition: '',
        deviceIds: [],
        tagIds: [],
        queryStartTime: '',
        queryFinishTime: '',
        type: '',
        recordType: 1,
        page: 1,
        limit: 10
      },
      skills: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 'PASS',
          label: '刷脸通过'
        },
        {
          value: 'NO_PASS',
          label: '未通过'
        },
        {
          value: 'CARD_PASS',
          label: '刷卡通过'
        }
      ],
      value1: '',
      time: '',
      tableData: [],
      tagList: [],
      deviceList: [],
      account: '',
      location: ''
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
    handleDownload() {
      visitExport(this.account, this.listQuery)
        .then(res => {
          if (res.code == 400) {
            this.$message.error('导出失败')
          } else {
            window.location.href = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    big(imgId, location) {
      this.imgDialogVisible = true
      this.location = location
      this.bigImg = this.feachSceneImage(imgId)
    },

    getVisitRecordList() {
      if (this.time != null) {
        this.listQuery.queryStartTime = Number(this.time[0])
        this.listQuery.queryFinishTime = Number(this.time[1])
      } else {
        this.listQuery.queryStartTime = ''
        this.listQuery.queryFinishTime = ''
      }
      return fetchAccessRecord(this.listQuery)
        .then(res => {
          res.data.list.forEach(res => {
            if (res.recordType == 1) {
              res.recordType = '门禁'
            } else {
              res.recordType = '闸机'
            }
            if (res.passResult == 'NO_PASS') {
              res.passResult = '未通过'
            } else if (res.passResult == 'PASS') {
              res.passResult = '刷脸通过'
            } else {
              res.passResult = '刷卡通过'
            }
          })
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchTagList() {
      getTagList()
        .then(res => {
          this.tagList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchDeviceList() {
      getDeviceList()
        .then(res => {
          res.data.forEach(item => {
            if (item.deviceType != 0) {
              this.deviceList.push(item)
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    defaultDate() {
      const date = new Date()
      const year = date.getFullYear().toString()
      const month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString()
      const da =
        date.getDate() < 10
          ? '0' + date.getDate().toString()
          : date.getDate().toString()
      const end =
        year +
        '-' +
        month +
        '-' +
        da +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds()
      const beg = year + '-' + month + '-01' + ' 00:00:00'
      console.log('当天:' + beg)
      this.time = [beg, end]
      this.getVisitRecordList()
    },
    feachImage(faceId) {
      return feachImage(faceId)
    },
    feachSceneImage(sceneId) {
      return feachSceneImage(sceneId)
    },
    getTagNames(tagName) {
      let tagNames = ''
      if (tagName == null || tagName == '') {
      } else {
        tagNames = tagName.split(',')
      }
      return tagNames
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
.location {
  font-size: 18px;
  font-weight: 600;
}
</style>
