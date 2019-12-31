<template lang="pug">
li.list__item
  el-image.item__img(
    lazy
    :src="encode(baseUrl + data.name)"
  )
  div.item__option
    i.el-icon-link(
      v-clipboard="encode(baseUrl + data.name)"
      @click="$message.success($t('copySuccess'))"
    )
      span {{$t('base.copy')}}
    i(
      v-if="canLike"
      :class="data.stared ? 'el-icon-star-on' : 'el-icon-star-off'"
      @click="$emit('like', data)"
    )
      span {{data.stared ? $t('base.liked') : $t('base.like')}}
      span(v-if="data.stars > 0") ({{data.stars}})
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    canLike: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    }
  },

  data: () => ({
    baseUrl: 'https://woolson.gitee.io/npmer-badge/'
  }),

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
  background var(--background-color-light)
  padding 20px 0
  border-radius 5px
  margin-bottom 20px
  box-shadow 0 0 2px $color-shadow
  &:hover i
    opacity 1 !important

.item__img
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
