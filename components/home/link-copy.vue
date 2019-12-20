<template lang="pug">
div.option-row
  el-form-item(:label="$t('link')")
    el-input(v-model="link" readonly)
      template(slot="append")
        el-button(
          v-clipboard="link"
          @success="$notify.success({\
            title: $t('copy') + $t('success'),\
            position: 'bottom-right'\
          })"
        ) {{$t('copy')}}
      //- 链接markdown
  el-form-item(:label="$t('markdown')")
    el-input(v-model="markdownLink" readonly)
      template(slot="append")
        el-button(
          v-clipboard="markdownLink"
          @success="$notify.success({\
            title: $t('copy') + $t('success'),\
            position: 'bottom-right'\
          })"
        ) {{$t('copy')}}
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
