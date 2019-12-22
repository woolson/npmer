<template lang="pug">
div.head
  div.head__title
    img(src="~assets/img/icon.svg")
    span {{$t('title')}}
  div.head__pages
    nuxt-link(to="/") {{$t('home')}}
    nuxt-link(
      :class="{active: $route.path === '/market'}"
      :to="{path: '/market', query: { page: 1 }}"
    ) {{$t('market')}}
  div.head__github
    iframe(
      src="https://ghbtns.com/github-btn.html?user=woolson&repo=npmer&type=star&count=true"
      frameborder="0"
      scrolling="0"
      width="100px"
      height="20px"
    )
  div.head__lang
    span(
      :class="{active: $i18n.locale === 'zh'}"
      @click="$i18n.locale = 'zh'"
    ) 中
    i &nbsp;|&nbsp;
    span(
      :class="{active: $i18n.locale === 'en'}"
      @click="$i18n.locale = 'en'"
    ) EN
  div.head__login
    span(
      v-if="!account"
      @click="login"
    ) {{$t('login')}}
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
        nuxt-link(to="/account/star")
          i.el-icon-star-on
          span {{$t('stared')}}
        nuxt-link(to="/account/uploaded")
          i.el-icon-upload
          span {{$t('uploaded')}}
        a(href="https://woolson.cn/npmer/api/account/logout")
          i.el-icon-s-promotion
          span {{$t('logout')}}
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['account'])
  },

  methods: {
    async login () {
      await this.$alert(this.$t('githubTip'), this.$t('tip'), {
        confirmButtonText: this.$t('submit')
      })
      location.href = 'https://github.com/login/oauth/authorize?client_id=c03fba868563cbf34940&redirect_uri=https://woolson.cn/npmer/api/github/callback&state=123123sadh1as12'
    }
  }
}
</script>

<style lang="stylus" scoped>
.head
  position fixed
  top 0
  left 0
  width 100vw
  min-width 770px
  display flex
  align-items center
  border-bottom 1px solid $color-border
  background hsla(0,0%,100%,.8)
  backdrop-filter saturate(180%) blur(20px)
  box-shadow 0 0 5px $color-shadow
  padding 15px 50px
  box-sizing border-box
  z-index 3

.head__title
  padding 0 15px
  background #cb3837
  color white
  line-height 1
  text-align center
  border-radius 5px
  font-size 18px
  font-weight bold
  margin-right 30px
  display flex
  align-items center
  img
    height 24px
    margin-right 7px
  span
    line-height 40px

.head__pages > a
  margin-right 20px
  color $color-text
  font-size 18px
  font-weight bold
  line-height 38px
  text-decoration none
  &.active
  &.nuxt-link-exact-active
    color $color-main
    border-bottom 2px solid $color-main

.head__github
  margin-left auto
  display flex
  align-items center

.head__lang
  margin-left 10px
  font-weight bold
  span
    &.active
      color $color-main
    &:hover
      cursor pointer
      color $color-main
      text-decoration underline

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
    color $color-text
    text-decoration none
    span
      margin-left 5px
    &:hover
      background rgba($color-main, .1)
      color $color-main
</style>
