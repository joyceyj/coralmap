<template>
    <div class="home-logo">
        <el-image style="width:60px;height:50px;padding:5px 5px 0 5px;border-radius: 16px;background-color: white;" :src="logoUrl"></el-image>
        <p>Coral<br>SCOP</p>
    </div>

    <el-container>
        <el-image class="background"  :src="mainBgUrl" ></el-image>
        <div class="homepage-intro">
            <div class="intro-text">
                <p>CoralSCOP</p>
            </div>
            <div class="intro-text">
                <p>Segment any COral Image on this Planet</p>
            </div>
            <div class="describe-text">
                <p>The first foundation model that can segment dense coral reef automatically and has strong generalization ability to project the full image of coral reef. </p>
            </div>
            <button class='model-btn basic-btn' @click="routeToTryModel">Try for Free</button>
        </div>

        <div class="map-view">
            <Map></Map>
        </div>
        

    </el-container>
</template>

<script lang="ts" setup>
import mainBgUrl from '@/assets/P8093252.png'
import logoUrl from '@/assets/coral_logo.png'

import { useRouter } from 'vue-router';
const { push } = useRouter();

const routeToTryModel = () => {
    console.log('turn to model page');
    push('/newImage');
};

</script>

<style scoped>
/* 手动配置全局样式 */
html,
body,
.el-container {
  padding: 0;
  margin: 0;
  height: auto;
  width: 100vw;
  display: block;
  background-color: #FAFAFA;
}
.background {
    display: flex;
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
}
.home-logo {
    position: absolute;
    top: 0;
    left: 40px;
    margin:0;
    padding:0;
    background-color: white;
    border-radius: 8px;
    z-index: 800;
    p {
        margin: 0;
        padding: 0;
        font-family: MarkerFelt;
        font-weight: bold;
        font-size: 20px;
    }
}
.homepage-intro {
    position: absolute;
    top: 10vh;
    left: 10vw;
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    flex-wrap: wrap;
    flex-grow: 1;
    gap: 30px;
    margin: 0;
    align-items: start;
    text-align: left;
    color: white;
}
.intro-text {
    font-size: 60px;
    font-weight: 900;
    margin: 0;
    padding: 0;
    width: 50vw;
    font-family: SourceHanSansCN-Bold;
    p {
        margin: 0;
    }
}
.describe-text {
    font-size: 20px;
    width: 56vw;
    margin-top: 15px;
    p {
        margin: 0;
    }
}
.basic-btn {
    color: white;
    padding: 0.7em 1.7em;
    font-size: 18px;
    border-radius: 0.5em;
    background: #139FE1;
    cursor: pointer;
    border: 1px solid #70B4D5;
    transition: all 0.3s;
    /* box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff; */
}
.basic-btn:hover {
    transform: scale(1.05);
    border: 1px solid white;
}
.basic-btn:active {
  box-shadow: 4px 4px 12px #c5c5c5, -4px -4px 12px #ffffff;
}
.model-btn {
    width: 180px;
}
.map-view {
    display: flex;
    flex-direction: column;
    padding: 24px;
    margin-left: 100px;
    margin-right: 100px;
    text-align: center;
}
</style>
