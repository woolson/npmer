<template lang="pug">
div.user__star
  el-pagination(
    background
    :hide-on-single-page="true"
    layout="prev, pager, next"
    :page-size="pageSize"
    :total="totalNum"
    :current-page="pageNum"
    @current-change="pageNum = $event"
  )
  badge-list(
    :data="data"
    :loading="loading"
  )
    template(v-slot="itemData")
      badge-item(
        :data="itemData.item"
        :canLike="false"
      )
  el-pagination(
    background
    :hide-on-single-page="true"
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
import BadgeItem from '~/components/market/badge-item.vue'

export default {
  head () {
    return {
      title: this.$t('base.uploaded') + ' | NPMer'
    }
  },

  components: {
    BadgeList,
    BadgeItem
  },

  data () {
    return {
      pageNum: 1,
      pageSize: 50,
      totalNum: 0,
      data: [],
      loading: false
    }
  },

  watch: {
    pageNum: 'fetchData'
  },

  mounted () {
    this.fetchData()
  },

  methods: {
    async fetchData () {
      try {
        this.loading = true
        const resData = await axios({
          url: '/npmer/api/account/badge',
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            keyword: this.keyword
          }
        })
        this.loading = false
        this.data = resData.data
        this.totalNum = resData.total
      } catch {
        this.loading = false
      }
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
  background var(--background-color)
  box-sizing border-box
</style>
