<template lang="pug">
draggable(v-model="myArray" :move="checkMove")
  transition-group.column-group(tag="div")
    div.group__item(
      v-for="item,index in myArray"
      :class="item.name"
      :key="index")
      span(
        :class="{'el-icon-rank': item.name === 'icon'}"
        ) &nbsp;{{$t(item.title)}}
      el-select(
        v-if="item.name === 'icon'"
        v-model="iconIndex"
        :placeholder="$t('select')"
        clearable
        filterable)
        el-option(
          v-for="item,index in icons"
          :key="item.id"
          :label="item[nameKey]"
          :value="index")
      el-input(
        v-else-if="item.name === 'left'"
        v-model="options.leftText"
        clearable)
      el-input(
        v-else-if="item.name === 'right'"
        v-model="options.rightText"
        clearable)
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },

  data () {
    return {
      myArray: [
        { name: 'icon', title: 'icon' },
        { name: 'left', title: 'leftText' },
        { name: 'center', title: 'center' },
        { name: 'right', title: 'rightText' }
      ],
      iconIndex: 0,
      icons: [],
      options: {
        leftText: '456',
        rightText: '123'
      }
    }
  },

  methods: {
    checkMove ({ draggedContext }) {
      return draggedContext.element.name === 'icon'
    }
  }
}
</script>

<style lang="stylus" scoped>
.column-group
  display flex

.group__item
  display flex
  flex-direction column
  background rgba(black, .05)
  padding 5px
  border-radius 5px
  border 1px solid rgba(black, .05)
  &:not(.center)
    flex 1
  &:not(:last-child)
    margin-right 5px
  > span
    margin-bottom 10px
    text-align center
  &.icon
    border 1px solid rgba(red, .05)
    &[draggable="true"]
      background rgba(red, .05)
    span
      cursor move
</style>
