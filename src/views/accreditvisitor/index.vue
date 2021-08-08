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
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.photoAddress" width="50px" height="50px" style="border-radius: 50%;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="phone" label="手机号" align="center" />
      <el-table-column prop="createTime" label="授权时间" align="center" />
      <el-table-column prop="name" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.valid==1"
            type="danger"
            round
            @click="freezeVisitor(scope.row)"
          >冻结</el-button>
          <el-button v-else type="success" round @click="thawVisitor(scope.row)">解冻</el-button>
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
  getVisitorAuthInfoSearch,
  freezeVisitor,
  thawVisitor,
  visitorExportRecord
} from '@/api/visitor'

// eslint-disable-next-line no-extend-native
Date.prototype.format = function(format) {
  var o = {
    // month
    'M+': this.getMonth() + 1,
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return format
}

export default {
  name: 'Accreditvisitor',
  computed: {
    ...mapGetters(['name'])
  },
  // eslint-disable-next-line vue/order-in-components
  directives: { waves },
  // eslint-disable-next-line vue/order-in-components
  components: { Pagination },
  created() {
    this.getList()
  },
  // eslint-disable-next-line vue/order-in-components
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
      time: [new Date(), new Date()],
      tableData: []
    }
  },
  methods: {
    freezeVisitor(data) {
      freezeVisitor(data.id)
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
    thawVisitor(data) {
      thawVisitor(data.id)
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
      getVisitorAuthInfoSearch(query)
        .then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
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
      visitorExportRecord(query)
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

    getList() {
      this.handleFilter()
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
