<template lang="pug">
div.user__star
  badge-list(:data="data" :canLike="false")
  el-pagination(
    background
    layout="prev, pager, next"
    :page-size="pageSize"
    :total="totalNum"
    :current-page="pageNum"
    @current-change="pageNum = $event"
  )
</template>

<script>
import axios from '~/plugins/axios'
import BadgeList from '~/components/badge-list.vue'

export default {
  components: {
    BadgeList
  },

  data () {
    return {
      pageNum: 1,
      pageSize: 50,
      totalNum: 0,
      data: []
    }
  },

  mounted () {
    this.fetchData()
  },

  methods: {
    async fetchData () {
      const resData = await axios({
        url: '/npmer/api/account/star',
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          keyword: this.keyword
        }
      })
      this.data = resData.data.map(item => item.badge)
      this.totalNum = resData.total
    }
  }
}
</script>

<style lang="stylus" scoped>
.user__star
  display flex
  flex-direction column
  align-items center
  padding 100px 50px 50px
  background $background-color
  box-sizing border-box
</style>
