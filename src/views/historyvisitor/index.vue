<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        style="width: 200px;"
        class="filter-item"
        prefix-icon="el-icon-search"
        @keyup.enter.native="handleFilter"
        clearable
      />

      <el-select v-model="regionId" placeholder="访问区域" style="width: 120px">
        <el-option
          v-for="item in regions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select v-model="registrationType" placeholder="登记方式" style="width: 120px" clearable>
        <el-option
          v-for="item in registerTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select v-model="trafficType" placeholder="通行方式" style="width: 120px" clearable>
        <el-option
          v-for="item in trafficTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select v-model="groupType" placeholder="个人" style="width: 120px" clearable>
        <el-option
          v-for="item in groups"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />

      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        @click="handleDownload"
      >导出</el-button>-->
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="uuid" label="ID" />
      <el-table-column prop="visitorName" label="姓名" />
      <el-table-column prop="visitorPhone" label="手机号" />
      <el-table-column prop="companyName" label="单位" />
      <el-table-column prop="staffAuthId" label="被访人" />
      <el-table-column prop="region" label="访问区域" />
      <el-table-column prop="visitBeginTime" label="访问开始" />
      <el-table-column prop="visitEndTime" label="访问结束" />
      <el-table-column prop="registrationType" label="登记方式">
        <template slot-scope="scope">
          <span v-if="scope.row.registrationType==0">wechat</span>
          <span v-else>ipad</span>
        </template>
      </el-table-column>
      <el-table-column label="通行方式">
        <template slot-scope="scope">
          <span v-if="scope.row.invitationType==2">二维码</span>
          <span v-else>人脸</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupType" label="团队/个人">
        <template slot-scope="scope">
          <span v-if="scope.row.groupType==0">个人</span>
          <span v-else>团队</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import {
  getInvitationSearch,
  getRegion,
  staffDetail,
  invitationExportRecord
} from '@/api/visitor'

export default {
  name: 'Historyvisitor',
  computed: {
    ...mapGetters(['name'])
  },
  directives: { waves },
  components: { Pagination },
  created() {
    this.getRegion()
    this.getList()
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      visitorType: 2,
      total: 0,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      regionId: null,
      regions: [],
      registrationType: null,
      registerTypes: [
        {
          value: 0,
          label: 'WeChat'
        },
        {
          value: 1,
          label: 'iPad'
        }
      ],
      trafficType: null,
      trafficTypes: [
        {
          value: 0,
          label: '人脸'
        },
        {
          value: 1,
          label: '二维码'
        }
      ],
      groupType: null,
      groups: [
        {
          value: 0,
          label: '个人'
        },
        {
          value: 1,
          label: '团队'
        }
      ],
      time: [new Date(), new Date()],
      tableData: []
    }
  },
  methods: {
    handleDownload() {
      var query = {
        regionId: this.regionId,
        queryKey: this.listQuery.title,
        page: this.listQuery.page,
        size: this.listQuery.limit,
        registrationType: this.registrationType,
        trafficType: this.trafficType,
        groupType: this.groupType,
        visitorType: this.visitorType,
        startTime: startTime,
        endTime: endTime
      }
      invitationExportRecord(query)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '解冻成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFilter() {
      var queryStartTime = this.time[0].format('yyyy-MM-dd')
      var queryFinishTime = this.time[1].format('yyyy-MM-dd')
      var startTime = queryStartTime + ' 00:00:00'
      var endTime = queryFinishTime + ' 23:59:59'
      var query = {
        regionId: this.regionId,
        queryKey: this.listQuery.title,
        page: this.listQuery.page,
        size: this.listQuery.limit,
        registrationType: this.registrationType,
        trafficType: this.trafficType,
        groupType: this.groupType,
        visitorType: this.visitorType,
        startTime: startTime,
        endTime: endTime
      }
      getInvitationSearch(query)
        .then(res => {
          this.tableData = res.data.list
          for (var i = 0; i < this.tableData.length; i++) {
            this.getInvitationRegion(i)
            this.getStaffAuthInfo(i)
          }
          this.total = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    getRegion() {
      getRegion()
        .then(res => {
          var list = res.data.list
          for (var i = 0; i < list.length; i++) {
            this.regions.push({ value: list[i].id, label: list[i].regionName })
          }
          this.regions.unshift({ value: null, label: '全部' })
        })
        .catch(err => {
          console.log(err)
        })
    },
    getList() {
      var query = {
        regionId: this.regionId,
        queryKey: this.listQuery.title,
        page: this.listQuery.page,
        size: this.listQuery.limit,
        registrationType: this.registrationType,
        trafficType: this.trafficType,
        groupType: this.groupType,
        visitorType: this.visitorType
      }
      getInvitationSearch(query)
        .then(res => {
          this.tableData = res.data.list
          for (var i = 0; i < this.tableData.length; i++) {
            this.getInvitationRegion(i)
            this.getStaffAuthInfo(i)
          }
          this.total = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    getInvitationRegion(i) {
      for (var j = 0; j < this.regions.length; j++) {
        if (this.tableData[i].region === this.regions[j].value) {
          this.tableData[i].region = this.regions[j].label
        }
      }
    },
    getStaffAuthInfo(i) {
      staffDetail(this.tableData[i].staffAuthId)
        .then(res => {
          if (res.code === 200) {
            this.tableData[i].staffAuthId = res.data.name
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
