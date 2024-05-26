<template>
  <div
    class="PictureComparison"
    :style="'width:' + width + 'px;height:' + height + 'px'"
  >
    <div class="before-image" :style="'width:' + data.x + 'px'" @click.stop="goLeft">
      <div :style="'width:' + width + 'px;height:' + height + 'px'">
        <slot name="left"></slot>
      </div>
    </div>
    <div class="after-image" @click.stop="goRight">
      <div :style="'width:' + width + 'px;height:' + height + 'px'">
        <slot name="right"></slot>
      </div>
    </div>
    <div
      class="divider-bar"
      :style="'left:' + data.x + 'px'"
      @mousedown.prevent="onmouseDown"
    ></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    width: { type: String, default: "500" },
    height: { type: String, default: "300" },
});
const data = reactive({
    isDown: false, //鼠标是否正按住
    moveX: 0, //鼠标移动的位置
    x: Number(props.width) / 2, //设置位置
});
// console.log(data.x);
const onmouseDown = (event: MouseEvent) => {
    data.isDown = true;
    data.x = (event.target as HTMLElement).offsetLeft;
    var disX = event.clientX - (event.target as HTMLElement).offsetLeft;
    document.onmousemove = function (event) {
        if (data.isDown == false) {
            return;
        }
        data.x = event.clientX - disX;
        if (data.x >= Number(props.width)) {
            data.x = Number(props.width);
        } else if (data.x <= 0) {
            data.x = 0;
        }
    };
    document.onmouseup = function () {
        data.isDown = false;
        document.onmousemove = document.onmouseup = null;
        return false;
    };
};

const goLeft = () => {
    data.x = 0;
};
const goRight = () => {
    data.x = Number(props.width);
};
</script>


<style  scoped>
.PictureComparison {
    position: relative;
    display: inline-block;
    margin: 0 auto;
    min-height: 273px;
    margin-bottom: 40px;
    overflow: hidden;

    .before-image {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 50%;
        overflow: hidden;
    }

    .after-image {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
    }

    .divider-bar {
        cursor: move;
        position: absolute;
        width: 3px;
        left: 50%;
        top: 0px;
        background: white;
        height: 100%;
        display: block;
        z-index: 30;
        -webkit-box-shadow: 0px 0px 12px rgba(51, 51, 51, 0.5);
        box-shadow: 0px 0px 12px rgba(51, 51, 51, 0.5);
        content: "";
        &::after {
            content: "<  >";
            font-weight: 900;
            font-size: 14px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-direction: row;
            flex-direction: row;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            height: 38px;
            width: 38px;
            position: absolute;
            /* left: 50%; */
            top: 50%;
            margin-left: -21px;
            margin-top: -19px;
            border: 3px solid white;
            border-radius: 1000px;
            -webkit-box-shadow: 0px 0px 12px rgba(51, 51, 51, 0.5);
            box-shadow: 0px 0px 12px rgba(51, 51, 51, 0.5);
            z-index: 40;
            cursor: pointer;
            color: #fff;
        }
    }
}
</style>
