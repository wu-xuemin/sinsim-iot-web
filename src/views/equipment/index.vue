<template>
  <div class="app-container">

    <div>
      <div class="filter-container">
        <el-row>


          <!--<el-form :  label-position="right" label-width="80px">-->
            <!--<el-row>-->
              <el-col :span="6">
                  <el-input
                          v-model="listQuery.nameplate"
                          style="width: 300px"
                          class="filter-item"
                          @keyup.enter.native="handleFilter"
                          prefix-icon="el-icon-search"
                          placeholder="输入铭牌号"
                          clearable
                  />
                </el-col>

              <el-col :span="6">
                <el-input
                        v-model="listQuery.machineModelInfo"
                        style="width: 300px"
                        class="filter-item"
                        @keyup.enter.native="handleFilter"
                        prefix-icon="el-icon-search"
                        placeholder="输入型号"
                        clearable
                />
              </el-col>

              <el-col :span="8">
                <!--<el-form-item label="创建日期:">-->
                  <el-date-picker
                          v-model="listQuery.selectDate"
                          type="daterange"
                          align="left"
                          unlink-panels
                          range-separator="—"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions"
                  ></el-date-picker>
                <!--</el-form-item>-->
              </el-col>

              <el-col :span="4">
              <el-button
                      class="filter-item"
                      style="margin-left: 10px"
                      type="primary"
                      @click="handleFilter"
              >搜索</el-button
              >
                </el-col>
            <!--</el-row>-->

          <!--</el-form>-->
          </el-row>
      </div>

      <el-table :data="tableData" style="width: 100%"
                @row-click="clickRowToShowMachineDetail">
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
    <el-dialog :visible.sync="iotDetailVisible" fullscreen @close="dialogCloseCallback()">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="24">
          <div style="text-align: center; font-weight: bold; font-size: 28px; font-family: 'Microsoft YaHei UI';padding-bottom: 20px">
            {{dialogTitle}}
          </div>
          <el-form :model="iotMachineBasicFromAftersale" >
            <el-card class="box-card" style="margin: 25px">

              <el-row>
                <el-col :span="6">
                  <el-form-item label="铭牌号：">
                    <el-input v-model="iotMachineBasicFromAftersale.nameplate" disabled></el-input>
                  </el-form-item>
                </el-col>

              </el-row>

            </el-card>

          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

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
        selectIotMachine,
        selectIotMachineBaseInfo,
        getMachineModelInfoFromAftersale,
} from '@/api/device'

import {
  getAreaSearch,
  addArea,
  deleteArea,
} from '@/api/device'

import { updatePage } from '@/utils/update-page'
import request from '@/utils/request'
import md5 from 'blueimp-md5'

import  moment from 'moment';
//Vue.prototype.$moment = moment;

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
        account:'',
        nameplate: '',
        machineModelInfo: '',
        selectDate:'',
        queryStartTime:'',
        queryEndTime:'',
        page: 1,
        limit: 10,
      },
      tableData: [],
      account: '',

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      iotDetailVisible: false,
      dialogTitle:"",
      iotDetailInfo:
      {
        nameplate:""
      },
      //从售后获取的，机器的基本信息
      iotMachineBasicFromAftersale:
      {
        nameplate:""
      }
    }
  },

  created() {
    // 自动更新 //不需要
    this.getDeviceSearch()
    this.account = JSON.parse(Cookies.get('User')).account
  },
  methods: {
    clickRowToShowMachineDetail(row, event, column) {
      console.log("=========")
      console.log(row,  event,  column)
      this.isError = false;
      this.errorMsg = '';
      this.dialogTitle = '机器详情';
      this.getMachineModelInfoFromAftersale(row );
      this.getIotDeviceDetailInfo(row );
      this.iotDetailVisible = true;
    },

    handleFilter() {
      this.getDeviceSearch()
    },

/// 保持一致的风格

    //  列表
    getDeviceSearch() {
      if(this.listQuery.selectDate != null &&this.listQuery.selectDate.length > 0) {
        this.listQuery.queryStartTime = moment(this.listQuery.selectDate[0].format("yyyy-MM-dd")).valueOf();
        this.listQuery.queryEndTime = moment(this.listQuery.selectDate[1].format("yyyy-MM-dd")).valueOf();

        ;
        }
 
//      return selectIotMachine(this.listQuery)
      return selectIotMachineBaseInfo(
              this.listQuery.page,
              this.listQuery.limit,
              this.listQuery.account,
              this.listQuery.nameplate,
              this.listQuery.machineModelInfo)
              .then((res) => {
        this.tableData = res.data.list
        this.total = res.data.total
        return res
      })
    .catch((err) => {
        console.log(err)
      })
    },

//  查询某机器的具体信息（包括历史数据）
    getIotDeviceDetailInfo(row) {
      this.listQuery.nameplate = row.nameplate;
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

    getMachineModelInfoFromAftersale(row){
      return getMachineModelInfoFromAftersale( row.nameplate)
              .then((res) => {
                this.iotMachineBasicFromAftersale = res.data.list[0]
                return res
              })
              .catch((err) => {
                console.log(err)
              })
    },
    dialogCloseCallback() {
      //reset after dialog closed
      this.iotDetailVisible = false;
      this.listQuery.nameplate = "";
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
