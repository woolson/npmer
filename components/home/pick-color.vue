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
    textDefault: {
      type: String,
      default: '#FFFFFF'
    },
    background: {
      type: String,
      default: ''
    },
    backgroundDefault: {
      type: String,
      default: '#555555'
    }
  },

  data () {
    return {
      textColor: this.text,
      bgColor: this.background
    }
  },

  watch: {
    textColor (newValue) {
      if (!newValue) {
        this.textColor = newValue = this.textDefault
      }
      this.$emit('update:text', newValue)
    },
    bgColor (newValue) {
      if (!newValue) {
        this.bgColor = newValue = this.backgroundDefault
      }
      this.$emit('update:background', newValue)
    },
    text () {
      this.textColor = this.text
    },
    background () {
      this.bgColor = this.background
    }
  }
}
</script>
