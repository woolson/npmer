<template lang="pug">
div.template
  badge-list(:data="data")
    template(v-slot="itemData")
      template-item(
        :data="itemData.item"
        @use="currentTemplate = itemData.item; templateUseVisible = true"
      )
  template-use(
    v-model="templateUseVisible"
    :templateId="currentTemplate.id"
  )
</template>

<script>
import axios from '~/plugins/axios'
import BadgeList from '~/components/badge-list.vue'
import TemplateItem from '~/components/template/template-item.vue'
import TemplateUse from '~/components/template/template-use.vue'

export default {
  head () {
    return {
      title: this.$t('base.template') + ' | NPMer'
    }
  },

  components: {
    BadgeList,
    TemplateItem,
    TemplateUse
  },

  data () {
    const pageNum = +this.$route.query.page || 1
    const templateId = this.$route.query.id
    const template = {}
    if (templateId) {
      template.id = templateId
    }
    return {
      keyword: '',
      pageNum,
      pageSize: 50,
      totalNum: 0,
      data: [],
      loading: false,
      currentTemplate: template,
      templateUseVisible: !!templateId
    }
  },

  watch: {
    pageNum: {
      handler: 'fetchData',
      immediate: true
    },
    $route: {
      handler () {
        if (this.$route.query.id) {
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
    async fetchData () {
      const resData = await axios({
        url: '/npmer/api/account/template',
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      })
      this.data = resData.data
      this.totalNum = resData.total
    }
  }
}
</script>

<style lang="stylus" scoped>
.template
  display flex
  flex-direction column
  align-items center
  padding 100px 50px 50px
  background var(--background-color)
</style>
