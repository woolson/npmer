<template lang="pug">
div.options__row
  //- 链接markdown
  el-form-item(:label="$t('base.markdown')" size="small")
    el-input(v-model="markdownLink" readonly )
      template(slot="append")
        el-button(
          v-clipboard="markdownLink"
          @success="$message.success($t('copySuccess'))"
        ) {{$t('base.copy')}}
  el-form-item(:label="$t('base.link')" size="small")
    el-input(v-model="link" readonly)
      template(slot="append")
        el-button(
          v-clipboard="link"
          @success="$message.success($t('copySuccess'))"
        ) {{$t('base.copy')}}
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: ''
    }
  },

  computed: {
    markdownLink () {
      if (this.link) {
        return `![image](${this.link})`
      } else {
        return ''
      }
    }
  }
}
</script>
