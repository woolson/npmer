<template lang="pug">
div.head
  span.head__title {{TEXT.title}}
  div.head__pages
    nuxt-link(to="/") 首页
    nuxt-link(to="/market") 市场
  div.head__github
    iframe(
      src="https://ghbtns.com/github-btn.html?user=woolson&repo=npmer-page&type=star&count=true"
      frameborder="0"
      scrolling="0"
      width="100px"
      height="20px"
    )
</template>

<script>
import Text from '~/assets/js/text'

export default {
  name: 'NpmerHead',

  data () {
    return {
      TEXT: Text
    }
  }
}
</script>

<style lang="stylus" scoped>
.head
  display flex
  align-items center
  padding 10px calc(50% - 360px)
  border-bottom 1px solid $border-color
  background hsla(0,0%,100%,.9)
  backdrop-filter saturate(180%) blur(20px)

.head__title
  padding 10px 20px
  background $color-main
  color white
  line-height 1
  text-align center
  border-radius 5px
  font-size 18px
  font-weight bold

.head__pages
  margin-left 10px
  > a
    margin-left 20px
    color $text-main
    font-size 18px
    font-weight bold
    line-height 38px
    text-decoration none
    &.nuxt-link-exact-active
      color $color-main
      border-bottom 2px solid $color-main

.head__github
  margin-left auto
</style>
