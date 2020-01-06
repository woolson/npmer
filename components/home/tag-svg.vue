<template lang="pug">
svg(
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  height="20"
  :width="lWidth + rWidth"
)
  linearGradient(
    v-if="gradient"
    id="b" x2="0" y2="100%"
  )
    stop(offset="0" stop-color="#bbb" stop-opacity=".1")
    stop(offset="1" stop-opacity=".1")
  clipPath(v-if="angle !== 'square'" id="a" )
    rect(
      height="20" fill="#fff"
      :width="lWidth + rWidth"
      :rx="angle === 'circle' ? 10 : 3"
    )
  g(:clip-path="angle !== 'square' ? 'url(#a)' : ''")
    path(:fill="leftBgColor" :d="lPathD")
    path(:fill="rightBgColor" :d="rPathD")
    path(v-if="gradient" fill="url(#b)" :d="bgPathD")
  g(v-if="textShadow || iconPath")
    path(
      v-if="textShadow"
      id="icon"
      :d="iconPath"
      fill="#010101"
      fill-opacity=".3"
      :style="iconShadowStyle"
    )
    path(
      v-if="iconPath"
      ref="icon"
      id="icon"
      :d="iconPath"
      :fill="iconColor"
      :style="iconStyle"
    )
  g(
    fill="#fff"
    font-family="Verdana,sans-serif"
    font-size="12"
  )
    text(
      :x="lTextX"
      y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{leftText}}
    text(
      :x="lTextX"
      :fill="leftTextColor"
      y="14"
    ) {{leftText}}
    text(
      :x="rTextX"
      y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{rightText}}
    text(
      :x="rTextX"
      :fill="rightTextColor"
      y="14"
    ) {{rightText}}
</template>

<script>
import strWidth from 'string-pixel-width'

export default {
  name: 'TagSvg',

  props: {
    leftText: {
      type: String,
      default: ''
    },
    leftTextColor: {
      type: String,
      default: ''
    },
    leftBgColor: {
      type: String,
      default: ''
    },
    rightText: {
      type: String,
      default: ''
    },
    rightTextColor: {
      type: String,
      default: ''
    },
    rightBgColor: {
      type: String,
      default: ''
    },
    angle: {
      type: String,
      default: 'square',
      validator (value) {
        return ['square', 'circle', 'rounded'].includes(value)
      }
    },
    gradient: {
      type: Boolean,
      default: false
    },
    textShadow: {
      type: Boolean,
      default: false
    },
    iconScale: {
      type: [Number, String],
      default: ''
    },
    iconWidth: {
      type: Number,
      default: 0
    },
    iconPath: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    },
    iconX: {
      type: [Number, String],
      default: ''
    },
    iconY: {
      type: [Number, String],
      default: ''
    },
    sort: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    padding: 7,
    innerPadding: 7
  }),

  computed: {
    getSortName () {
      let items = [...this.sort]
      if (this.iconPath === '') {
        items = items.filter(item => item.name !== 'icon')
      }
      return items
        .reduce((p, n) => (p += n.name[0]), '')
        .toLowerCase()
    },
    iIndex () {
      return this.sort.findIndex(item => item.name === 'icon')
    },
    lIndex () {
      return this.sort.findIndex(item => item.name === 'left')
    },
    rIndex () {
      return this.sort.findIndex(item => item.name === 'right')
    },
    cIndex () {
      return this.sort.findIndex(item => item.name === 'center')
    },
    lTextWidth () {
      return +strWidth(this.leftText, { font: 'Verdana', size: 12 }).toFixed(0)
    },
    rTextWidth () {
      return +strWidth(this.rightText, { font: 'Verdana', size: 12 }).toFixed(0)
    },
    lIconWidth () {
      return this.iIndex < this.cIndex ? this.iconWidth : 0
    },
    rIconWidth () {
      return this.iIndex > this.cIndex ? this.iconWidth : 0
    },
    lWidth () {
      return this.padding + this.lIconWidth + this.lTextWidth + this.innerPadding
    },
    rWidth () {
      return this.padding + this.rIconWidth + this.rTextWidth + this.innerPadding
    },
    lTextX () {
      let result = this.padding
      if (this.iIndex < this.lIndex) {
        result += this.lIconWidth
      }
      return result
    },
    rTextX () {
      let result = this.lWidth + this.innerPadding
      if (this.iIndex > this.cIndex && this.iIndex < this.rIndex) {
        result += this.rIconWidth
      }
      return result
    },
    lPathD () {
      return `M0 0h${this.lWidth}v20H0z`
    },
    rPathD () {
      return `M${this.lWidth} 0h${this.rWidth}v20H${this.lWidth}z`
    },
    bgPathD () {
      return `M0 0h${this.lWidth + this.rWidth}v20H0z`
    },
    iconStyle () {
      let x = 0
      if (this.iIndex < this.cIndex) {
        if (this.iIndex < this.lIndex) {
          x += +this.iconX + this.padding - 5
        } else {
          x += +this.iconX + this.lTextX + this.lTextWidth
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.iIndex < this.rIndex) {
          x += +this.iconX + this.lWidth
        } else {
          x += +this.iconX + this.rTextX + this.rTextWidth
        }
      }
      return {
        transform: `scale(${this.iconScale})`,
        transformOrigin: `${x}px ${this.iconY}px 0px`
      }
    },
    iconShadowStyle () {
      const origin = this.iconStyle.transformOrigin
      return {
        transform: this.iconStyle.transform,
        transformOrigin: origin.replace(this.iconY + 'px', this.iconY + 1 + 'px')
      }
    }
  },

  watch: {
    angle (newValue) {
      this.padding = newValue === 'circle' ? 10 : 7
    },
    iconPath: {
      async handler () {
        await this.$nextTick()
        if (!this.$refs.icon) {
          this.$emit('update:iconWidth', 0)
          return
        }

        const { height, width } = this.$refs.icon.getBBox()
        const scale = 14 / height
        const iconWidth = +(width * scale + 3).toFixed(0)
        this.$emit('update:iconWidth', iconWidth)
        this.$emit('update:iconScale', scale || 1)
      },
      immediate: true
    }
  }
}
</script>
