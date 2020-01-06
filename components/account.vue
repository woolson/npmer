<template lang="pug">
div.head__login
  span(
    v-if="!account"
    @click="login"
  ) {{$t('base.login')}}
  el-popover(
    v-else
    placement="bottom-end"
    width="120"
    trigger="hover"
  )
    img(slot="reference" :src="account.avatarUrl")
    div.head_user-info
      a(:href="account.htmlUrl")
        i.el-icon-user-solid
        span {{account.name}}
      a(href="https://woolson.cn/npmer/api/account/logout")
        i.el-icon-s-promotion
        span {{$t('base.logout')}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['account'])
  },

  methods: {
    async login () {
      await this.$alert(this.$t('message.githubTip'), this.$t('base.tip'), {
        confirmButtonText: this.$t('submit')
      })
      location.href = 'https://github.com/login/oauth/authorize?client_id=c03fba868563cbf34940&redirect_uri=https://woolson.cn/npmer/api/github/callback&state=123123sadh1as12'
    }
  }
}
</script>

<style lang="stylus" scoped>

.head__login
  margin-left 20px
  cursor pointer
  height 38px
  width 38px
  &:hover
    color $color-main
  > span
    line-height 38px
    font-weight bold
  img
    height 36px
    width 36px
    border-radius 50%
    border 1px solid $color-text
    background $color-text

.head_user-info
  display flex
  flex-direction column
  a
    font-size 14px
    line-height 30px
    font-weight bold
    padding 0 10px
    border-radius 5px
    cursor pointer
    color var(--text-color)
    text-decoration none
    span
      margin-left 5px
    &:hover
      background rgba($color-main, .1)
      color $color-main
</style>
