<template lang="pug">
div.foot
  ul.foot__section
    li {{$t('link')}}
    li
      a(href="https://github.com/woolson/") Woolson Lee
    li
      a(href="https://github.com/woolson/npmer-page") GitHub - Repository
  ul.foot__section
    li {{$t('about')}}
    li
      nuxt-link(to="/update") {{$t('updateLog')}}
    li
      span Make with
      span.foot__heart ❤︎
</template>

<style lang="stylus" scoped>
.foot
  width 100vw
  background #333
  margin-top auto
  padding 20px 0 50px 0
  text-align center
  font-family Roboto
  color white
  border-top 1px solid $color-border
  display flex

.foot__section
  padding 0
  margin 0
  list-style none
  display flex
  flex-direction column
  align-items flex-start
  width 250px
  line-height 1.7
  &:first-child
    margin-left calc(50% - 340px)
  li
    color white
    font-size 14px
    a
      color white
    &:first-child
      line-height 25px
      font-size 16px
      font-weight bold
      margin-bottom 10px

.foot__heart
  color $color-main
  margin 0 10px
</style>
