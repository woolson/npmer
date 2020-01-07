<template lang="pug">
common-list(
  :showSearch="false"
  :data="list"
  :total="total"
  :updateData="fetchData"
)
  template(v-slot="itemData")
    badge-item(
      :data="itemData"
      :canLike="false"
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
      title: this.$t('base.liked') + ' | NPMer'
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
    async fetchData (param) {
      this.$router.push({
        path: this.$route.fullPath,
        query: { page: param.pageNum }
      })
      const resData = await axios({
        url: '/npmer/api/account/like/badge',
        params: {
          pageNum: param.pageNum,
          pageSize: param.pageSize,
          keyword: param.keyword
        }
      })
      this.list = resData.data.map(item => item.badge)
      this.total = resData.total
    }
  }
}
</script>
