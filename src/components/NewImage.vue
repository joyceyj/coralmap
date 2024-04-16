<template>
    
    <div class="model-container">
        <div class="model-setting">
            <div class="upload-container" 
                v-if="upload" 
                @click="triggerUpload"
                @dragover="stopDrag" 
                @dragenter="stopDrag"
                @drop="handleDrop"
                data-primary>
                <input 
                    ref="imgInput"
                    accept="image/*"
                    type="file"
                    class="hidden"
                    @change="handleChange" 
                />
                <div class="upload-text">
                    Drop Image Here<br> -or- <br>Click to Upload
                </div>
            </div>
        
            <div v-if="imageUrl" class="upload-container">
                <div class="img-btn-group">
                    <button class="delete-btn" @click="handleRemove">
                        <svg width="14" height="14" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" stroke="currentColor" style="fill-rule: evenodd; clip-rule: evenodd; stroke-linecap: round; stroke-linejoin: round;"><g transform="matrix(1.14096,-0.140958,-0.140958,1.14096,-0.0559523,0.0559523)"><path d="M18,6L6.087,17.913" style="fill: none; fill-rule: nonzero; stroke-width: 2px;"></path></g><path d="M4.364,4.364L19.636,19.636" style="fill: none; fill-rule: nonzero; stroke-width: 2px;"></path></svg>
                    </button>
                </div>
                <el-image class="upload-image"  :src="imageUrl" >
                </el-image>
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
                <div class="checkbox-wrapper-51 img-btn-group" v-if="resultMaskUrl && runState=='success'" >
                    <input id="cbx-51" type="checkbox" :checked="showMask" :onchange="changeMask">
                    <label class="toggle" for="cbx-51">
                        <span>
                        <svg viewBox="0 0 10 10" height="10px" width="10px">
                            <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
                        </svg>
                        </span>
                    </label>
                </div>
                <el-image class="result-origin" :src="resultImgUrl" v-if="resultImgUrl && runState=='success'">
                </el-image>
                
                <el-image class="result-mask" :src="resultMaskUrl" v-if="resultMaskUrl && showMask && runState=='success'">
                </el-image>
                <div class="result-image" v-if="!resultImgUrl && runState=='ready'">
                    <el-icon><Picture /></el-icon>
                </div>
                <div class="result-image" v-if="!resultImgUrl && runState=='loading'">
                    <div class="loader">
                        <svg viewBox="0 0 80 80">
                            <circle id="test" cx="40" cy="40" r="32"></circle>
                        </svg>
                    </div>
                </div>
                <div class="result-image" v-if="!resultImgUrl && runState=='fail'">
                    <el-tag type="danger">Error</el-tag>
                </div>

            </div>
            
            <div class="result-tool">
                <el-button class="result-btn" :disabled="!resultImgUrl && !resultMaskUrl && runState!='success'" @click="handleDownload">Download</el-button>
                <el-button class="result-btn" :disabled="true">Edit</el-button>
                
            </div>
            
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import {  Picture,CaretLeft } from '@element-plus/icons-vue'

// import type { UploadFile } from 'element-plus'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import axios from 'axios'
import mergeImages from 'merge-images'
axios.defaults.baseURL =
  process.env.NODE_ENV === "development" ? "" : "https://coralscop-test.hkustvgd.com";
const base = process.env.NODE_ENV === "development" ? "/api" : "";

const imgInput = ref<HTMLInputElement>()
const imageUrl = ref('')
const upload = ref(true)
var uploadFileName = ref('');

const isEditParam = ref(false);
const runState = ref('ready');

const resultImgUrl = ref('');
const resultMaskUrl = ref('');
const resultImg = ref();
const resultMask = ref();
var resultJsonFile = ref({});
const showMask = ref(true);

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
]);
let timer: null | NodeJS.Timeout = null;

const triggerUpload = () => {
    // console.log(imgInput);
    if (imgInput.value) {
        imgInput.value.click();
    }
}

const changeMask = () => {
    // console.log(showMask);
    showMask.value = !showMask.value;
}
const handlePictureCardPreview = (file:File) => {
    console.log('===preview===')
    // console.log(file)
    imageUrl.value = URL.createObjectURL(file)
    upload.value = false;
}

const handleRemove = () => {
  console.log('===remove===')
  imageUrl.value = '';
  upload.value = true;
  uploadFileName.value = '';
  
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
const uploadToSvr = async (formData:FormData) => {
    try {
        console.log("===upload===");
        // console.log(process.env.NODE_ENV);
        // console.log(base);
        const result = await axios.post(base+'/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        uploadFileName.value = result.data.image_name;
    } catch (err) {
        console.error(err);
    }
}
const handleChange = async (event:Event) => {
    let filelist = (event.target as HTMLInputElement).files;
    // console.log(file);
    if (filelist) {
        let file = filelist[0];
        let formData = new FormData();
        formData.append('image_file', file);
        // console.log(formData.get('image_file'));
        await uploadToSvr(formData);
        handlePictureCardPreview(file);
    }

}

const handleDrop = async (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let file = e.dataTransfer?.files[0];
    if (file) {
        let formData = new FormData();
        formData.append('image_file', file);
        await uploadToSvr(formData);
        handlePictureCardPreview(file);
    }
}
const stopDrag = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

}

const runModel = async () =>  {
    if (uploadFileName.value != null && uploadFileName.value != '' ) {
        console.log('===running model===');
        console.log(uploadFileName.value);
        runState.value = 'loading';
        var iou, sta, point, minarea;
        modelParams.value.forEach(element => {
            if (element.title == 'Point Per Side') {
                point = element.value;
            }
            if (element.title == 'Predicted iou') {
                iou = element.value;
            }
            if (element.title == 'Stability score') {
                sta = element.value;
            }
            if (element.title == 'Min area') {
                minarea = element.value;
            }
        });
        let params = {
            'image_name': uploadFileName.value,
            'iou_threshold': iou,
            'sta_threshold': sta,
            'point_number': point,
            'min_area': minarea
        };
        try {
            const result = await axios.post(base+'/enqueue', params, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (result.data.data.image_name) {
                uploadFileName.value = result.data.data.image_name;
                clearTimeout(Number(timer));
                while (Number(timer) < 6000 && runState.value == 'loading') {
                    await pollingInquiry();
                }
                
            } else {
                runState.value = 'fail';
            }
            // console.log(result);
        } catch (err) {
            console.error(err);
        }
    }
}
const modifyMaskColor = (imgSrc: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const purple = [154, 30, 232];
    img.src = imgSrc;
    img.onload = ()  => {
        canvas.height = img.height;
        canvas.width = img.width;
        img.onload = null;
        if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0,0,img.width,img.height);
            const data = imageData.data;
            for (let idx = 0; idx < data.length; idx += 4) {
                if (data[idx] > 250) {
                    data[idx] = purple[0];
                    data[idx+1] = purple[1];
                    data[idx+2] = purple[2];
                    data[idx+3] = 255;
                } else {
                    data[idx] = 0;
                    data[idx+1] = 0;
                    data[idx+2] = 0;
                    data[idx+3] = 0;
                }
            }
            ctx.putImageData(imageData,0,0);
            resultMaskUrl.value = canvas.toDataURL();
        }
    }
}
const getResultInfo = async (imgName:string, maskPath:string, jsonFilePath:string) => {
    try {
        console.log("===result===");
        resultImg.value = await axios.get(base+'/usr_imgs/'+imgName, {
            responseType: 'arraybuffer'
        });
        const originBlob = new Blob([resultImg.value.data], {type: resultImg.value.headers['content-type']});
        resultImgUrl.value = URL.createObjectURL(originBlob);
        // console.log(originBlob);

        resultMask.value = await axios.get(base+maskPath, {
            responseType: 'arraybuffer'
        });
        const maskBlob = new Blob([resultMask.value.data], {type:resultMask.value.headers['content-type']});
        let maskUrl = URL.createObjectURL(maskBlob);
        modifyMaskColor(maskUrl);
        // console.log(maskBlob);

        resultJsonFile.value = await axios.get(base+jsonFilePath);
        // resultJsonFile.value = await axios.get('/'+jsonFilePath, {
        //     baseURL: 'https://coralscop-test.hkustvgd.com',

        // });
        // console.log(resultImg.value);
        // console.log(resultMask.value);
        // console.log(resultJsonFile);
       
    } catch (err) {
        console.error(err);
    }
}
const inquiry = async () => {
    try {
        console.log("===inquiry===");
        const result = await axios.get(base+'/result', {
            params: {
                'image_name': uploadFileName.value,
            },
        });
        // console.log(result);
        if (result.data.isDone == 1) {
            runState.value = 'success';
            var resImgName = result.data.data.image_name;
            var resMaskPath = result.data.data.output_paths.mask_image.replace(/\.\//,'');
            var resJsonPath = result.data.data.output_paths.json.replace(/\.\//,'');
            getResultInfo(resImgName, resMaskPath, resJsonPath);
        }
    } catch (err) {
        console.error(err);
    }
}

const pollingInquiry = () => {
    return new Promise(resolve => {
        timer = setTimeout(async () => {
            const result = await inquiry();
            resolve(result);
        }, 1500);
    });
}
const generateResultImg = async (imgSrc:string, maskSrc:string) => {
    mergeImages([imgSrc, {src:maskSrc, opacity: 0.3}]).then(b64 => {
        downloadResultImg(b64, 'coralscop-result.png');
    })
}
const downloadResultImg = (src:string, filename:string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const handleDownload = async () => {
    console.log("===Download===");
    generateResultImg(resultImgUrl.value, resultMaskUrl.value);
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
    display: flex;
    justify-content: center; 
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: min(160px, 100%);
    height: 600px;
    border-radius: 4px;
    border: 2px #EBEBEF dashed;
    background-color: white;
    overflow: hidden;
    padding: 0;
    margin: 0;
    cursor: pointer;
    
}
.upload-image {
    object-fit: contain;
    margin: 5%;
}

.upload-text {
    color: #6B7280;
    text-align: center;
    position: relative;
    /* top: 50%; */
}
.hidden {
    display: none;
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
    background: linear-gradient(to bottom right, #f3f4f6 , #e5e7eb );
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
    box-sizing: border-box;
    color: #374151;
    cursor: pointer;
    display: inline-flex;
    font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 1.25;
    min-height: 3rem;
    padding: calc(.875rem - 1px) calc(1.5rem - 1px);
    transition: all 250ms;
    touch-action: manipulation;
    vertical-align: baseline;
}

.run-btn:hover,
.run-btn:focus {
    border-color: #e5e7eb;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(0, 0, 0, 0.65);
}

.run-btn:hover {
 transform: translateY(-1px);
 background-color: linear-gradient(to bottom right, #f3f4f6 , #f3f4f6 );
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
} 
.result-container {
    position: relative;
    display: flex;
    justify-content: center; 
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-width: min(160px, 100%);
    height: 600px;
    border-radius: 4px;
    /* border: 2px #EBEBEF dashed; */
    background-color: white;
    overflow: hidden;
    padding: 0;
    margin: 0;
    cursor: pointer;

    .result-image {
        text-align: center;
        position: relative;
        /* top: 50%; */
        i {
            color: #6B7280;
        }
    }
    .result-origin {
        text-align: center;
        position: absolute;
        /* top: 5%; */
        z-index: 10;
        object-fit: contain;
        margin: 10%;
    }
    .result-mask {
        text-align: center;
        position: absolute;
        /* top: 5%; */
        opacity: 60%;
        z-index: 100;
        mix-blend-mode: multiply;
        object-fit: contain;
        margin: 10%;
    }
    .el-image {
        display: flex;
        overflow: hidden;
    }
}
.checkbox-wrapper-51 input[type="checkbox"] {
  visibility: hidden;
  display: none;
}

.checkbox-wrapper-51 .toggle {
  position: relative;
  display: block;
  width: 42px;
  height: 24px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0);
}

.checkbox-wrapper-51 .toggle:before {
  content: "";
  position: relative;
  top: 1px;
  left: 1px;
  width: 40px;
  height: 22px;
  display: block;
  background: #c8ccd4;
  border-radius: 12px;
  transition: background 0.2s ease;
}

.checkbox-wrapper-51 .toggle span {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  display: block;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(154,153,153,0.75);
  transition: all 0.2s ease;
}

.checkbox-wrapper-51 .toggle span svg {
  margin: 7px;
  fill: none;
}

.checkbox-wrapper-51 .toggle span svg path {
  stroke: #c8ccd4;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 24;
  stroke-dashoffset: 0;
  transition: all 0.5s linear;
}

.checkbox-wrapper-51 input[type="checkbox"]:checked + .toggle:before {
  background: #1175c7;
}

.checkbox-wrapper-51 input[type="checkbox"]:checked + .toggle span {
  transform: translateX(18px);
}

.checkbox-wrapper-51 input[type="checkbox"]:checked + .toggle span path {
  stroke: #000000;
  stroke-dasharray: 25;
  stroke-dashoffset: 25;
}
.loader {
  --path: #2f3545;
  --dot: #5628ee;
  --duration: 3s;
  width: 44px;
  height: 44px;
  position: relative;
}

.loader:before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: absolute;
  display: block;
  background: var(--dot);
  top: 37px;
  left: 19px;
  transform: translate(-18px, -18px);
  animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
}

.loader svg {
  display: block;
  width: 100%;
  height: 100%;
}

.loader svg rect, .loader svg polygon, .loader svg circle {
  fill: none;
  stroke: var(--path);
  stroke-width: 10px;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.loader svg polygon {
  stroke-dasharray: 145 76 145 76;
  stroke-dashoffset: 0;
  animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
}

.loader svg rect {
  stroke-dasharray: 192 64 192 64;
  stroke-dashoffset: 0;
  animation: pathRect 3s cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
}

.loader svg circle {
  stroke-dasharray: 150 50 150 50;
  stroke-dashoffset: 75;
  animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
}

.loader.triangle {
  width: 48px;
}

.loader.triangle:before {
  left: 21px;
  transform: translate(-10px, -18px);
  animation: dotTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
}

@keyframes pathTriangle {
  33% {
    stroke-dashoffset: 74;
  }

  66% {
    stroke-dashoffset: 147;
  }

  100% {
    stroke-dashoffset: 221;
  }
}

@keyframes dotTriangle {
  33% {
    transform: translate(0, 0);
  }

  66% {
    transform: translate(10px, -18px);
  }

  100% {
    transform: translate(-10px, -18px);
  }
}

@keyframes pathRect {
  25% {
    stroke-dashoffset: 64;
  }

  50% {
    stroke-dashoffset: 128;
  }

  75% {
    stroke-dashoffset: 192;
  }

  100% {
    stroke-dashoffset: 256;
  }
}

@keyframes dotRect {
  25% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(18px, -18px);
  }

  75% {
    transform: translate(0, -36px);
  }

  100% {
    transform: translate(-18px, -18px);
  }
}

@keyframes pathCircle {
  25% {
    stroke-dashoffset: 125;
  }

  50% {
    stroke-dashoffset: 175;
  }

  75% {
    stroke-dashoffset: 225;
  }

  100% {
    stroke-dashoffset: 275;
  }
}

.loader {
  display: inline-block;
  margin: 0 16px;
}

.result-tool {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* width: 40vw; */
}
.result-btn {
    background-color: #FFFFFF;
    border: 1px solid rgb(209,213,219);
    border-radius: .5rem;
    color: #111827;
    font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: .875rem;
    font-weight: 600;
    line-height: 1.25rem;
    padding: .75rem 1rem;
    text-align: center;
    min-height: 3rem;
    -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-select: none;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
}

.result-btn:hover {
  background-color: #f9fafb;
  color: #111827;
  border: 1px solid rgb(209,213,219);
}

.result-btn:focus {
    border-color: rgba(0, 0, 0, 0.15);
    outline: 0;
}

.result-btn:focus-visible {
  -webkit-box-shadow: none;
  box-shadow: none;
  border-color: rgba(0, 0, 0, 0.15);
  outline: 0;
}

</style>



