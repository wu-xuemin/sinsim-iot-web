<template>
<div id="twolines">
  <div class="app-container">
      <div class="app-left">
        <div class="tag">
          <div class="tag-top">
            <div class="tag-h3">标签</div>
            <i class="el-icon-more" @click="handleTagInfo"></i>
          </div> 
          <el-input
            v-model="tagQuery.condition"
            placeholder="请输入标签名称"
            prefix-icon="el-icon-search"
            @keyup.native="getTagList"
            clearable
          ></el-input>
          <div>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                style="display: block"
                v-for="city in cities"
                :label="city"
                :key="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
    <div>
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        prefix-icon="el-icon-search"
        clearable
      />

      <el-select
        v-model="groupType"
        placeholder="个人/团队"
        style="width: 120px"
        @change="handleFilter"
        clearable
      >
        <el-option label="单人来访" :value="0" />
        <el-option label="团队来访" :value="1" />
      </el-select>

      <el-select
        v-model="invitationType"
        placeholder="访问类型"
        style="width: 120px"
        @change="handleFilter"
        clearable
      >
        <el-option label="邀约" :value="0" />
        <el-option label="预约" :value="1" />
        <el-option label="现场登记" :value="2" />
        <el-option label="平台录入" :value="3" />
      </el-select>

      <!-- <el-date-picker
        v-model="queryStartTime"
        type="datetime"
        placeholder="开始时间"
      />
      至
      <el-date-picker
        v-model="queryEndTime"
        type="datetime"
        placeholder="结束时间"
      /> -->
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="handleFilter"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleFilter"
        >搜索</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleCreate"
        >添加</el-button
      >

      <el-dialog
        :title="dialogStaffName"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="90px"
          style="width: 400px; margin-left: 50px"
        >
          <el-form-item
            label="访客姓名:"
            prop="visitorName"
            class="is-required"
          >
            <el-input v-model="temp.visitorName" />
          </el-form-item>

          <el-form-item
            label="访客目的:"
            prop="visitPurpose"
            class="is-required"
          >
            <el-input v-model="temp.visitPurpose" />
          </el-form-item>

          <el-form-item label="被访人员:" prop="staffName" class="is-required">
            <el-input v-model="temp.staffName" />
          </el-form-item>

          <el-form-item label="访客手机:" prop="visitorPhone">
            <el-input v-model="temp.visitorPhone" />
          </el-form-item>
          <el-form-item label="访客公司:" prop="visitorCompany" >
            <el-input v-model="temp.visitorCompany" />
          </el-form-item>
          <el-form-item label="访客职位:" prop="visitorPosition">
            <el-input v-model="temp.visitorPosition" />
          </el-form-item>
          <el-form-item label="访客车牌:" prop="visitorCarNumber">
            <el-input v-model="temp.visitorCarNumber" />
          </el-form-item>
          <!-- <el-form-item label="访客标签:" prop="visitTagIds">
            <el-input value="访客"/>
          </el-form-item> -->
           <el-form-item label="标签:" prop="visitTagIds" :rules="{
      required: true, message: '标签不能为空', trigger: ['blur','change']
    }">
            <el-select
              v-model="temp.visitTagIds"
              multiple
              filterable
              default-first-option
              placeholder="请选择标签"
              style="width:100%">
              <el-option
                v-for="item in tagList"
                :key="item.tagId"
                :label="item.tagName"
                :value="item.tagId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预约时间:" prop="visitTime" class="is-required">
            <el-date-picker
              v-model="tempVisitTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleFilter"
            />
            <p
              v-if="tShow"
              class="el-form-item__error"
              style="position: static"
            >
              请选择预约时间
            </p>
            <!-- <el-date-picker
              v-model="temp.visitBeginTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker> -->
          </el-form-item>

          <!-- <el-form-item
            label="结束时间:"
            prop="visitEndTime"
            class="is-required"
          >
            <el-date-picker
              v-model="temp.visitEndTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            <p
              v-if="tShow"
              class="el-form-item__error"
              style="position: static"
            >
              结束时间不得早于开始时间
            </p>
          </el-form-item> -->

          <el-form-item label="照片:" prop="visitorFaceId" ref="uploadImage">
            <el-upload
              name="avatarFile"
              list-type="picture-card"
              class="avatar-uploader"
              action="#"
              :class="{ disabled: uploadDisabled }"
              :limit="1"
              :file-list="fileList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="imageUrl"
                :src="imageUrl"
                style="width: 148px"
                alt=""
              />
              <span v-else>
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </span>
            </el-upload>
          </el-form-item>

          <el-form-item label="访客卡号:" prop="visitorCardNumber">
            <el-input v-model="temp.visitorCardNumber" />
            <p v-if="pShow" class="el-form-item__error">
              请上传访客照片或填写访客卡号
            </p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseStaffDialog">取消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? createData() : updateData()"
            :loading="butLoading"
            >确认</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="提示"
        :visible.sync="deleteConfirmVisible"
        width="400px"
      >
        <span>
          确认要删除[<b>{{ this.temp.visitorName }}</b
          >]的记录吗？
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false" icon="el-icon-close"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="deleteData"
            icon="el-icon-check"
            :loading="butLoading"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>

      <el-dialog title="标签信息" :visible.sync="dialogTagVisible">
        <el-row>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="handleCreateTag"
            >添加</el-button
          >
        </el-row>
        <el-table :data="tagCities" style="width: 100%">
          <el-table-column property="areaName" label="标签名称" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.tagName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <i
                class="el-icon-edit"
                style="margin-right: 20px; cursor: pointer"
                @click="handleUpdateTag(row)"
              ></i>
              <i
                class="el-icon-delete"
                style="cursor: pointer"
                @click="deleteTagInfo(row, $index)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="tagTotal"
          :page.sync="tagInfoQuery.page"
          :limit.sync="tagInfoQuery.limit"
          @pagination="getTagInfoSearch"
        />
      </el-dialog>
      <el-dialog :title="dialogTagName" :visible.sync="tagDialogVisible">
        <el-form
          :model="tagInfo"
          label-position="right"
          label-width="90px"
          style="width: 400px; margin-left: 50px"
        >
          <el-form-item label="标签名称">
            <el-input
              v-model="tagInfo.tagName"
              @change="checkTagInfo"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseTagVisible">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogTagStatus === 'create' ? createTag() : updateTag()"
            :disabled="addTagBtn"
            >确 定</el-button
          >
        </div>
      </el-dialog>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="serialNumber" label="序号"></el-table-column>
      <el-table-column label="头像" prop="visitorFaceId">
        <template slot-scope="{ row }">
          <img
            v-if="row.visitorFaceId != ''"
            :src="feachImage(row.visitorFaceId)"
            width="60"
            height="60"
          />
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="visitorName" label="姓名"></el-table-column>
      <el-table-column prop="visitorPhone" label="手机号"></el-table-column>
      <el-table-column prop="visitorCompany" label="单位"></el-table-column>
      <el-table-column prop="staffName" label="被访人"></el-table-column>
      <el-table-column prop="visitPurpose" label="来访目的"></el-table-column>
       <el-table-column label="标签" prop="id" align="center">
            <template slot-scope="{ row }">
              <el-tooltip placement="top">
                <div slot="content">
                  <el-tag
                    style="margin: 5px"
                    v-for="tagName in getTagNameByTagId(row.visitTagIds)"
                    :key="tagName"
                    >{{ tagName }}</el-tag
                  >
                </div>
                <el-tag style="margin: 5px">{{
                  getTagNameByTagId(row.visitTagIds)[0]
                }}</el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
      <el-table-column prop="visitBeginTime" label="访问开始">
        <template slot-scope="{ row }">
          {{ row.visitBeginTime | time }}
        </template>
      </el-table-column>
      <el-table-column prop="visitEndTime" label="访问结束">
        <template slot-scope="{ row }">
          {{ row.visitEndTime | time }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="registrationType" label="登记方式">
        <template slot-scope="scope">
          <span v-if="scope.row.registrationType == 0">wechat</span>
          <span v-else>ipad</span>
        </template>
      </el-table-column>
      <el-table-column label="通行方式">
        <template slot-scope="scope">
          <span v-if="scope.row.invitationType == 2">二维码</span>
          <span v-else>人脸</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="groupType" label="团队/个人">
        <template slot-scope="scope">
          <span v-if="scope.row.groupType == 0">个人</span>
          <span v-else>团队</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <i
            class="el-icon-edit"
            style="margin-right: 20px; cursor: pointer"
            @click="handleUpdate(row)"
          ></i>
          <i
            class="el-icon-delete"
            style="cursor: pointer"
            @click="handleDelete(row, $index)"
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
    </div>
  </div>
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
  invitationExportRecord,
  addVisitor,
  deleteVisit,
  updateVisitor,
} from '@/api/visitor'
import {
  getTagSearch,
  getTagList,
  addTag,
  updateTag,
  deleteTag,
  checkTagName,
} from '@/api/visitor'
import {
  uploadFile,
  uploadImage,
  feachImage,
  getTagNameByTagId,
  verifyValue,
  verifyStaffNum,
  verifyNum,
} from '@/api/util'
import request from '@/utils/request'
import Cookies from 'js-cookie'

let cityOptions = []
const temp = {
  staffName: '',
  visitorName: '',
  visitPurpose: '',
  visitBeginTime: '',
  visitEndTime: '',
  visiorPhone: '',
  visitorCompany: '',
  visitorPosition: '',
  visitorCarNumber: '',
  visitorCardNumber: '',
  visitorFaceId: '',
  visitTagIds: [],
  invitationType: 3,
  status: 3,
}

export default {
  name: 'Nowvisitor',
  computed: {
    ...mapGetters(['name']),
  },
  directives: { waves },
  components: { Pagination },
  created() {
    this.getRegion()
    this.getList()
    this.getTagList()
    this.getTagInfoSearch()
    this.getTagInfoList()
    this.account = JSON.parse(Cookies.get('User')).account
  },
  data() {
    var pat = /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (value === '') {
        if (rule.field == 'staffName') {
          callback(new Error('被访人员不能为空'))
        } else if (rule.field == 'visitPurpose') {
          callback(new Error('访客目的不能为空'))
        } else if (rule.field == 'visitorName') {
          callback(new Error('访客姓名不能为空'))
        } 
      } else if (pat.test(value)) {
        if (rule.field == 'staffName') {
          callback(new Error('被访人员不能包含特殊字符'))
        } else if (rule.field == 'visitorName') {
          callback(new Error('访客姓名不能包含特殊字符'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    //   var validateNum= (rule, value, callback) => {
    //     if (!this.temp.faceid && !this.ruleForm.singleChoiceMedium && !this.ruleForm.singleChoiceDifficulty) {
    //         callback(new Error('请至少填写一项'));
    //     } else {
    //         callback();
    //     }
    // };
    return {
      total: 0,
      downloadLoading: false,
      listQuery: {
        condition: '',
        tagIds: [],
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
      },
      regionId: null,
      condition: null,
      status: null,
      groupType: null,
      invitationType: null,
      queryEndTime: null,
      queryStartTime: null,
      regions: [],
      registrationType: null,
      registerTypes: [
        {
          value: 0,
          label: 'WeChat',
        },
        {
          value: 1,
          label: 'iPad',
        },
      ],
      trafficType: null,
      trafficTypes: [
        {
          value: 0,
          label: '人脸',
        },
        {
          value: 1,
          label: '二维码',
        },
      ],
      groupType: null,
      groups: [
        {
          value: 0,
          label: '个人',
        },
        {
          value: 1,
          label: '团队',
        },
      ],
      time: [],
      tableData: [],
      dialogFormVisible: false,
      dialogStaffName: '创建访客',
      dialogStatus: '',
      temp: temp,
      rules: {
        staffName: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        visitorName: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        visitPurpose: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        visitTime: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        visitTagIds: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        // staffNumber: [
        //   { required: true, validator: validateNum, trigger: 'blur' },
        // ],
        // visitorTagIds: [{ required: true, message: '请选择标签', trigger: 'change' }],
      },
      butLoading: false,
      fileList: [],
      uploadDisabled: false,
      imageUrl: '',
      dialogImageUrl: '',
      pShow: '',
      tShow: false,
      deleteConfirmVisible: false,
      tempVisitTime: [],
      dialogTagVisible: false,
      dialogTagStatus: 'create',
      dialogTagName: '创建标签',
      tagDialogVisible: false,
      tagList: [],
      tagIds: [],
      tagCheckAll: false,
      tagCities: [],
      tagIsIndeterminate: true,
      isIndeterminate:false,
      tagQuery: {
        condition: '',
        tagType: 'VISITOR',
        page: 0,
        limit: 0,
      },
      tagInfoQuery: {
        tagType: 'VISITOR',
        page: 1,
        limit: 10,
      },
      tagListQuery: {
        tagType: 'VISITOR',
        page: 0,
        limit: 0,
      },
      tagTotal: 0,
      tagInfo: {
        tagId: '',
        tagName: '',
        tagType: 'VISITOR',
      },
      visitorQuery: {
        condition: '',
        tagIds: [],
        areaIds: [],
        type: 'VISITOR',
        page: 1,
        limit: 10,
      },
      addTagBtn: false,
      checkAll: true,
      checkedCities: cityOptions,
      cities: cityOptions,
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
    handleTagInfo() {
      this.dialogTagVisible = true
    },
    feachImage(faceIds) {
      return feachImage(faceIds)
    },
    //删除
    deleteData() {
      this.butLoading = true
      deleteVisit(this.account, this.temp.applicationId)
        .then((res) => {
          if (res.code == 200) {
            this.deleteConfirmVisible = false
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.butLoading = false
            this.getList()
          }
        })
        .catch((err) => {
          this.butLoading = false
          console.log(err)
        })
    },
    handleDelete(row) {
      this.deleteConfirmVisible = true
      this.temp = row
    },
    handleDownload() {
      var query = {
        regionId: this.regionId,
        queryKey: this.listQuery.title,
        page: this.listQuery.page,
        size: this.listQuery.page,
        registrationType: this.registrationType,
        trafficType: this.trafficType,
        groupType: this.groupType,
        visitorType: 0,
      }
      invitationExportRecord(query)
        .then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '解冻成功',
              type: 'success',
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleFilter() {
      var query = {
        status: this.status,
        groupType: this.groupType,
        invitationType: this.invitationType,
        queryEndTime: Number(this.time[1]),
        queryStartTime: Number(this.time[0]),
        condition: this.listQuery.condition,
        page: this.listQuery.page,
        limit: this.listQuery.limit,
      }
      getInvitationSearch(query)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          for (var i = 0; i < this.tableData.length; i++) {
            // this.getInvitationRegion(i)
            // this.getStaffAuthInfo(i)
          }
          this.total = res.data.total
        })
        .catch((err) => {
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
    getdate(time) {
      var time = new Date(),
        y = time.getFullYear(),
        m = time.getMonth() + 1,
        d = time.getDate()
      return (
        y +
        '-' +
        (m < 10 ? '0' + m : m) +
        '-' +
        (d < 10 ? '0' + d : d) +
        ' ' +
        time.toTimeString().substr(0, 8)
      )
    },
    getList() {
      var query = {
        status: this.status,
        groupType: this.groupType,
        invitationType: this.invitationType,
        queryEndTime: Number(this.time[1]),
        queryStartTime: Number(this.time[0]),
        condition: this.listQuery.condition,
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        tagIds: this.listQuery.tagIds
      }
      getInvitationSearch(query)
        .then((res) => {
          this.tableData = res.data.list
          for (var i = 0; i < this.tableData.length; i++) {}
          this.total = res.data.total
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getRegion() {
      getRegion()
        .then((res) => {
          var list = res.data.list
          for (var i = 0; i < list.length; i++) {
            this.regions.push({ value: list[i].id, label: list[i].regionName })
          }
          this.regions.unshift({ value: null, label: '全部' })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getStaffAuthInfo(i) {
      staffDetail(this.tableData[i].staffAuthId)
        .then((res) => {
          if (res.code === 200) {
            this.tableData[i].staffAuthId = res.data.name
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleCreate() {
      this.pShow = false
      this.tShow = false
      this.uploadDisabled = false
      this.fileList = []
      this.tempVisitTime = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.imageUrl = ''
      this.dialogStaffName = '创建访客'
      this.$nextTick(() => {
        this.temp = JSON.parse(JSON.stringify(temp))
        this.$refs.dataForm.resetFields()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.$refs['dataForm'].resetFields()
          this.temp = JSON.parse(JSON.stringify(temp))
          done()
        })
        .catch((_) => {})
    },
    handleCloseStaffDialog() {
      this.dialogFormVisible = false
      this.$refs['dataForm'].resetFields()
      // this.tagIds = []
    },

    // 添加
    createData() {
      this.pShow = false
      this.tshow = false
      this.uploadDisabled = false
      this.$refs['dataForm'].validate((valid) => {
        if (!this.imageUrl && !this.temp.visitorCardNumber) {
          this.pShow = true
        } else if ( !this.tempVisitTime || !this.tempVisitTime.length) {
          this.tShow = true
        } else {
          this.tShow = false
          if (valid) {
            this.temp.visitTagIds = this.temp.visitTagIds.join(',')
            this.butLoading = true
            this.temp.visitBeginTime = Number(this.tempVisitTime[0])
            this.temp.visitEndTime = Number(this.tempVisitTime[1])
            addVisitor(this.account, this.temp)
              .then((res) => {
                this.dialogFormVisible = false
                this.$message({
                  message: '添加成功',
                  type: 'success',
                })
                this.butLoading = false
                this.imageUrl = ''
                this.tagIds = []
                this.getList()
              })
              .catch((err) => {
                this.butLoading = false
                console.log(err)
              })
          } else {
            this.butLoading = false
          }
        }
      })
    },

    handlePictureCardPreview(file) {
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this.uploadDisabled = false
      this.imageUrl = ''
      this.temp.visitorFaceId = ''
    },

    //显示更新
    handleUpdate(row) {

      this.tshow = false
      this.uploadDisabled = true
      this.imageUrl = row.visitorFaceId
      this.fileList = []
      this.temp = Object.assign({}, row) // copy obj
      this.temp.visitTagIds = this.temp.visitTagIds.split(',')
      // let
      if(this.temp.visitorFaceId.length > 0){
        this.dialogImageUrl = feachImage(this.temp.visitorFaceId)
      const file = {
        name: this.temp.visitorFaceId,
        url: this.dialogImageUrl,
      }
      this.fileList.push(file)
      }else{
        this.uploadDisabled = false
      }
      this.tempVisitTime = [row.visitBeginTime, row.visitEndTime]
      
      this.dialogStatus = 'update'
      this.dialogStaffName = '修改信息'
      this.dialogFormVisible = true
    },
    //更新
    updateData() {
      // this.temp.tagIds = this.temp.tagIds.join(',')
      this.$refs['dataForm'].validate((valid) => {
        if (!this.temp.visitorCardNumber && !this.imageUrl.length) {
          this.pShow = true
        }else if (!this.tempVisitTime || !this.tempVisitTime.length) {
          this.tShow = true
        }
        else {
          this.tShow = false
          if (valid) {
            this.temp.visitTagIds = this.temp.visitTagIds.join(',')
            this.butLoading = true
            this.temp.visitBeginTime = Number(this.tempVisitTime[0])
            this.temp.visitEndTime = Number(this.tempVisitTime[1])
            updateVisitor(this.account, this.temp)
              .then((res) => {
                this.dialogFormVisible = false
                this.$message({
                  message: '修改成功',
                  type: 'success',
                })
                this.butLoading = false
                this.tagIds = []
                this.imageUrl = ''
                this.tempVisitTime = []
                this.getList()
              })
              .catch((err) => {
                this.butLoading = false
                console.log(err)
              })
          }
        }
      })
    },
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.dialogImageUrl = file.url
        this.temp.visitorFaceId = response.data
        this.pShow = false
      } else {
        this.imageUrl = ''
        this.$message({
          type: 'error',
          message: response.message,
        })
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isPNG && !isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      const isGT50k = file.size / 1024 < 20
      const isGT2m = file.size / 1024 > 2 * 1024

      if (isGT50k) {
        this.$message.error('上传文件不能小于20K')
        return false
      }

      if (isGT2m) {
        this.$message.error('上传文件不能大于2M')
        return false
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async (base) => {
        this.imageUrl = reader.result
        const url = uploadImage()
        const res = await request.post(url, {
          base64: this.imageUrl.split(',')[1],
        })
        this.handleSuccess(res, file)
      }

      return false
    },
    handleCreateTag() {
      this.tagDialogVisible = true
      this.dialogTagStatus = 'create'
      this.dialogTagName = '创建标签'
    },
    getTagInfoSearch() {
      getTagSearch(this.tagInfoQuery)
        .then((res) => {
          this.tagCities = res.data.list
          this.tagTotal = res.data.total
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getTagList() {
      // getTagSearch(this.tagListQuery)
        getTagSearch(this.tagQuery)
        .then((res) => {
          this.tagList = res.data.list
          let tagList = res.data.list
          cityOptions.splice(0)
          this.listQuery.tagIds.splice(0)
          tagList.forEach((p) => {
            cityOptions.push(p.tagName)
            this.listQuery.tagIds.push(p.tagId)
          })
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
     getTagInfoList() {
      getTagSearch(this.tagQuery)
        .then((res) => {
          let tagList = res.data.list
          cityOptions.splice(0)
          tagList.forEach((p) => {
            cityOptions.push(p.tagName)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    checkTagInfo() {
      if (this.tagInfo.tagName != null && this.tagInfo.tagName != '') {
        checkTagName(this.tagInfo.tagType, this.tagInfo.tagName)
          .then((res) => {
            if (res.code == 200) {
              let exitsts = res.data
              this.addTagBtn = exitsts
              if (exitsts) {
                this.$message.error('当前标签已存在')
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    handleCloseTagVisible() {
      this.tagDialogVisible = false
      this.tagInfo.tagName = ''
    },
    //标签创建
    createTag() {
      addTag(this.account, this.tagInfo)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
          }
          this.tagDialogVisible = false
          this.tagInfo.tagName = ''
          this.getTagList()
          this.getTagInfoSearch()
          this.getTagInfoList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
     //标签全选
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
      if (val) {
        this.listQuery.tagIds = []
      }

      if (this.checkedCities.length > 0) {
        // if(this.tagQuery.condition.length > 0) {
          getTagList()
          // console.log(1)
        // }else{
          this.getList()
        // }
        
      } else {
        this.tableData = []
      }
    },
    //标签选择
    handleCheckedCitiesChange(value) {
      this.listQuery.tagIds = []
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
      if (value.length == 0) {
        this.tableData = []
        return
      }
      const tagIds = []
      for (let i = 0; i < checkedCount; i++) {
        for (let k = 0; k < this.tagList.length; k++) {
          if (this.tagList[k].tagName == value[i]) {
            this.listQuery.tagIds.push(this.tagList[k].tagId)
          }
        }
      }
      this.getList()
    },
     //标签删除
    deleteTagInfo(row) {
      deleteTag(this.account, row.tagId)
        .then((res) => {
          if ((res.code = 200)) {
            this.$message({
              message: '删除成功',
              type: 'success',
            })
          }
          this.getTagList()
          this.getTagInfoSearch()
          this.getTagInfoList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //标签修改窗口
    handleUpdateTag(row) {
      this.tagDialogVisible = true
      Object.assign(this.tagInfo, row)
      this.dialogTagStatus = 'update'
      this.dialogTagName = '修改标签'
    },
    updateTag() {
      updateTag(this.account, this.tagInfo)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success',
            })
          }
          this.tagDialogVisible = false
          this.getTagInfoSearch()
          this.getTagList()
          this.getTagInfoSearch()
          this.getTagInfoList()
          this.tagInfo.tagName = ''
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getTagNameByTagId(tagId) {
      const tagIds = tagId.split(',')
      return getTagNameByTagId(tagIds, this.tagList)
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
.disabled >>> .el-upload--picture-card {
  display: none;
}
</style>

<style lang="scss" scoped>
#twolines .app-container {
  display: grid;
  grid-template-columns: 17.5% 82.5%;
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
.outer-height-limited {
  height: 800px;
  overflow: hidden;
  position: relative;
}
.inner-height-limited {
  position: absolute;
  left: 0;
  top: 0;
  right: -17px;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
.checkboxSp .el-checkbox__label {
  font-size: 12px;
}
</style>
