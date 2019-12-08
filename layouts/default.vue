<template lang="pug">
div.body
  npmer-head
  nuxt(keep-alive)
</template>

<script>
import NpmerHead from '~/components/npmer-head.vue'

export default {
  components: {
    NpmerHead
  }
}
</script>

<style lang="stylus">
html
  font-family 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif
  font-size 16px
  word-spacing 1px
  -ms-text-size-adjust 100%
  -webkit-text-size-adjust 100%
  -moz-osx-font-smoothing grayscale
  -webkit-font-smoothing antialiased
  box-sizing border-box
</style>
