<template lang="pug">
div.body
  npmer-head
  nuxt(keep-alive)
  npmer-foot
  template-use
</template>

<script>
import axios from '~/plugins/axios'
import NpmerHead from '~/components/npmer-head.vue'
import NpmerFoot from '~/components/npmer-foot.vue'
import TemplateUse from '~/components/template/template-use.vue'

export default {
  components: {
    NpmerHead,
    NpmerFoot,
    TemplateUse
  },

  mounted () {
    this.getAccount()
  },

  methods: {
    async getAccount () {
      const account = await axios({
        url: '/npmer/api/account'
      })
      this.$store.commit('UPDATE_ACCOUNT', account)
    }
  }
}
</script>

<style lang="stylus">
.body
  display flex
  min-height 100vh
  flex-direction column
  > *
    &:not(.head)
    &:not(.foot)
      flex 1
</style>
