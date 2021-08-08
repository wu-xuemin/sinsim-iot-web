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

      <el-select v-model="invitationStatus" placeholder="审核状态" style="width: 120px" clearable>
        <el-option
          v-for="item in invitationStatusList"
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

      <el-select v-model="registrationType" placeholder="登记方式" style="width: 120px" clearable>
        <el-option
          v-for="item in registerTypes"
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
      <el-table-column prop="visitorName" label="姓名" align="center" />
      <el-table-column prop="visitorPhone" label="手机号" align="center" />
      <el-table-column prop="visitorCompany" label="单位" align="center" />
      <el-table-column prop="staffAuthId" label="被访人" align="center" />
      <el-table-column prop="region" label="访问区域" align="center" />
      <el-table-column prop="visitBeginTime" label="预约开始" align="center" />
      <el-table-column prop="visitEndTime" label="预约结束" align="center" />
      <el-table-column prop="region" label="审核状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">待员工审核</span>
          <span v-else-if="scope.row.status==1">待上级审核</span>
          <span v-else-if="scope.row.status==2">带区域及管理员审核</span>
          <span v-else-if="scope.row.status==3">待实名约访</span>
          <span v-else>待访客来访</span>
        </template>
      </el-table-column>
      <el-table-column prop="registrationType" label="登记方式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.registrationType==0">wechat</span>
          <span v-else>ipad</span>
        </template>
      </el-table-column>
      <el-table-column label="通行方式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.invitationType==2">二维码</span>
          <span v-else>人脸</span>
        </template>
      </el-table-column>
      <el-table-column prop="groupType" label="团队/个人" align="center">
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
  name: 'Ordervisitor',
  computed: {
    ...mapGetters(['name'])
  },
  directives: { waves },
  components: { Pagination },
  created() {
    this.getRegion()
    this.getList()
  },
  data() {
    return {
      visitorType: 1,
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
      invitationStatus: null,
      invitationStatusList: [
        {
          value: 0,
          label: '员工审核'
        },
        {
          value: 1,
          label: '上级审核'
        },
        {
          value: 2,
          label: '区域及管理员审核'
        },
        {
          value: 3,
          label: '未实名约访'
        },
        {
          value: 4,
          label: '待访客来访'
        }
      ],
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
      time: '',
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
        invitationStatus: this.invitationStatus,
        visitorType: 1
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
      var query = {
        regionId: this.regionId,
        queryKey: this.listQuery.title,
        page: this.listQuery.page,
        size: this.listQuery.limit,
        registrationType: this.registrationType,
        trafficType: this.trafficType,
        groupType: this.groupType,
        invitationStatus: this.invitationStatus,
        visitorType: 1
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
    getList() {
      this.handleFilter()
    },
    getInvitationRegion(i) {
      for (var j = 0; j < this.regions.length; j++) {
        if (this.tableData[i].region === this.regions[j].value) {
          this.tableData[i].region = this.regions[j].label
        }
      }
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
