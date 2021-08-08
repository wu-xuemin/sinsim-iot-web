<template>
  <div class="survive">
    <ve-dialog
      :title="title"
      :visible.sync="process"
      style="width: 340px">
      <template v-slot:body>
        <div style="width: 100%;display: flex;align-items: center;justify-content: space-between">
          <el-progress
            style="flex: 1;margin-right: 10px;"
            :text-inside="true"
            :stroke-width="20"
            :percentage="percentage"
            :color="processStatusColor"/>
           <el-tooltip v-if="download == 1" class="item" effect="dark" :content="errorMsg" placement="top-start">
            <i :class="processStatus" :style="{color: processStatusColor}"  @click="test"
            ><span class="dError">错误报告</span></i>
          
          </el-tooltip>
          <el-tooltip v-else-if="download == 2" class="item" effect="dark" :content="errorMsg" placement="top-start">
            <i :class="processStatus" :style="{color: processStatusColor}" 
            ></i>
          
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" content="成功" placement="top-start">
            <i :class="processStatus" :style="{color: processStatusColor}"></i>
          </el-tooltip>
        </div>
      </template>
    </ve-dialog>
  </div>
</template>

<script>
import VeDialog from '@/components/to-body-dialog'
import { mapState } from 'vuex'

const processStatusMap = {
  loading: 'el-icon-loading',
  success: 'el-icon-circle-check',
  exception: 'el-icon-circle-close',
   exception2: 'el-icon-circle-close'
}
const processStatusColorMap = {
  loading: '#409EFF',
  success: '#67C23A',
  exception: '#E6A23C',
  exception2: '#E6A23C',
}

export default {
  name: 'Survive',
  components: {
    VeDialog
  },
  data() {
    return {
      percentage: 0,
      download:0
    }
  },
  computed: {
    ...mapState('survive', ['process', 'processCode', 'errorMsg']),
    processStatus() {
      return processStatusMap[this.processCode]
    },
    processStatusColor() {
      return processStatusColorMap[this.processCode]
    },
    title() {
      const title = {
        loading: '上传中...',
        success: '上传完成',
        exception: '上传失败',
        exception2: '上传失败'
      }
      return title[this.processCode]
    }
  },
  watch: {
    processCode(v) {
      if (v === 'success') {
        this.percentage = 100
        this.download = 0
        console.log("成功")
      }
      if (v === 'exception') {
        this.percentage = 100
        this.download = 2
        console.log("失败，返回错误信息")
      }
       if (v === 'exception2') {
        this.percentage = 100
        this.download = 1
        console.log("失败，返回错误报告")
      }
      if (v === 'loading') {
        this.percentage = 0
        this.download = 0
        this.updateProcess()
      }
    }
  },
  methods: {
    sleep(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms)
      })
    },
    test(){
      let a = document.createElement('a')
      a.href = this.errorMsg
      a.target = "_blank"
      a.click()
      // // location.href = ""
    },
    async updateProcess() {
      if (this.percentage <= 90) {
        const time = (Math.random() * 500 + 200) | 0
        await this.sleep(time)
        // 异步问题，可能妙传导致进度大于100%
        if (this.percentage <= 90) {
          this.percentage += ((Math.random() * 8) | 0) + 1
          this.updateProcess()
        }
      }
    }
  }
}
</script>

<style scoped>
.dError{
  font-size:12px;
  
}
</style>
