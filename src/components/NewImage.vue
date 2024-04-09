<template>
    
    <div class="model-container">
        <div class="model-setting">
            <div class="upload-container" >
                <el-upload 
                    v-if="upload"
                    class="upload-demo"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" 
                    :show-file-list="false" 
                    drag 
                    :limit=1 
                    :on-change="handlePictureCardPreview" 
                    >
                    <div class="el-upload__text upload-text">
                        Drop Image Here<br> -or- <br>Click to Upload
                    </div>

                </el-upload>
            
                <div v-if="imageUrl" class="upload-demo">
                    <div class="img-btn-group">
                        <button class="delete-btn" @click="handleRemove">
                            <svg width="14" height="14" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" stroke="currentColor" style="fill-rule: evenodd; clip-rule: evenodd; stroke-linecap: round; stroke-linejoin: round;"><g transform="matrix(1.14096,-0.140958,-0.140958,1.14096,-0.0559523,0.0559523)"><path d="M18,6L6.087,17.913" style="fill: none; fill-rule: nonzero; stroke-width: 2px;"></path></g><path d="M4.364,4.364L19.636,19.636" style="fill: none; fill-rule: nonzero; stroke-width: 2px;"></path></svg>
                        </button>
                    </div>
                    <img class="el-upload-list__item-thumbnail upload-image"  :src="imageUrl" alt="" />
                </div>   
            </div>

            <button class="run-btn" @click="runModel">Run</button>
            <div class="model-params">
                <div class="model-param-head" @click="showModelParams">
                    <span>Model Parameters</span>
                    <el-icon class="model-param-icon"><CaretLeft /></el-icon>
                </div>
                
                <ul class="model-params-table" v-show="isEditParam">
                    <li v-for="item in modelParams" class="model-params-item">
                        <div class="param-item-head">
                            <span class="param-tile">{{item.title}}</span>
                            <input class="param-input" v-model=item.value />
                        </div>
                        <!-- <el-slider v-model=item.value :min=item.min :max=item.max show-input size="small"/> -->
                        <vue-slider 
                            v-model=item.value 
                            :min=item.min 
                            :max=item.max 
                            :interval=item.interval
                            :process-style="{ backgroundColor: '#35a2fd' }"
                            :tooltip-style="{ backgroundColor: '#35a2fd', borderColor: '#35a2fd' }"
                            :contained="true"
                            @error="inputError"
                            @change="changeParams"
                            >
                            <template v-slot:dot="{  focus }">
                                <div :class="['custom-dot', { focus }]"></div>
                            </template>
                        </vue-slider>
                    </li>
                </ul>
            </div>
        </div>
        
       
        <div class="result-setting">
            <div class="result-container">
                <el-image class="result-image" v-if="resultImgUrl">
                </el-image>
                <div class="result-image" v-else>
                        <el-icon><Picture /></el-icon>
                </div>
            </div>
            
            <div class="result-tool">
                <el-button class="download-btn">Download</el-button>
                <el-button class="edit-btn">Edit</el-button>
            </div>
        </div>
        
    </div>

</template>
  
<script lang="ts" setup>
import {  Picture,CaretLeft } from '@element-plus/icons-vue'

import type { UploadFile } from 'element-plus'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

const imageUrl = ref('')
const upload = ref(true)
const resultImgUrl = ref('')
var modelParams = ref([
    {
        title: "Point Per Side",
        value: 32,
        min: 4,
        max: 64,
        range: [4, 8, 16, 32, 64],
        interval: 1
    },
    {
        title: "Predicted iou",
        value: 0.82,
        min: 0.00,
        max: 1.00,
        range: [0,1],
        interval: 0.01
    },
    {
        title: "Stability score",
        value: 0.62,
        min: 0.42,
        max: 0.82,
        range: [0.42, 0.82],
        interval: 0.01
    },
    {
        title: "Min area",
        min: 0,
        max: 100,
        value: 100,
        range: [0, 100],
        interval: 10
    },
])
const isEditParam = ref(false)
const handlePictureCardPreview = (file: UploadFile) => {
    console.log('preview')
    // console.log(file)
    imageUrl.value = URL.createObjectURL(file.raw!)
    upload.value = false;
}

const handleRemove = () => {
  console.log('remove')
  imageUrl.value = '';
  upload.value = true;
}

const showModelParams = () => {
    if (isEditParam.value == true) {
        isEditParam.value = false;
        
    } else {
        isEditParam.value = true;
    }
}
const inputError = (type:string, msg:string) => {
    console.log(type, msg);
}
const changeParams = (value:string, index:number) => {
    console.log(value, index);
    console.log(modelParams);
}
const runModel = () => {
    console.log('running model');
}

</script>

<style>
.model-container {
    display: flex;
    gap: 16px;
    align-items: stretch;
    width: 100%;
}

.model-setting {
   display: flex;
   flex-direction: column;
   flex: 1 1 0%;
   flex-wrap: wrap;
   flex-grow: 1;
   gap: 16px;

}
.upload-container {
    position: relative;
    display: block;
    justify-content: center; 
    align-items: center;
    text-align: center;
    min-width: min(160px, 100%);
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-light);
    background-color: white;
    overflow: hidden;
    padding: 0;
    margin: 0;
    .upload-demo {
        width: 100%;
        height: 100%;
    }
    .el-upload-dragger {
        height: 65vh;
    }
    .upload-text {
        text-align: center;
        position: relative;
        top: 50%;
    }
}

.upload-image {
    width: 35vw;
    height: auto;
    padding: 5%;
}
.img-btn-group {
    position: absolute;
    display: inline-flex;
    top: 1%;
    right: 1%;
    justify-content: flex-end;
    gap: 1px;
    z-index: 1px;
}
.delete-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1px;
    z-index: 1px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    border: 1px solid #E6E7EB;
    border-radius: 0.125rem;
    background: #FFFFFF;
    padding: 2px;
    margin: 3px;
    color: #6B7280;
    height: 20px;
    width: 20px;
}
.delete-btn :hover{
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
    border-color: #E6E7EB;
}

.run-btn {
    width: 100%;
    align-items: center;
    background-color: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
    display: inline-flex;
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 1.25;
    min-height: 3rem;
    padding: calc(.875rem - 1px) calc(1.5rem - 1px);
    text-decoration: none;
    transition: all 250ms;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: baseline;
}

.run-btn:hover,
.run-btn:focus {
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(0, 0, 0, 0.65);
}

.run-btn:hover {
 transform: translateY(-1px);
}
.run-btn:focus,
.run-btn:focus-visible {
    border-color: rgba(0, 0, 0, 0.15);
    outline: 0;
}

.run-btn:active {
    background-color: #F0F0F1;
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
    color: rgba(0, 0, 0, 0.65);
    transform: translateY(0);
}

.model-params {
    display: grid;
    width: 100%;
    padding: 0;
    margin-top: 5px;
    background-color: white;
    border-radius: 4px;
    border: 0.5px solid #E0E1E4;
    box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
}
.model-param-head {
    cursor: pointer;    
    letter-spacing: 1.5px;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    text-align: center;
    align-items: center;
    span {
        /* font-weight: 400; */
        font-size: 14px;
        /* font-family: SourceHanSansCN-Regular, SourceHanSansCN-Medium, SourceHanSansCN-Bold,'Source Sans Pro', 'ui-sans-serif', 'system-ui', sans-serif; */
        color: #374151;
        text-indent: 8px;
        letter-spacing: 0cap;
    }
    .model-param-icon {
        /* padding: 2px; */
        text-align: center;
        color: #6B7280;
        /* transform: rotate(90deg); */
        /* transition: .15s; */
    }

}
.model-params-table {
    list-style: none;
    padding: 5px;
    margin-left: 8px;
    margin-right: 8px;
}

.model-params-item {
    display: block;    
    border-radius: 2px;
    border: 0.5px solid #E0E1E4;
    background-color: white;
    overflow: visible;
    min-width: min(160px, 100%);
    padding: 2px;
    padding-left: 10px;
    padding-bottom: 4px;
    gap: 2px;
    justify-items: start;
    .param-tile {
        color: #374151;
        font-size: 14px;
        display: block;
        padding: 0;
        margin: 0;
        text-align: left;
    }
    .param-item-head {
        display: flex;
        justify-content: space-between;
        input {
            font-size: 12px;
            padding: 4px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            margin: 2px;
            border-radius: 4px;
            background-color: #FFFFFF;
            
            max-width: 30px;
            outline: none;
            color: #333;
        }
        input:hover {
            background-color: #f2f2f2;
        }
        input:focus {
            outline: none;
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
    }
}
.custom-dot {
    width: 100%;
    height: 100%;
    border-radius: 0;
    background-color: #35a2fd;
    transition: all .3s;
  }
  .custom-dot:hover {
    transform: rotateZ(45deg);
  }
  .custom-dot.focus {
    border-radius: 50%;
  }

.result-setting {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    flex: 1 1 0%;
    flex-wrap: wrap;
    flex-grow: 1;
    gap: 16px;

    /* padding: 30px 0; */
    /* text-align: center; */
    /* width: 50vw; */
    /* vertical-align: top; */

    /* border: 1px black;
    border-radius: 4px;
    box-sizing: border-box;
    background-color: white;
    /* box-shadow:0 2px 12px 0 rgba(0,0,0,0.1); */
    /*box-shadow: var(--el-box-shadow-light);
     */
} 
.result-container {
    position: relative;
    display: block;
    justify-content: center; 
    align-items: center;
    text-align: center;
    min-width: min(160px, 100%);
    border-radius: 4px;
    box-shadow: var(--el-box-shadow-light);
    background-color: white;
    overflow: hidden;
    padding: 0;
    margin: 0;
    height: 65vh;
    .result-image {
        text-align: center;
        position: relative;
        top: 50%;
        i {
            color: #6B7280;
        }
    }
}
.result-tool {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* width: 40vw; */
}
.download-btn {
    /* width: 40vw; */
}
.edit-btn {
    /* width: 40vw; */
}

</style>



<!-- <div class="upload-container" @click="handleAddImg">
    <img :src="preview == '' ? default_img : preview" class="upload-image">
    <input 
        type="file" 
        id="scfile" 
        name="scImage" 
        autocomplete="off" 
        class="file-input"
        @change="attachimage" >

    <div v-show="del" @click="deleteImage">   
        <el-icon><Delete /></el-icon>
    </div>
</div> -->
<!-- <script lang="ts">
export default {
    props: {
        img_sc_title: {
            type: String,
            default: "Choose image",
        },
        default_img:{
            type: String,
            // <el-icon><Plus /></el-icon>
        },
    },
    data(){
        return{
            preview: "",
            del: false,
        }
    },
    methods:{
        handleAddImg() {
            const input = document.querySelector('#scfile') as any
            input.click()
        },
        attachimage(e) {
            e.preventDefault();
            var files = e.target.files

            if (!files.length)
                return;
            this.createImage(files[0]);

            this.del = true;
            this.$store.commit('addCreateSingle', files[0])
            return files;
        },
        createImage(file) {
            var reader = new FileReader();
            reader.onload = (e) => {
                this.preview = e.target.result;
            };

            reader.readAsDataURL(file);
        },
        deleteImage(files){
            var file = Array.from(files);
            file.splice(0, 1);

            this.del = false;
            this.preview = "";
            this.$store.commit('delCreateSingle')
        }
    }
}
</script> -->

