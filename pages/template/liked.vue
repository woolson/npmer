<template lang="pug">
common-list(
  :showSearch="false"
  :data="list"
  :total="total"
  :updateData="fetchData"
)
  template(v-slot="itemData")
    template-item(
      items="use"
      :data="itemData"
      :canLike="false"
      @use="updateState({templateUseVisible: true, templateData: itemData})"
    )
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import axios from '~/plugins/axios'
import CommonList from '~/components/common-list.vue'
import TemplateItem from '~/components/template/template-item.vue'

export default {
  head () {
    return {
      title: this.$t('base.liked') + ' | NPMer'
    }
  },

  components: {
    CommonList,
    TemplateItem
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
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    async fetchData (param) {
      this.$router.push({
        path: this.$route.fullPath,
        query: { page: param.pageNum }
      })
      const resData = await axios({
        url: '/npmer/api/account/like/template',
        params: {
          pageNum: param.pageNum,
          pageSize: param.pageSize,
          keyword: param.keyword
        }
      })
      this.list = resData.data.map(item => item.template)
      this.total = resData.total
    }
  }
}
</script>
