<template lang="pug">
el-dialog.template-use(
  :title="$t('useTemplate')"
  :visible="value"
  :lock-scroll="true"
  @close="$emit('input', false)"
)
  el-form(label-width="100px")
    el-form-item(:label="$t('useType')")
      el-cascader.u-w300(
        v-model="useType"
        :options="useTypeList"
        :props="{ expandTrigger: 'hover' }"
      )
    el-form-item(
      v-show="useType[0] === 'github'"
      :label="$t('userName')"
    )
      el-input.u-w300(
        v-model="userName"
        :placeholder="$t('userName')"
        clearable)
    el-form-item(
      v-show="useType[0] === 'github'"
      :label="$t('base.repository')"
    )
      el-input.u-w300(
        v-model="repository"
        :placeholder="$t('base.repository')"
        clearable)
    el-form-item(
      v-show="useType[0] === 'npm'"
      :label="$t('base.package')"
    )
      el-input.u-w300(
        v-model="package"
        :placeholder="$t('base.package')"
        clearable)
    el-form-item(:label="$t('base.link')")
      div.template-use__result
        p {{result}}
        el-button(
          type="text"
          v-clipboard="result"
          @success="$message.success($t('copySuccess'))"
        ) {{$t('base.copy')}}
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    templateId: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      /** 基础路由 */
      baseURL: 'https://woolson.cn/npmer',
      useType: ['github', 'star'],
      userName: '',
      repository: '',
      package: '',
      useTypeList: [
        {
          value: 'github',
          label: 'Github',
          children: [
            {
              value: 'star',
              label: 'Star'
            },
            {
              value: 'release',
              label: 'Release'
            },
            {
              value: 'download',
              label: 'Download'
            }
          ]
        },
        {
          value: 'npm',
          label: 'NPM',
          children: [
            {
              value: 'version',
              label: 'Version'
            },
            {
              value: 'download',
              label: 'Download'
            }
          ]
        }
      ]
    }
  },

  computed: {
    result () {
      const base = `${this.baseURL}/${this.useType.join('/')}/${this.templateId}`
      let result = ''
      switch (this.useType[0]) {
        case 'github':
          result = `${base}?user=${this.userName}&repo=${this.repository}`
          break

        case 'npm':
          result = `${base}?name=${this.package}`
          break
      }
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
.template-use >>> .el-dialog
  min-width 500px

.template-use__result
  display flex
  background var(--background-color-light)
  padding 0 10px
  border-radius 5px
  align-items center
  flex 1
  width 300px
  p
    line-height 1
    margin 0 20px 0 0
    flex 1
    width 1px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
</style>
