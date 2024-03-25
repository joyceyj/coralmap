<template>
    
    <div class="image-container">
        <el-upload 
            class="upload-image"
            action="#" 
            list-type="picture-card" 
            :auto-upload="false"
        >
            <el-icon><Plus /></el-icon>

            <template #file="{ file }">
            <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                >
                    <el-icon><Download /></el-icon>
                </span>
                <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                >
                    <el-icon><Delete /></el-icon>
                </span>
                </span>
            </div>
            </template>
        </el-upload>


        <el-image class="result-image">
            <template #error>
                <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                </div>
            </template>

        </el-image>
    </div>
    <div class="image-tool">
        <div>
            <el-button class="run-btn">Run</el-button>
        </div>
        <div class="result-tool">
            <el-button class="download-btn">Download</el-button>
            <el-button class="edit-btn">Edit</el-button>
        </div>
    </div>

    
</template>
  
<script lang="ts" setup>
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'

import type { UploadFile } from 'element-plus'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}

</script>

<style>
.image-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 75%;
}
.upload-image {
    width: 32vw;
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    background-color: white;
    padding: 5%;
    /* height: 100vh; */
}

.result-image {
    padding: 30px 0;
    text-align: center;
    display: inline-block;
    width: 40vw;
    border: 1px black;
    border-radius: 8px;
    box-sizing: border-box;
    vertical-align: top;
    background-color: white;
    /* box-shadow:0 2px 12px 0 rgba(0,0,0,0.1); */
    box-shadow: var(--el-box-shadow-light);
}
.image-container .el-image {
  padding: 0 5px;
  /* max-width: 300px;
  max-height: 200px;
  width: 100%;
  height: 200px; */
}

.image-tool {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 10%;
    margin-top: 5%;
}
.run-btn {
    width: 40vw;
}
.result-tool {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 40vw;
}
.download-btn {
    width: 40vw;
}
.edit-btn {
    width: 40vw;
}
</style>




  