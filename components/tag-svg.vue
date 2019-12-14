<template lang="pug">
svg(
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  height="20"
  :width="width"
)
  linearGradient(id="b" x2="0" y2="100%")
    stop(offset="0" stop-color="#bbb" stop-opacity=".1")
    stop(offset="1" stop-opacity=".1")
  clipPath(v-if="roundedAngle" id="a")
    rect(:width="width" height="20" rx="3" fill="#fff")
  g(:clip-path="roundedAngle ? 'url(#a)' : ''")
    path(:fill="leftBgColor" :d="leftPathD")
    path(:fill="rightBgColor" :d="rightPathD")
    path(v-if="gradient" fill="url(#b)" :d="bgPathD")
  g
    path(
      v-if="textShadow"
      id="icon"
      :d="iconPath"
      fill="#010101"
      fill-opacity=".3"
      :style="iconShadowStyle"
    )
    path(
      ref="icon"
      id="icon"
      :d="iconPath"
      :fill="iconColor"
      :style="iconStyle"
    )
  g(
    fill="#fff"
    text-anchor="middle"
    font-family="DejaVu Sans,Verdana,Geneva,sans-serif"
    font-size="12"
  )
    text(
      :x="leftWidth / 2 + (leftIcon ? iconWidth : 0)"
      y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{leftText}}
    text(
      :x="leftWidth / 2 + (leftIcon ? iconWidth : 0)"
      :fill="leftTextColor"
      y="14"
    ) {{leftText}}
    text(
      :x="+leftWidth + rightWidth / 2 + iconWidth"
      y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{rightText}}
    text(
      :x="+leftWidth + rightWidth / 2 + iconWidth"
      :fill="rightTextColor"
      y="14"
    ) {{rightText}}
</template>

<script>
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
    leftWidth: {
      type: Number,
      default: 0
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
    rightWidth: {
      type: Number,
      default: 0
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
    iconWidth: 15
  }),

  computed: {
    leftIcon () {
      return this.iconPosition === 'left'
    },
    leftPathD () {
      return `M0 0h${this.leftWidth + (this.leftIcon ? this.iconWidth : 0)}v20H0z`
    },
    rightPathD () {
      const leftPosition = this.leftWidth + (this.leftIcon ? this.iconWidth : 0)
      const rightPosition = this.rightWidth + (this.leftIcon ? 0 : this.iconWidth)
      return `M${leftPosition} 0h${rightPosition}v20H${leftPosition}z`
    },
    bgPathD () {
      return `M0 0h${this.width}v20H0z`
    },
    width () {
      return this.leftWidth + this.rightWidth + this.iconWidth
    },
    iconStyle () {
      return {
        transform: `scale(${this.iconScale})`,
        transformOrigin: `${+this.iconX + (this.leftIcon ? 0 : this.leftWidth)}px ${this.iconY}px 0px`
      }
    },
    iconShadowStyle () {
      return {
        transform: `scale(${this.iconScale})`,
        transformOrigin: `${+this.iconX + (this.leftIcon ? 0 : this.leftWidth)}px ${+this.iconY + 1}px 0px`
      }
    }
  },

  watch: {
    iconPath: {
      handler (newValue) {
        if (newValue) { this.iconWidth = this.leftText ? 15 : 10 } else { this.iconWidth = 0 }
        this.$nextTick(() => {
          const { height } = this.$refs.icon.getBBox()
          this.$emit('update:iconScale', +(13 / height) || 1)
        })
      },
      immediate: true
    },
    leftText (newValue) {
      if (this.iconWidth) { this.iconWidth = newValue ? 15 : 10 } else { this.iconWidth = 0 }
    }
  }
}
</script>
