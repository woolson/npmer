<template lang="pug">
div.options__color
  ul
    li(
      v-for="color in colors"
      :class="{active: value === color}"
      :style="{background: color}"
      @click="$emit('input', color)"
    )
  el-color-picker(@change="$emit('input', $event)")
</template>

<script>
export default {
  name: 'color-pick',

  props: {
    value: String,
    label: String,
    colors: Array,
  },
};
</script>

<style lang="stylus" scoped>
.options__color
  display flex
  align-items center
  >>> .el-form-item__content
    display flex
    align-items center
    margin-left 0 !important
  >>> .el-color-picker
    height auto
    margin-left auto

.options__color ul
  // box-shadow 0 0 1px rgba(black, 0.15)
  border 1px dashed rgba(black, .25)
  border-radius 3px
  height 20px
  padding 0
  margin 0
  display flex
  align-items center
  list-style none
  li
    width 20px
    height 20px
    cursor pointer
    &.active
      box-shadow inset 0 0 5px rgba(black, .3)
      position relative
      &:after
        content ' '
        height 100%
        width 100%
        top -3px
        left -3px
        position absolute
        border: 3px solid white
        box-shadow 0 0 5px rgba(black, .4)
        border-radius 3px
</style>

