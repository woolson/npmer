<template lang="pug">
el-dialog.icon-market(
  :title="$t('selectIcon')"
  :visible="value"
  :lock-scroll="true"
  @close="$emit('input', false)"
)
  el-input(
    v-model="searchStr"
    clearable
    :placeholder="$t('search')"
    @keypress.native.13="pageNum = 1; fetchIcon()")
  i.iconfont.icon-empty(v-if="!icons.length")
  ul.icon-market__list
    li.list__item(
      v-for="icon in icons"
      v-if="!itemInvalid(icon)"
    )
      div.item__icon(v-html="icon.file")
      div.item__info
        span {{icon.name}}
        span(@click="$emit('change', icon.svg)") {{$t('select')}}
    li.list__item.item__disable(v-else) {{$t('invalid')}}
  el-pagination(
    background
    :hide-on-single-page="true"
    layout="prev, pager, next"
    :page-size="pageSize"
    :total="total"
    :current-page="pageNum"
    @current-change="pageNum = $event"
  )
</template>

<script>
import axios from 'axios'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      searchStr: '',
      pageNum: 1,
      pageSize: 20,
      total: 0,
      icons: []
    }
  },

  watch: {
    pageNum: 'fetchIcon'
  },

  mounted () {
    this.fetchIcon()
  },

  methods: {
    itemInvalid (icon) {
      return icon.svg.includes('|') || !icon.svg
    },
    async fetchIcon () {
      if (!this.searchStr) { return }

      this.$nuxt.$loading.start()
      const {
        data: resData
      } = await axios({
        url: '/npmer/api/icon/iconfont',
        params: {
          search: this.searchStr,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          collection: this.collection ? 1 : -1
        }
      })
      this.icons = resData.data.icons
      this.total = resData.data.count
      this.$nuxt.$loading.finish()
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon-market >>> .el-dialog__body
  display flex
  flex-direction column
  align-items center
  .el-input
    width 250px

.icon-empty
  font-size 100px
  color darken($background-color, 5)
  margin-top 50px

.icon-market__list
  width 100%
  margin 20px 0
  display grid
  grid-template-columns repeat(5, 1fr)

.list__item
  display flex
  flex-direction column
  align-items center
  padding 10px
  position relative
  &:hover .item__info span:first-child
    margin-left -100%
  .item__icon
    width 50px
    height 50px
    font-size 36px
    text-align center
    svg
      width 100%
    >>> path
      fill $color-text
  .item__info
    display flex
    overflow hidden
    span
      text-align center
      width 100%
      flex-shrink 0
      margin-left 0
      transition all 0.3s
      &:last-child
        color $color-main
        cursor pointer
        font-weight bold
      &.disable
        color $color-border
        cursor not-allowed
  &.item__disable
    align-items center
    justify-content center
    cursor not-allowed
    color #cccccc
</style>
