<template lang="pug">
div.foot
  ul.foot__section
    li {{$t('base.link')}}
    li
      a(href="https://github.com/woolson/") Woolson Lee Github
    li
      a(href="https://github.com/woolson/npmer-page") GitHub - Repository
  ul.foot__section
    li {{$t('base.about')}}
    li
      a(href="https://blog.woolson.cn/") Woolson Lee Blog
    li
      span Make with
      span.foot__heart ❤︎
</template>

<style lang="stylus" scoped>
.foot
  width 100vw
  min-width 770px
  max-height 155px
  background var(--background-color-mid)
  margin-top auto
  padding 20px 50px 50px
  text-align center
  font-family Roboto
  display flex
  box-sizing border-box

.foot__section
  padding 0
  margin 0
  list-style none
  display flex
  flex-direction column
  align-items flex-start
  width 250px
  line-height 1.7
  li
    color var(--text-color)
    font-size 14px
    a
      color var(--text-color)
    &:first-child
      line-height 25px
      font-size 16px
      font-weight bold
      margin-bottom 10px

.foot__heart
  color $color-main
  margin 0 10px
</style>
