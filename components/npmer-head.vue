<template lang="pug">
div.head
  div.head__main
    div.head__title
      img(src="~assets/img/icon.svg")
      span {{$t('base.npmer')}}
    div.head__pages
      nuxt-link(
        :class="{active: pathFirstLevel === ''}"
        to="/"
      ) {{$t('base.home')}}
      nuxt-link(
        :class="{active: pathFirstLevel === 'static'}"
        :to="{path: '/static/shared', query: { page: 1 }}"
      ) {{$t('base.static')}}
      nuxt-link(
        :class="{active: pathFirstLevel === 'template'}"
        :to="{path: '/template/shared', query: { page: 1 }}"
      ) {{$t('base.template')}}
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
        @click="changeLang('zh')"
      ) 中
      i &nbsp;|&nbsp;
      span(
        :class="{active: $i18n.locale === 'en'}"
        @click="changeLang('en')"
      ) EN
    account
  div.head__sub(v-if="pathFirstLevel === 'static' && account")
    nuxt-link(to="/static/shared") {{$t('base.shared')}}
    nuxt-link(to="/static/my") {{$t('myBadge')}}
    nuxt-link(to="/static/liked") {{$t('myLike')}}
  div.head__sub(v-if="pathFirstLevel === 'template' && account")
    nuxt-link(to="/template/shared") {{$t('base.shared')}}
    nuxt-link(to="/template/my") {{$t('myTemplate')}}
    nuxt-link(to="/template/liked") {{$t('myLike')}}
</template>

<script>
import { mapState } from 'vuex'
import Account from './account.vue'

export default {
  components: {
    Account
  },

  computed: {
    ...mapState(['account']),
    pathFirstLevel () {
      return this.$route.path.split('/')[1]
    }
  },

  methods: {
    async login () {
      await this.$alert(this.$t('githubTip'), this.$t('tip'), {
        confirmButtonText: this.$t('submit')
      })
      location.href = 'https://github.com/login/oauth/authorize?client_id=c03fba868563cbf34940&redirect_uri=https://woolson.cn/npmer/api/github/callback&state=123123sadh1as12'
    },
    changeLang (lang) {
      this.$i18n.locale = lang
      localStorage.setItem('LANGUAGE', lang)
    }
  }
}
</script>

<style lang="stylus" scoped>
.head
  position fixed
  z-index 3
  top 0
  left 0
  width 100vw
  min-width 770px
  box-shadow 0 0 5px $color-shadow
  background var(--background-header)
  backdrop-filter saturate(180%) blur(20px)

.head__main
  display flex
  align-items center
  border-bottom 1px solid $color-border
  padding 15px 50px
  box-sizing border-box

.head__title
  padding 0 15px
  background $color-main
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
  color var(--text-color)
  font-size 18px
  font-weight bold
  line-height 38px
  text-decoration none
  &.active
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

.head__sub
  width 100%
  line-height 40px
  box-sizing border-box
  border-bottom 1px solid var(--border-color)
  text-align center
  a
    color var(--text-color)
    margin-right 25px
    text-decoration none
    font-weight bold
    font-size 14px
    &.nuxt-link-exact-active
    &.nuxt-link-active
      color $color-main
    &:last-child
      margin-right 0
</style>
