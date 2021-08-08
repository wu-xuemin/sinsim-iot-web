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
      <el-table-column label="ID" type="index" width="50"></el-table-column>
      <el-table-column prop="address" label="头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.photoAddress" width="50px" height="50px" style="border-radius: 50%" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="staffPhone" label="手机号" align="center" />
      <el-table-column prop="createTime" label="授权时间" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.valid==1"
            type="danger"
            round
            @click="freezeStaff(scope.row)"
          >冻结</el-button>
          <el-button v-else type="success" round @click="thawStaff(scope.row)">解冻</el-button>
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
  getStaffAuthInfoSearch,
  freezeStaff,
  thawStaff,
  staffExportRecord
} from '@/api/visitor'

export default {
  name: 'Accreditstaff',
  computed: {
    ...mapGetters(['name'])
  },
  directives: { waves },
  components: { Pagination },
  created() {
    this.getList()
  },
  data() {
    return {
      total: 0,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      value1: '',
      time: null,
      tableData: []
    }
  },
  methods: {
    handleDownload() {
      var startTime = null
      var endTime = null
      if (this.time != null) {
        var queryStartTime = this.time[0].format('yyyy-MM-dd')
        var queryFinishTime = this.time[1].format('yyyy-MM-dd')
        startTime = queryStartTime + ' 00:00:00'
        endTime = queryFinishTime + ' 23:59:59'
      }
      var query = {
        queryKey: this.listQuery.title,
        page: this.listQuery.page,
        size: this.listQuery.limit,
        startTime: startTime,
        endTime: endTime
      }
      staffExportRecord(query)
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
    freezeStaff(data) {
      freezeStaff(data.id)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '冻结成功',
              type: 'success'
            })
            data.valid = 0
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    thawStaff(data) {
      thawStaff(data.id)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '解冻成功',
              type: 'success'
            })
            data.valid = 1
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFilter() {
      var startTime = null
      var endTime = null
      if (this.time != null) {
        var queryStartTime = this.time[0].format('yyyy-MM-dd')
        var queryFinishTime = this.time[1].format('yyyy-MM-dd')
        startTime = queryStartTime + ' 00:00:00'
        endTime = queryFinishTime + ' 23:59:59'
      }
      var query = {
        queryKey: this.listQuery.title,
        page: this.listQuery.page,
        size: this.listQuery.limit,
        startTime: startTime,
        endTime: endTime
      }
      getStaffAuthInfoSearch(query)
        .then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },

    getList() {
      this.handleFilter()
    }
  }
}
</script>

<style lang='scss' scoped>
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
