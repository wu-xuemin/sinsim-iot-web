<template>
  <div id="twolines">
    <div class="app-container">
      <div class="app-left outer-height-limited">
        <div class="tag inner-height-limited">
          <div class="tag-top">
            <div class="tag-h3">单位</div>
            <i class="el-icon-more" @click="handleTagInfo"></i>
          </div>
          <el-input
            v-model="tagQuery.condition"
            placeholder="请输入单位名称"
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
                class="checkboxSp"
                style="display: block"
                v-for="(city,index) in cities"
                :label="city"
                :key="index"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div>
        <div class="filter-container">
          <el-input
            v-model="staffQuery.condition"
            style="width: 300px"
            class="filter-item"
            placeholder="姓名、工号、卡号、职位、联系方式"
            @keyup.enter.native="getStaffSearch"
            prefix-icon="el-icon-search"
            clearable
          />
          <el-select
            v-model="park"
            placeholder="园区"
            style="width: 200px"
            @change="parkSection"
            :disabled="selectP"
            clearable
            filterable
          >
            <el-option
              v-for="item in parkList"
              :key="item.parkId"
              :label="item.parkName"
              :value="item.parkId"
            ></el-option>
          </el-select>

          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="getStaffSearch"
            >搜索</el-button
          >

          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="handleCreate"
            >添加</el-button
          >
          <el-dropdown trigger="hover" placement="bottom-start">
            <span class="el-dropdown-link">
              <el-button
                type="primary"
                style="margin-left: 10px"
                :loading="uploadLoading"
                >导入
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-upload
                name="multipartFile"
                class="upload-demo"
                accept="application/zip,application/x-zip,application/x-zip-compressed"
                :headers="{
                  token: getToken(),
                }"
                :action="uploadFile"
                :show-file-list="false"
                :on-error="handleError"
                :on-success="handleSuccessUpload"
                :before-upload="handleGress"
                :disabled="uploadLoading"
              >
                <el-dropdown-item
                  ><div style="width: 100%">
                    导入ZIP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                </el-dropdown-item>
              </el-upload>
              <el-dropdown-item
                ><div @click="downloadZip">下载导入模板</div></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>

          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="handleDownload"
            >导出</el-button
          >
        </div>

        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="工号" prop="staffNumber" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.staffNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="头像" prop="id" align="center">
            <template slot-scope="{ row }">
              <img
                v-if="row.faceIds != null"
                :src="feachImage(row.faceIds)"
                width="60"
                height="60"
              />
            </template>
          </el-table-column>
          <el-table-column label="卡号" prop="cardNumber" align="center">
            <template slot-scope="{ row }">
              <span v-if="row.cardNumber == null || row.cardNumber == ''"
                >--</span
              >
              <span v-else>{{ row.cardNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="name" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="园区" prop="parkId" align="center">
            <template slot-scope="{ row }">
              <span>{{ getParkNameByParkId(row.parkId)[0] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="id" align="center" width="280">
            <template slot-scope="{ row }">
              <el-tooltip placement="top">
                <div slot="content">
                  <el-tag
                    style="margin: 5px"
                    v-for="tagName in getTagNameByTagId(row.tagIds)"
                    :key="tagName"
                    >{{ tagName }}</el-tag
                  >
                </div>
                <el-tag style="margin: 5px">{{
                  getTagNameByTagId(row.tagIds)[0]
                }}</el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="职位" prop="remark" align="center">
            <template slot-scope="{ row }">
              <!-- <span v-if="row.contact == null || row.concact == ''">--</span> -->
              <!-- <span v-else>{{ row.contact }}</span> -->
              <span>{{ row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="联系方式" prop="id" align="center">
            <template slot-scope="{ row }">
              <!-- <span v-if="row.contact == null || row.concact == ''">--</span>
              <span v-else>{{ row.contact }}</span> -->
              <span>{{ row.contact }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="入职时间" prop="entryTime" align="center" width="120">
            <template slot-scope="{ row }">
              <span
                v-if="
                  row.entryTime != 0 &&
                  row.entryTime != null &&
                  row.entryTime != ''"
                >{{ Number(row.entryTime) | time }}</span
              >
              <span v-else></span>
            </template>
          </el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="150"
          >
            <template slot-scope="{ row, $index }">
              <el-tooltip
                content="修改"
                placement="bottom-start"
                effect="light"
              >
                <i
                  class="el-icon-edit"
                  style="margin-right: 15px; cursor: pointer"
                  @click="handleUpdate(row)"
                ></i>
              </el-tooltip>
              <el-tooltip
                content="离职"
                placement="bottom-start"
                effect="light"
              >
                <i
                  class="el-icon-document-remove"
                  style="margin-right: 15px; cursor: pointer"
                  @click="handleResign(row, $index)"
                ></i>
              </el-tooltip>
              <el-tooltip
                content="删除"
                placement="bottom-start"
                effect="light"
              >
                <i
                  class="el-icon-delete"
                  style="cursor: pointer"
                  @click="handleDelete(row, $index)"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total="total"
          :page.sync="staffQuery.page"
          :limit.sync="staffQuery.limit"
          @pagination="getStaffSearch"
        />
      </div>

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
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>

          <el-form-item
            label="工号:"
            prop="staffNumber"
            v-if="staffNumberShow == false"
          >
            <el-input v-model="temp.staffNumber" @blur="checkStaffNum" />
          </el-form-item>

          <el-form-item label="工号:" prop="staffNumber" v-if="staffNumberShow">
            <el-input v-model="temp.staffNumber" @blur="checkStaffNum" />
          </el-form-item>

          <el-form-item label="卡号:" prop="cardNumber">
            <el-input v-model="temp.cardNumber" @blur="checkCardNum" />
          </el-form-item>

          <el-form-item label="联系方式:" prop="contact">
            <el-input v-model="temp.contact" />
          </el-form-item>
          <el-form-item label="园区:" prop="parkId">
            <el-select
              v-model="temp.parkId"
              filterable
              default-first-option
              :disabled="selectP"
              placeholder="请选择园区"
              style="width: 100%"
              @change="resetTempTagList()"
            >
              <el-option
                v-for="item in parkList"
                :key="item.parkId"
                :label="item.parkName"
                :value="item.parkId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位:" prop="tagIds">
            <el-select
              v-model="temp.tagIds"
              filterable
              default-first-option
              placeholder="请选择单位"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in tempTagList"
                :key="item.tagId"
                :label="item.tagName"
                :value="item.tagId"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="入职时间:" prop="entryTime">
            <el-date-picker
              style="width: 100%"
              v-model="temp.entryTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="职位:" prop="remark">
            <el-input v-model="temp.remark"></el-input>
          </el-form-item>

          <el-form-item
            label="照片:"
            prop="faceIds"
            ref="uploadImage"
            class="is-required"
          >
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
                <p v-if="pShow" class="el-form-item__error">请上传员工照片</p>
              </span>
            </el-upload>
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
          确认要删除[
          <b>{{ this.temp.name }}</b> ]吗？
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

      <el-dialog title="单位信息" :visible.sync="dialogTagVisible">
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
          <el-table-column property="areaName" label="单位名称" align="center">
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
              <!-- <i
                class="el-icon-delete"
                style="cursor: pointer"
                @click="deleteTagInfo(row, $index)"
              ></i> -->
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
          :rules="tagRules"
          :model="tagInfo"
          label-position="right"
          label-width="90px"
          style="width: 400px; margin-left: 50px"
        >
          <el-form-item label="单位名称" prop="tagName">
            <el-input
              style="width: 310px"
              v-model="tagInfo.tagName"
              @change="checkTagInfo"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="dialogTagStatus === 'create'"
            label="所属园区"
            prop="parkId"
          >
            <el-select
              v-model="tagPark"
              placeholder="园区"
              style="width: 200px"
              @change="tagParkSection"
              :disabled="selectP"
              clearable
              filterable
            >
              <el-option
                v-for="item in parkList"
                :key="item.parkId"
                :label="item.parkName"
                :value="item.parkId"
              ></el-option>
            </el-select>
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
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import Cookies from 'js-cookie'

import {
  getStaffSearch,
  addStaff,
  updateStaff,
  deleteStaff,
  checkCard,
  checkStaffNumber,
  getParkTagSearch,
  resignStaff,
} from '@/api/staff'
import {
  getTagSearch,
  getTagList,
  addTag,
  updateTag,
  deleteTag,
  checkTagName,
} from '@/api/staff'
import { getParkSearch, addParkTag } from '@/api/park'
import { getAreaList } from '@/api/device'
import { staffExport } from '@/api/export'
import {
  uploadFile,
  uploadImage,
  feachImage,
  getTagNameByTagId,
  getTagListByTagId,
  getParkNameByParkId,
  getUnitByParkId,
  verifyValue,
  verifyStaffNum,
  verifyNum,
} from '@/api/util'
import { getToken } from '@/utils/auth'
import { updatePage } from '@/utils/update-page'
import request from '@/utils/request'

let cityOptions = []
const temp = {
  staffId: '',
  name: '',
  staffNumber: '',
  cardNumber: '',
  faceIds: '',
  contact: '',
  tagIds: '',
  entryTime: '',
  email: '',
  remark: '',
  parkId: '',
}

export default {
  name: 'Employee',
  components: { Pagination },
  directives: { waves },
  data() {
    var pat = /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (!value) {
        callback(new Error('姓名不能为空'))
      } else {
        callback()
      }
    }

    var validateNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('工号不能为空'))
      } else {
        callback()
      }
    }

    var validateTag = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择单位'))
      } else {
        callback()
      }
    }

    return {
      staffImage: '',
      getToken: getToken,
      uploadLoading: false,
      uploadFile: '',
      uploadImage: '',
      pShow: false,
      staffExportData: '',
      checkAll: true,
      checkedCities: cityOptions,
      cities: cityOptions,
      isIndeterminate: false,
      staffNumberShow: false,
      dialogStaffName: '创建员工',
      uploadDisabled: false,
      imageUploadUrl: '',
      fileList: [],
      butLoading: false,
      deleteConfirmVisible: false,
      text: '',
      input: '',
      dialogImageUrl: '',
      dialogVisible: false,
      dialogTagVisible: false,
      dialogTagStatus: 'create',
      dialogTagName: '创建单位',
      tagDialogVisible: false,
      tagList: [],
      tagIds: [],
      tagCheckAll: false,
      tagCities: [],
      tagIsIndeterminate: true,
      total: 0,
      staffQuery: {
        condition: '',
        tagIds: [],
        areaIds: [],
        parkId: localStorage.getItem('parkId'),
        type: 'STAFF',
        page: 1,
        limit: 10,
      },
      tagQuery: {
        condition: '',
        tagType: 'STAFF',
        page: 0,
        limit: 0,
      },
      tagInfoQuery: {
        tagType: '',
        page: 1,
        limit: 10,
      },
      tagListQuery: {
        tagType: 'STAFF',
        page: 0,
        limit: 0,
      },
      tagTotal: 0,
      temp: temp,
      tagInfo: {
        tagId: '',
        tagName: '',
        tagType: 'STAFF',
      },
      tagPark: '',
      downloadLoading: false,
      tableData: [],
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, validator: validateForm, trigger: 'blur' }],
        staffNumber: [
          { required: true, validator: validateNum, trigger: 'blur' },
        ],
        parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
        tagIds: [{ required: true, message: '请选择单位', trigger: 'change' }],
      },
      tagRules: {
        tagName: [{ required: true, validator: validateForm, trigger: 'blur' }],
        // parkId: [{ required: true, message: '请选择园区', trigger: 'change' }],
      },
      status: false,
      cardNumStatus: true,
      account: '',
      imageUrl: '',
      addTagBtn: false,
      dialogstatus: '',
      parkQuery: {
        tagIds: null,
        name: null,
        page: 0,
        size: 0,
      },
      parkList: [],
      tempTagList: [],
      selectP: localStorage.getItem('parkId').length > 0,
      park: '',
    }
  },
  created() {
    //1、定时查询人员
    updatePage(this.getStaffSearch, true)
    //标签
    this.intializePark()

    this.getTagInfoSearch()
    // this.getTagInfoList()
    this.park = this.staffQuery.parkId
    this.tagPark = this.staffQuery.parkId
    this.parkSection()
    // this.getTagList()
    this.account = JSON.parse(Cookies.get('User')).account
    this.uploadFile = uploadFile()
    this.uploadImage = uploadImage()
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
      return Y + M + D
    },
  },
  methods: {
    handleResign(row) {
      this.$confirm(`是否设置员工[${row.name}]为离职?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return resignStaff(row.staffId).then((res) => {
            console.log(res)
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '操作成功',
              })
              this.getStaffSearch()
            } else {
              this.$message({
                type: 'error',
                message: '操作失败',
              })
            }
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除',
          // })
        })
    },
    intializePark() {
      getParkSearch(this.parkQuery)
        .then((res) => {
          this.parkList = res.data.list
          getTagSearch(this.tagQuery)
            .then((res) => {
              this.tagList = res.data.list
              let tagList = res.data.list
              cityOptions.splice(0)
              this.staffQuery.tagIds.splice(0)
              if (localStorage.getItem('parkId') != '') {
                this.tempTagList = getTagListByTagId(
                  getUnitByParkId(
                    localStorage.getItem('parkId'),
                    this.parkList
                  )[0].split(','),
                  this.tagList
                )
                tagList = this.tempTagList
              }

              tagList.forEach((p) => {
                cityOptions.push(p.tagName)
              })
              this.staffQuery.tagIds = []
              this.getStaffSearch()
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    downloadZip() {
      window.open('/zip/staff.zip')
    },
    parkSection() {
      this.staffQuery.parkId = this.park
      this.getStaffSearch()
    },
    tagParkSection() {
      console.log(this.tagPark)
      // this.staffQuery.parkId = this.tagPark
      // this.getStaffSearch()
    },
    getTempTagList() {
      // if (this.temp.parkId) {
      this.tempTagList = getTagListByTagId(
        getUnitByParkId(this.temp.parkId, this.parkList)[0].split(','),
        this.tagList
      )
      // }
    },
    resetTempTagList() {
      this.temp.tagIds = ''
      // if (this.temp.parkId) {
      this.tempTagList = getTagListByTagId(
        getUnitByParkId(this.temp.parkId, this.parkList)[0].split(','),
        this.tagList
      )
    },
    //文件导入失败
    handleError() {
      this.$store.commit('survive/CHANGE_PROCESS_CODE', 'exception')
      this.uploadLoading = false
      this.$message.error('文件导入失败')
    },

    //上传文件之前的钩子
    handleGress(file) {
      if (file.name.indexOf('.zip') != -1) {
        this.uploadLoading = true
        this.$store.commit('survive/CHANGE_PROCESS', true)
        this.$store.commit('survive/CHANGE_PROCESS_CODE', 'loading')
        return true
      } else {
        this.$message({
          showClose: true,
          message: '文件格式错误，请上传zip压缩包',
          type: 'error',
        })
        return false
      }
    },

    //文件导入成功
    handleSuccessUpload(response, file, fileList) {
      this.uploadLoading = false
      if (response.code === 603) {
        this.$store.commit('survive/CHANGE_PROCESS_CODE', 'exception2')
        this.$store.commit('survive/CHANGE_ERROR_MESSAGE', response.message)
      } else if (response.code === 602) {
        this.$store.commit('survive/CHANGE_PROCESS_CODE', 'exception')
        this.$store.commit('survive/CHANGE_ERROR_MESSAGE', response.message)
      } else {
        this.$store.commit('survive/CHANGE_PROCESS_CODE', 'success')
      }
    },
    //显示更新
    handleUpdate(row) {
      this.imageUrl = row.faceIds
      this.staffNumberShow = true
      this.uploadDisabled = true
      this.fileList = []
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.tagIds = this.temp.tagIds.split(',')
      // console.log(this.temp)
      if (
        this.temp.entryTime == 0 ||
        this.temp.entryTime == null ||
        this.temp.entryTime == ''
      ) {
        this.temp.entryTime = ''
      } else {
        this.temp.entryTime = new Date(Number(this.temp.entryTime))
      }

      this.getTempTagList()
      this.dialogStatus = 'update'
      this.dialogImageUrl = feachImage(this.temp.faceIds)
      const file = {
        name: this.temp.faceIds,
        url: this.dialogImageUrl,
      }
      this.fileList.push(file)
      this.dialogStaffName = '修改信息'
      this.dialogFormVisible = true
    },
    //更新
    updateData() {
      // this.temp.tagIds = this.temp.tagIds.join(',')
      if (this.temp.entryTime != null) {
        this.temp.entryTime = Number(this.temp.entryTime)
      } else {
        this.temp.entryTime = ''
      }

      this.$refs['dataForm'].validate((valid) => {
        if (!this.imageUrl) {
          this.pShow = true
        } else {
          if (valid) {
            this.butLoading = true

            updateStaff(this.account, this.temp)
              .then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                  })
                } else {
                  this.$message({
                    message: '修改失败',
                    type: 'error',
                  })
                }

                this.dialogFormVisible = false

                this.butLoading = false
                this.tagIds = []
                this.imageUrl = ''
                this.getStaffSearch()
                this.tempTagList = []
              })
              .catch((err) => {
                this.butLoading = false
                console.log(err)
              })
          }
        }
      })
    },
    //显示删除
    handleDelete(row) {
      this.deleteConfirmVisible = true
      this.temp = row
    },
    //删除
    deleteData() {
      this.butLoading = true
      deleteStaff(this.account, this.temp.staffId)
        .then((res) => {
          if (res.code == 200) {
            this.deleteConfirmVisible = false
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.butLoading = false
            this.getStaffSearch()
          } else {
            this.$message({
              message: '删除失败',
              type: 'error',
            })
            this.deleteConfirmVisible = false
            this.butLoading = false
            this.getStaffSearch()
          }
        })
        .catch((err) => {
          this.butLoading = false
          console.log(err)
        })
    },
    //显示添加
    handleCreate() {
      this.tempTagList = []
      this.pShow = false
      this.uploadDisabled = false
      this.fileList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.staffNumberShow = false
      this.imageUrl = ''
      this.dialogStaffName = '创建员工'
      this.$nextTick(() => {
        this.temp = JSON.parse(JSON.stringify(temp))
        this.$refs.dataForm.resetFields()
      })
      this.temp.parkId = localStorage.getItem('parkId')
      this.getTempTagList()
    },

    // 添加
    createData() {
      this.pShow = false
      this.uploadDisabled = false
      this.temp.entryTime = Number(this.temp.entryTime)
      this.$refs['dataForm'].validate((valid) => {
        if (!this.imageUrl) {
          this.pShow = true
        } else {
          if (valid) {
            //       this.temp.entryTime = (new Date()).valueOf()
            // this.temp.birthday = (new Date()).valueOf()
            // this.temp.tagIds = this.temp.tagIds.join(',')
            this.butLoading = true
            addStaff(this.account, this.temp)
              .then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                  })
                } else {
                  this.$message({
                    message: '添加失败',
                    type: 'error',
                  })
                }
                this.dialogFormVisible = false

                this.butLoading = false
                this.imageUrl = ''
                this.tagIds = []
                this.tempTagList = []
                this.getStaffSearch()
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

    //检查卡号
    checkCardNum() {
      // console.log(33)
      if (
        this.temp.cardNumber != null &&
        this.temp.cardNumber != '' &&
        this.dialogStatus === 'create'
      ) {
        checkCard(this.temp.cardNumber)
          .then((res) => {
            if (res.data == true) {
              this.cardNumStatus = res.data
              this.$message.error('当前卡号已存在')
              this.temp.cardNumber = ''
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    //检查员工工号
    checkStaffNum() {
      if (this.temp.staffNumber != null && this.temp.staffNumber != '') {
        checkStaffNumber(this.temp.staffNumber)
          .then((res) => {
            if (res.code == 200) {
              this.status = res.data

              if (this.status) {
                this.temp.staffNumber = ''
                this.$message.error('当前工号已存在')
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    //检查标签
    checkTagInfo() {
      if (this.tagInfo.tagName != null && this.tagInfo.tagName != '') {
        checkTagName(this.tagInfo.tagType, this.tagInfo.tagName)
          .then((res) => {
            if (res.code == 200) {
              let exitsts = res.data
              this.addTagBtn = exitsts
              if (exitsts) {
                this.$message.error('当前单位已存在')
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    //导出
    handleDownload() {
      let downloadQuery = JSON.parse(JSON.stringify(this.staffQuery))
      downloadQuery.limit = 0
      downloadQuery.page = 0
      staffExport(this.account, downloadQuery)
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
    //员工列表
    getStaffSearch() {
      return getStaffSearch(this.staffQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //标签
    getTagInfoSearch() {
      if (localStorage.getItem('parkId') != '') {
        getParkTagSearch({
          parkId: localStorage.getItem('parkId'),
          page: this.tagInfoQuery.page,
          size: this.tagInfoQuery.limit,
        })
          .then((res) => {
            this.tagCities = res.data.list
            this.tagTotal = res.data.total
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        getTagSearch(this.tagInfoQuery)
          .then((res) => {
            this.tagCities = res.data.list
            this.tagTotal = res.data.total
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    //标签
    getTagInfoList() {
      getTagSearch(this.tagQuery)
        .then((res) => {
          let tagList = res.data.list
          cityOptions.splice(0)
          tagList.forEach((p) => {
            // console.log(1)
            cityOptions.push(p.tagName)
          })
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
          getParkSearch(this.parkQuery).then((p) => {
            this.parkList = p.data.list
            cityOptions.splice(0)
            this.staffQuery.tagIds.splice(0)
            if (localStorage.getItem('parkId') != '') {
              this.tempTagList = getTagListByTagId(
                getUnitByParkId(
                  localStorage.getItem('parkId'),
                  this.parkList
                )[0].split(','),
                this.tagList
              )
              tagList = this.tempTagList
            }

            tagList.forEach((p) => {
              cityOptions.push(p.tagName)
              this.staffQuery.tagIds.push(p.tagId)
            })
            this.getStaffSearch()
          })
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

    //标签全选
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
      if (val) {
        this.staffQuery.tagIds = []
      }

      if (this.checkedCities.length > 0) {
        this.getStaffSearch()
      } else {
        this.staffQuery.tagIds = []
        this.getStaffSearch()
      }
    },
    //标签选择
    handleCheckedCitiesChange(value) {
      // console.log(value)
      this.staffQuery.tagIds = []
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      console.log(this.cities)
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
      if (value.length == 0 || this.isIndeterminate == false) {
        this.staffQuery.tagIds = []
        this.getStaffSearch()
        return
      }
      const tagIds = []
      for (let i = 0; i < checkedCount; i++) {
        for (let k = 0; k < this.tagList.length; k++) {
          if (this.tagList[k].tagName == value[i]) {
            this.staffQuery.tagIds.push(this.tagList[k].tagId)
          }
        }
      }
      this.getStaffSearch()
    },
    //关闭窗口
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.$refs['dataForm'].resetFields()
          this.temp = JSON.parse(JSON.stringify(temp))
          this.tempTagList = []
          done()
        })
        .catch((_) => {})
    },
    //显示照片
    feachImage(faceIds) {
      return feachImage(faceIds)
    },
    //根据标签id查询标签名称
    getTagNameByTagId(tagId) {
      const tagIds = tagId.split(',')
      return getTagNameByTagId(tagIds, this.tagList)
    },
    //根据园区id查询园区名称
    getParkNameByParkId(parkId) {
      const parkIds = parkId.split(',')
      return getParkNameByParkId(parkIds, this.parkList)
    },
    //删除图片
    handleRemove(file, fileList) {
      this.uploadDisabled = false
      this.imageUrl = ''
    },
    //图片上传成功
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.dialogImageUrl = file.url
        this.temp.faceIds = response.data

        this.pShow = false
      } else {
        this.imageUrl = ''
        this.$message({
          type: 'error',
          message: response.message,
        })
      }
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
    },
    //图片上传前执行
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
        console.log(res)
        this.handleSuccess(res, file)
      }

      return false
    },
    // 添加标签
    handleTagInfo() {
      this.dialogTagVisible = true
    },
    // 标签创建窗口
    handleCreateTag() {
      this.tagDialogVisible = true
      this.dialogTagStatus = 'create'
      this.dialogTagName = '创建单位'
    },
    //标签修改窗口
    handleUpdateTag(row) {
      this.tagDialogVisible = true
      Object.assign(this.tagInfo, row)
      this.dialogTagStatus = 'update'
      this.dialogTagName = '修改单位'
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
          // this.getTagInfoList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //标签创建
    createTag() {
      if (this.tagPark == null || this.tagPark == '') {
        this.$message.error('请选择单位')
        return
      }
      let addTagQuery = {
        tagName: this.tagInfo.tagName,
        parkId: this.tagPark,
      }
      addParkTag(this.account, addTagQuery)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
            this.tagDialogVisible = false
            this.tagInfo.tagName = ''
            this.getTagList()
            this.getTagInfoSearch()
          } else {
            this.$message({
              message: '添加失败',
              type: 'error',
            })
            this.tagDialogVisible = false
            this.tagInfo.tagName = ''
            this.getTagList()
            this.getTagInfoSearch()
          }

          // this.getTagInfoList()
        })
        .catch((err) => {
          console.log(err)
        })
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
          // this.getTagInfoList()
          this.tagInfo.tagName = ''
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleCloseTagVisible() {
      this.tagDialogVisible = false
      this.tagInfo.tagName = ''
    },
    handleCloseStaffDialog() {
      this.dialogFormVisible = false
      this.$refs['dataForm'].resetFields()
      this.tagIds = []
      this.tempTagList = []
    },
  },
}
</script>

<style lang="scss" scoped>
.upload-demo {
  display: inline-block;
  // margin-left: 10px;
  .el-button--small {
    padding: 12px 20px;
    font-size: 14px;
  }
}
.el-table .cell {
  white-space: nowrap; //强制不换行
  overflow: hidden; //溢出隐藏
  text-overflow: ellipsis; //替换为省略号
}
.disabled >>> .el-upload--picture-card {
  display: none;
}
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
.checkboxSp >>> .el-checkbox__label {
  font-size: 12px;
}
</style>
