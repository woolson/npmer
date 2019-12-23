<template lang="pug">
el-dialog.icon(title="收货地址" :visible="true")
  el-input(
    v-model="searchStr"
    placeholder="search"
    @keypress.native.13="fetchIcon")
  ul.icon-list
    li(v-for="icon in icons" v-html="icon.show_svg")
</template>

<script>
import axios from 'axios'
import { parseCookie } from '~/plugins/utils'

export default {
  data () {
    return {
      searchStr: '',
      icons: []
    }
  },

  mounted () {
    this.fetchIcon()
  },

  methods: {
    async fetchIcon () {
      const { headers } = await axios({
        url: '/search/index?q=flight',
        withCredentials: false
      })
      console.log(headers)

      const cookie = parseCookie(headers['set-cookie'] || [])
      const res = await axios({
        method: 'POST',
        url: '/api/icon/search.json',
        headers: {
          cookie: Object.keys(cookie).map(o => `${o}=${cookie[o].value}`).join(';'),
          'x-csrf-token': cookie.ctoken.value
        },
        body: {
          q: 'flight',
          sortType: 'updated_at',
          page: 1,
          pageSize: 3,
          fromCollection: 1,
          fills: 0,
          t: Date.now(),
          ctoken: cookie.ctoken.value
        }
      })
      this.icons = res.data.data.icons
    }
  }
}
</script>
