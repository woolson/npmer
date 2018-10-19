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
    path(:fill="leftColor" :d="leftPathD")
    path(:fill="rightColor" :d="rightPathD")
    path(v-if="gradient" fill="url(#b)" :d="bgPathD")
  g(
    fill="#fff"
    text-anchor="middle"
    font-family="DejaVu Sans,Verdana,Geneva,sans-serif"
    font-size="120"
  )
    text(
      :x="leftWidth * 5" y="150"
      fill="#010101"
      fill-opacity=".3"
      transform="scale(.1)"
    ) {{leftText}}
    text(
      :x="leftWidth * 5" y="140"
      transform="scale(.1)"
    ) {{leftText}}
    text(
      :x="leftWidth * 10 + rightWidth * 5" y="150"
      fill="#010101"
      fill-opacity=".3"
      transform="scale(.1)"
    ) {{rightText}}
    text(
      :x="leftWidth * 10 + rightWidth * 5" y="140"
      transform="scale(.1)"
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
    rightColor: String,
    roundedAngle: Boolean,
    gradient: Boolean,
  },

  computed: {
    leftPathD() {
      return `M0 0h${this.leftWidth}v20H0z`;
    },
    rightPathD() {
      return `M${this.leftWidth} 0h${this.rightWidth}v20H${this.leftWidth}z`;
    },
    bgPathD() {
      return `M0 0h${this.width}v20H0z`;
    },
    width() {
      return this.leftWidth + this.rightWidth;
    },
  },
};
</script>
