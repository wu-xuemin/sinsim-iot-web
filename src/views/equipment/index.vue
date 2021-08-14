<template>
  <div class="app-container">

    <div>
      <div class="filter-container">
        <el-input
          v-model="listQuery.nameplate"
          style="width: 300px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
          prefix-icon="el-icon-search"
          placeholder="输入铭牌号"
          clearable
        />
        <el-input
                v-model="listQuery.machineModelInfo"
                style="width: 300px"
                class="filter-item"
                @keyup.enter.native="handleFilter"
                prefix-icon="el-icon-search"
                placeholder="输入型号"
                clearable
        />
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          @click="handleFilter"
          >搜索</el-button
        >
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="铭牌号" prop="device_id" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.nameplate }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="型号"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.machineModelInfo }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="已开机时间"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.uptime }}</span>
          </template>
        </el-table-column>

        <el-table-column
                label="刺绣时间"
                align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.workingTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
                label="停机时间"
                align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.nonworkingTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
                label="断线次数"
                align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.lineBrokenNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column
                label="平均断线时间"
                align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.lineBrokenAverageTime }}</span>
          </template>
        </el-table-column>

        <el-table-column
                label="工件总数"
                align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.productTotalNumber }}</span>
          </template>
        </el-table-column>

        <el-table-column
                label="开机次数"
                align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.powerOnTimes }}</span>
          </template>
        </el-table-column>

        <el-table-column
                label="累计针数"
                align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.needleTotalNumber }}</span>
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
        getDeviceSearch,
        selectIotMachine
} from '@/api/device'

import {
  getAreaSearch,
  addArea,
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

    return {
      total: 0,
      value: [],
      listQuery: {
        nameplate: '',
        machineModelInfo: '',
        page: 1,
        limit: 10,
      },
      tableData: [],
      account: '',
    }
  },

  created() {
    // 自动更新 //不需要
//    updatePage(this.getDeviceSearch, true)
    this.getDeviceSearch()
    this.account = JSON.parse(Cookies.get('User')).account
  },
  methods: {

    handleFilter() {
      this.getDeviceSearch()
    },



    getDeviceSearch() {
//        return selectIotMachine(this.listQuery.nameplate, this.listQuery.machineModelInfo)
        return selectIotMachine(this.listQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
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
