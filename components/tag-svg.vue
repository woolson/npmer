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
  clipPath(v-if="roundedAngle" id="a" )
    rect(:width="lWidth + rWidth" height="20" rx="3" fill="#fff")
  g(:clip-path="roundedAngle ? 'url(#a)' : ''")
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
      :x="padding + lIconWidth"
      y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{leftText}}
    text(
      :x="padding + lIconWidth"
      :fill="leftTextColor"
      y="14"
    ) {{leftText}}
    text(
      :x="lWidth + padding + rIconWidth"
      y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{rightText}}
    text(
      :x="lWidth + padding + rIconWidth"
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
    roundedAngle: {
      type: Boolean,
      default: false
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
    iconPath: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    },
    iconPosition: {
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
    }
  },

  data: () => ({
    iconWidth: 0,
    padding: 7
  }),

  computed: {
    /** 左边文字宽度 */
    lTextWidth () {
      return strWidth(this.leftText, { font: 'Verdana', size: 12 })
    },
    /** 右边文字宽度 */
    rTextWidth () {
      return strWidth(this.rightText, { font: 'Verdana', size: 12 })
    },
    lIconWidth () {
      return this.iconPosition === 'left' ? this.iconWidth + 3 : 0
    },
    rIconWidth () {
      return this.iconPosition === 'right' ? this.iconWidth + 3 : 0
    },
    /** 左边区域 */
    lWidth () {
      /** 左边区域宽度 */
      return this.padding + this.lIconWidth + this.lTextWidth + this.padding
    },
    rWidth () {
      return this.padding + this.rIconWidth + this.rTextWidth + this.padding
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
      const x = this.iconPosition === 'left'
        ? this.iconX + 2
        : this.lWidth + this.padding
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
    iconPath: {
      async handler () {
        await this.$nextTick()
        if (!this.$refs.icon) { return }

        const { height, width } = this.$refs.icon.getBBox()
        const scale = 13 / height
        this.iconWidth = width * scale
        this.$emit('update:iconScale', scale || 1)
      },
      immediate: true
    }
  }
}
</script>
