<template lang="pug">
div.head
  span.head__title {{$t('title')}}
  div.head__pages
    nuxt-link(to="/") {{$t('home')}}
    nuxt-link(to="/market") {{$t('market')}}
  div.head__github
    iframe(
      src="https://ghbtns.com/github-btn.html?user=woolson&repo=npmer-page&type=star&count=true"
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
</template>

<style lang="stylus" scoped>

@media screen and (max-width: 767px)
  .head__title
    display none

.head
  position fixed
  top 0
  left 0
  width 100vw
  display flex
  justify-content center
  border-bottom 1px solid $color-border
  background hsla(0,0%,100%,.8)
  backdrop-filter saturate(180%) blur(20px)
  box-shadow 0 0 5px $color-shadow
  padding 15px 50px
  box-sizing border-box
  align-items center
  z-index 99999

.head__title
  padding 10px 20px
  background $color-main
  color white
  line-height 1
  text-align center
  border-radius 5px
  font-size 18px
  font-weight bold
  margin-right 30px

.head__pages > a
    margin-right 20px
    color $color-text
    font-size 18px
    font-weight bold
    line-height 38px
    text-decoration none
    &.nuxt-link-exact-active
      color $color-main
      border-bottom 2px solid $color-main

.head__github
  margin-left auto

.head__lang
  margin-left 5px
  font-weight bold
  span
    &.active
      color $color-main
    &:hover
      cursor pointer
      color $color-main
      text-decoration underline

</style>
