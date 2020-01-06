<template lang="pug">
common-list(
  :showSearch="true"
  :data="list"
  :total="total"
  :updateData="fetchData"
)
  template(v-slot="itemData")
    template-item(
      items="use,like"
      :data="itemData"
      :canLike="true"
      @like="like(itemData)"
      @use="updateData({templateData: itemData, templateUseVisible: true})"
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
      title: this.$t('base.template') + ' | NPMer'
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
      updateData: 'UPDATE_STATE'
    }),
    /** 请求数据 */
    async fetchData (param) {
      this.$router.push({
        path: this.$route.fullPath,
        query: { page: param.pageNum }
      })
      const data = await axios({
        url: '/npmer/api/template',
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
    async like (template) {
      try {
        if (!this.account) {
          this.$message.error(this.$t('message.shouldLogin'))
          return
        }
        const index = this.list.findIndex((o) => {
          return o.id === template.id
        })
        if (template.stared) { return }
        await axios({
          url: '/npmer/api/template/like',
          method: 'POST',
          data: { templateId: template.id }
        })
        template.likes += 1
        template.liked = true
        this.$set(this.list, index, template)
        this.$message.success(this.$t('base.success'))
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }
}
</script>
