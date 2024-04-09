<template>
    <el-row class="tac">
        <el-col >
            <!-- <h5 class="mb-2">Custom colors</h5> -->
            <el-menu
            active-text-color="#7020FF"
            class="el-menu-vertical-demo"
            default-active="1"
            
            @open="handleOpen"
            @close="handleClose">

                <el-menu-item index="1">
                    <el-icon><Location /></el-icon>
                    <RouterLink to="/map">Coral Map</RouterLink>
                </el-menu-item>

                <el-menu-item index="2">
                    <el-icon><Camera /></el-icon>
                    <RouterLink to="/newImage">New Image</RouterLink>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
    import {
        Location,
        Camera,
    } from '@element-plus/icons-vue'
    const handleOpen = (key: string, keyPath: string[]) => {
        console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
        console.log(key, keyPath)
    }
</script>

<style>
.tac {
    top: 30%;
    /* border-right: 0px; */
}
.el-menu-vertical-demo {
    min-height: 100%;
    max-height: 100%;
    /* width: 100vw; */
    /* height: 100vh; */

    box-sizing: border-box;
    border-right: 0px;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* top: 50%; */

    /* background-image: linear-gradient(to bottom, #001529ee, #001529);     */
    /* background-color:"#545c64"; */
    /* color: gray; */
    color: gray;
}
</style>
  