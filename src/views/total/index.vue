<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition"
        style="width: 200px;"
        placeholder="姓名"
        class="filter-item"
        @keyup.enter.native="getVisitRecordList"
        prefix-icon="el-icon-search"
        clearable
      />

      <el-select
        v-model="listQuery.tagIds"
        multiple
        filterable
        collapse-tags
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
        filterable
        collapse-tags
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
        collapse-tags
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
            v-if="row.recordType==0"
            @click="bigSecenImage(row)"
          />

          <img
            :src="feachSceneImage(row.sceneId)"
            width="60"
            height="60"
            v-else
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
          <span v-if="row.recordType == 0">智能盒子</span>
          <span v-if="row.recordType == 1">门禁</span>
          <span v-if="row.recordType == 2">闸机</span>
        </template>
      </el-table-column>
      <el-table-column prop="deviceName" label="设备名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="比分" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.score!=null">{{ row.score.toFixed(1) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="设备位置" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recordTime" label="通行时间" width="200" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.recordTime | time }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="imgDialogVisible"
      width="930px"
      style="padding:0px 40px"
      title="场景图预览"
    >
      <el-row>
        <el-col class="location">{{location}}</el-col>
        <div align="center" v-if="visitType">
          <img :src="faceImg" width="272" height="300" />
          <img :src="bigImg" width="612" height="300" />
        </div>
        <div align="center" v-else>
          <img :src="bigImg" height="500" />
        </div>
      </el-row>
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
import { feachImage, feachSceneImage, feachFaceImage } from '@/api/util'
import { fetchVisitRecordList } from '@/api/visitRecord'
import { getTagList } from '@/api/staff'
import { getDeviceList } from '@/api/device'
import { recordExport } from '@/api/export'
import { updatePage } from '@/utils/update-page'
import Cookies from 'js-cookie'

export default {
  name: 'Total',
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
      faceImg: '',
      visitType: false,
      listQuery: {
        condition: '',
        deviceIds: [],
        tagIds: [],
        queryStartTime: '',
        queryFinishTime: '',
        type: '',
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
    //导出
    handleDownload() {
      this.downloadLoading = true
      recordExport(this.account, this.listQuery)
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
        .finally(e => {
          this.downloadLoading = false
        })
    },
    //图片放大
    bigSecenImage(item) {
      this.imgDialogVisible = true
      this.location = item.location
      this.visitType = true
      this.faceImg = ''
      this.bigImg = ''
      this.faceImg = feachSceneImage(item.sceneId)
      this.bigImg = feachFaceImage(item.sceneImageId)
    },
    big(imgId, location) {
      this.imgDialogVisible = true
      this.location = location
      this.visitType = false
      this.bigImg = feachSceneImage(imgId)
    },

    //获取全量通行记录
    getVisitRecordList() {
      if (this.time != null) {
        this.listQuery.queryStartTime = Number(this.time[0])
        this.listQuery.queryFinishTime = Number(this.time[1])
      } else {
        this.listQuery.queryStartTime = ''
        this.listQuery.queryFinishTime = ''
      }
      return fetchVisitRecordList(this.listQuery)
        .then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch(err => {
          console.log(err)
        })
    },
    //标签列表
    fetchTagList() {
      getTagList()
        .then(res => {
          this.tagList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    //设备列表
    fetchDeviceList() {
      getDeviceList()
        .then(res => {
          this.deviceList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    //默认时间
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
    //显示比中的员工图片
    feachImage(faceId) {
      return feachImage(faceId)
    },
    //显示抓拍照
    feachSceneImage(sceneId) {
      return feachSceneImage(sceneId)
    },
    //获取标签名称
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
  font-weight: 700;
}
</style>
