<template lang="pug">
li.list__item
  div.item__badge
    tag-svg(v-bind="config")
  div.item__option
    i.el-icon-brush(
      @click="$emit('use')"
    )
      span {{$t('base.use')}}
</template>

<script>
import TagSvg from '~/components/home/tag-svg'

export default {
  components: {
    TagSvg
  },

  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    config () {
      if (this.data.config) {
        return JSON.parse(this.data.config)
      } else {
        return {}
      }
    }
  },

  methods: {
    encode (value) {
      return encodeURI(value)
    }
  }
}
</script>

<style lang="stylus" scoped>
.list__item
  display flex
  align-items center
  justify-content center
  flex-direction column
  background var(--background-color-mid)
  padding 20px 0
  border-radius 5px
  margin-bottom 20px
  box-shadow 0 0 2px $color-shadow
  &:hover i
    opacity 1 !important

.item__badge
  height 100px
  display flex
  align-items center
  >>> img
    height auto
  >>> .el-image__error
    background white

.item__option
  margin-bottom -10px
  width 100%
  padding 0 10px
  box-sizing border-box
  display flex
  align-items center
  justify-content flex-end
  cursor pointer
  i
    margin-left 15px
    transition all .3s
    opacity .3
    display flex
    align-items center
    &.el-icon-star-on
      cursor not-allowed
    &.el-icon-link
    &.el-icon-set-up
      opacity 0
    &:hover
      color $color-main
    span
      font-size 12px
      margin-left 2px
      margin-bottom -2px
</style>
