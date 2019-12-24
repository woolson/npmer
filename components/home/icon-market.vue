<template lang="pug">
el-dialog.icon-market(
  title="Icon"
  :visible="value"
)
  el-input(
    v-model="searchStr"
    clearable
    :placeholder="$t('search')"
    @keypress.native.13="fetchIcon")
  ul.icon-market__list
    li.list__item(v-for="icon in icons")
      div.item__icon(v-html="icon.file")
      div.item__info
        span {{icon.name}}
        span(@click="$emit('change', icon.svg)") 使用
      div.item__disable(v-if="icon.svg.includes('|') || !icon.svg") 无效图标
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
  .item__disable
    position absolute
    top 0
    left 0
    height 100%
    width 100%
    background rgba(white, .8)
    backdrop-filter saturate(180%) blur(5px)
    display flex
    align-items center
    justify-content center
    font-weight bold
    cursor not-allowed
    color #cccccc
</style>
