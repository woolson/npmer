<template lang="pug">
common-list(
  :showSearch="true"
  :data="list"
  :total="total"
  :updateData="fetchData"
)
  template(v-slot="itemData")
    badge-item(
      :data="itemData"
      :canLike="true"
      @like="like(itemData)"
    )
</template>

<script>
import { mapState } from 'vuex'
import axios from '~/plugins/axios'
import CommonList from '~/components/common-list.vue'
import BadgeItem from '~/components/market/badge-item.vue'

export default {
  head () {
    return {
      title: this.$t('base.badge') + ' | NPMer'
    }
  },

  components: {
    CommonList,
    BadgeItem
  },

  data () {
    return {
      list: [],
      total: 0
    }
  },

  computed: {
    ...mapState(['account'])
  },

  methods: {
    /** 请求数据 */
    async fetchData (param) {
      this.$router.push({
        path: this.$route.fullPath,
        query: { page: param.pageNum }
      })
      const data = await axios({
        url: '/npmer/api/badge',
        params: {
          pageNum: param.pageNum,
          pageSize: param.pageSize,
          keyword: param.keyword
        }
      })
      this.list = data.data
      this.total = data.total
    },
    /** 喜欢图标 */
    async like (badge) {
      try {
        if (!this.account) {
          this.$message.error(this.$t('message.shouldLogin'))
          return
        }
        const index = this.list.findIndex((o) => {
          return o.id === badge.id
        })
        if (badge.stared) { return }
        await axios({
          url: '/npmer/api/badge/like',
          method: 'POST',
          data: { badgeId: badge.id }
        })
        badge.likes += 1
        badge.liked = true
        this.$set(this.list, index, badge)
        this.$message.success(this.$t('base.success'))
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }
}
</script>
