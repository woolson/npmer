<template lang="pug">
div.market
  el-input.market__search(
    v-model="keyword"
    clearable
    :placeholder="$t('base.search')"
    @keyup.native.13="pageNum = 1; fetchData()"
    @clear="pageNum = 1; fetchData()"
  )
  h1.market__title
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
        :canLike="itemData.canLike"
        @like="like(itemData.item)"
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
  //- npmer-foot
</template>

<script>
import { mapState } from 'vuex'
import axios from '~/plugins/axios'
import NpmerFoot from '~/components/npmer-foot.vue'
import BadgeList from '~/components/badge-list.vue'
import BadgeItem from '~/components/market/badge-item.vue'

export default {
  head () {
    return {
      title: this.$t('base.market') + ' | NPMer'
    }
  },

  components: {
    NpmerFoot,
    BadgeList,
    BadgeItem
  },

  data () {
    const pageNum = +this.$route.query.page || 1
    return {
      keyword: '',
      pageNum,
      pageSize: 50,
      totalNum: 0,
      data: [],
      loading: false
    }
  },

  computed: {
    ...mapState(['account'])
  },

  watch: {
    pageNum: {
      handler: 'fetchData',
      immediate: true
    }
  },

  methods: {
    async fetchData () {
      this.$router.push({
        path: this.$route.fullPath,
        query: { page: this.pageNum }
      })
      try {
        this.loading = true
        const resData = await axios({
          url: '/npmer/api/badge',
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            keyword: this.keyword
          }
        })
        this.loading = true
        this.data = resData.data
        this.totalNum = resData.total
      } catch {
        this.loading = false
      }
    },
    async like (badge) {
      try {
        if (!this.account) {
          this.$message.error(this.$t('message.shouldLogin'))
          return
        }
        const index = this.data.findIndex(o => o.id === badge.id)
        if (badge.stared) { return }
        await axios({
          url: '/npmer/api/badge/star',
          method: 'POST',
          data: { badgeId: badge.id }
        })
        badge.stars += 1
        badge.stared = true
        this.$set(this.data, index, badge)
        this.$message.success(this.$t('success'))
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.market
  display flex
  flex-direction column
  align-items center
  padding 0 50px 50px
  background var(--background-color)

.market__search
  max-width 600px
  width 100%
  margin 100px 20px 0 20px
  font-size 16px
  >>> input
    text-align center

.market__title
  width 100%
  margin-top 30px
  font-size 24px
  font-weight bold
  border-bottom 1px solid var(--border-color)
  line-height 50px

</style>
