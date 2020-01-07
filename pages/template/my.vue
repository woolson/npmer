<template lang="pug">
common-list(
  :showSearch="false"
  :data="list"
  :total="total"
  :updateData="fetchData"
)
  template(v-slot="itemData")
    template-item(
      items="share,edit,use"
      :data="itemData"
      @use="updateState({templateUseVisible: true, templateData: itemData})"
      @share="shareTemplate(itemData)"
      @edit="editTemplate(itemData)"
    )
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import axios from '~/plugins/axios'
import CommonList from '~/components/common-list.vue'
import TemplateUse from '~/components/template/template-use.vue'
import TemplateItem from '~/components/template/template-item.vue'

export default {
  head () {
    return {
      title: this.$t('myTemplate') + ' | NPMer'
    }
  },

  components: {
    CommonList,
    TemplateUse,
    TemplateItem
  },

  data () {
    const templateId = this.$route.query.id
    const template = {}
    if (templateId) {
      template.id = templateId
    }
    return {
      list: [],
      total: 0,
      templateUseVisible: false,
      currentTemplate: template
    }
  },

  computed: {
    ...mapState(['account'])
  },

  watch: {
    $route: {
      handler () {
        if (this.$route.query.id) {
          this.currentTemplate = {
            id: this.$route.query.id
          }
          this.templateUseVisible = true
        }
      },
      deep: true
    },
    templateUseVisible (newValue) {
      const { id, page } = this.$route.query
      if (id) {
        this.$router.replace({
          path: this.$route.path,
          query: { page }
        })
      }
    }
  },

  methods: {
    ...mapMutations({
      updateState: 'UPDATE_STATE'
    }),
    /** 请求数据 */
    async fetchData (param) {
      this.$router.push({
        path: this.$route.fullPath,
        query: { page: param.pageNum }
      })
      const data = await axios({
        url: '/npmer/api/account/template',
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
          url: '/npmer/api/badge/star',
          method: 'POST',
          data: { badgeId: badge.id }
        })
        badge.stars += 1
        badge.stared = true
        this.$set(this.list, index, badge)
        this.$message.success(this.$t('base.success'))
      } catch (err) {
        this.$message.error(err.message)
      }
    },
    editTemplate (data) {
      localStorage.setItem('template-edit', JSON.stringify(data))
      this.$router.push('/')
    },
    async shareTemplate (data) {
      try {
        await axios({
          method: 'PUT',
          url: `/npmer/api/template/${data.id}`,
          data: { shared: true }
        })
        this.$message.success(this.$t('base.success'))
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.template
  background var(--background-color)
</style>
