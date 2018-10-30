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
    path(fill="#555555" :d="leftPathD")
    path(:fill="bgColor" :d="rightPathD")
    path(v-if="gradient" fill="url(#b)" :d="bgPathD")
  g
    path(
      id="icon"
      :d="iconPath"
      :transform="'scale(' + iconScale + ')'"
      fill="#FFFFFF"
      transform-origin="5px 3px 0px"
    )
  g(
    fill="#fff"
    text-anchor="middle"
    font-family="DejaVu Sans,Verdana,Geneva,sans-serif"
    font-size="12"
  )
    text(
      :x="leftWidth / 2 + iconWidth" y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{leftText}}
    text(
      :x="leftWidth / 2 + iconWidth" y="14"
    ) {{leftText}}
    text(
      :x="leftWidth + rightWidth / 2 + iconWidth" y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{rightText}}
    text(
      :x="leftWidth + rightWidth / 2 + iconWidth" y="14"
    ) {{rightText}}
</template>

<script>
export default {
  name: 'TagSvg',

  props: {
    leftText: String,
    leftWidth: Number,
    leftColor: String,
    rightText: String,
    rightWidth: Number,
    bgColor: String,
    roundedAngle: Boolean,
    gradient: Boolean,
    textShadow: Boolean,
    iconScale: Number,
    iconPath: String,
  },

  data: () => ({
    iconWidth: 15,
  }),

  watch: {
    iconPath: {
      handler(newValue) {
        this.iconWidth = newValue ? 15 : 0
      },
      immediate: true,
    },
  },

  computed: {
    leftPathD() {
      return `M0 0h${this.leftWidth + this.iconWidth}v20H0z`;
    },
    rightPathD() {
      return `M${this.leftWidth + this.iconWidth} 0h${this.rightWidth}v20H${this.leftWidth + this.iconWidth}z`;
    },
    bgPathD() {
      return `M0 0h${this.width}v20H0z`;
    },
    width() {
      return this.leftWidth + this.rightWidth + this.iconWidth;
    },
  },
};
</script>
