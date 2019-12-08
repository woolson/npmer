<template lang="pug">
div.foot
  span Make with
  span.foot__heart ❤︎
  a(href="https://github.com/woolson/") Woolson Lee
</template>

<style lang="stylus" scoped>
.foot
  width 100vw
  background white
  margin-top auto
  padding 10px 0
  text-align center
  font-family Roboto
  border-top 1px solid $color-border

.foot__heart
  color $color-main
  margin 0 10px
</style>
