<template lang="pug">
div.options__row
  el-form-item.options__color(:label="textTitle")
    color-pick(
      v-model="textColor"
      :colors="['#FFFFFF', '#444']"
    )
  el-form-item.options__color(:label="backgroundTitle")
    color-pick(
      v-model="bgColor"
      :colors="['#555555', ...colors]")
</template>

<script>
import ColorPick from '~/components/color-pick.vue'

export default {
  components: {
    ColorPick
  },

  props: {
    textTitle: {
      type: String,
      default: ''
    },
    backgroundTitle: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      textColor: this.text,
      bgColor: this.background
    }
  },

  watch: {
    textColor () {
      this.$emit('update:text', this.textColor)
    },
    bgColor () {
      this.$emit('update:background', this.bgColor)
    }
  }
}
</script>
