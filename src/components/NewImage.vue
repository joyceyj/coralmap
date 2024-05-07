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
        
            <div class="upload-container" v-if="imageUrl" >
                <div class="img-btn-group">
                    <button class="delete-btn" @click="handleRemove">
                        <svg width="14" height="14" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" stroke="currentColor" style="fill-rule: evenodd; clip-rule: evenodd; stroke-linecap: round; stroke-linejoin: round;"><g transform="matrix(1.14096,-0.140958,-0.140958,1.14096,-0.0559523,0.0559523)"><path d="M18,6L6.087,17.913" style="fill: none; fill-rule: nonzero; stroke-width: 2px;"></path></g><path d="M4.364,4.364L19.636,19.636" style="fill: none; fill-rule: nonzero; stroke-width: 2px;"></path></svg>
                    </button>
                </div>
                <el-image class="upload-image"  :src="imageUrl" >
                </el-image>
            </div>

            <div class="btn-tool">
                <button class="run-btn" @click="runModel">Run</button>
                <button class="normal-btn" style="width: 48%;" @click="handleClear">Clear</button>
            </div>
            
            
            <div class="model-params">
                <div class="model-param-head" @click="showModelParams">
                    <span>Model Parameters</span>
                    <el-icon class="model-param-icon" v-show="!isEditParam"><CaretLeft /></el-icon>
                    <el-icon class="model-param-icon" v-show="isEditParam"><CaretBottom /></el-icon>
                </div>
                
                <ul class="model-params-table" v-show="isEditParam">
                    <li v-for="item in modelParams" class="model-params-item">
                        <div class="param-item-head">
                            <span class="param-title">{{item.title}}
                                <div class="param-help">
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2452" height="14px" width="14px">
                                        <path d="M512 51.2a460.8 460.8 0 1 0 0 921.6 460.8 460.8 0 0 0 0-921.6z m0 855.7568a394.9568 394.9568 0 1 1 0-789.9136 394.9568 394.9568 0 0 1 0 789.9136zM512 281.6a120.4736 120.4736 0 0 0-131.6352 125.0816h59.904A65.8432 65.8432 0 0 1 512 336.896c35.5328 0 65.8432 17.7664 65.8432 59.2384 0 30.9248-18.432 45.4144-48.0768 65.8432a116.5312 116.5312 0 0 0-58.5728 98.0992v23.04h59.904v-17.8176c0-35.5328 13.1584-46.08 49.3568-73.728a119.1424 119.1424 0 0 0 63.1808-99.3792A115.2 115.2 0 0 0 512 281.6z m-50.0224 399.872a46.08 46.08 0 0 0 92.16-1.5872 45.4144 45.4144 0 0 0-48.7424-46.08 46.08 46.08 0 0 0-43.4176 47.7184z" p-id="2453" fill="#13227a">
                                        </path>
                                    </svg>
                                    <div class="tooltip">{{ item.tooltip }}</div>
                                </div>
                            </span>
                            <input class="param-input" v-model=item.value />
                        </div>
                        <vue-slider 
                            v-model=item.value 
                            :min=item.min 
                            :max=item.max 
                            :interval=item.interval
                            :process-style="{ backgroundColor: 'blueviolet' }"
                            :tooltip-style="{ backgroundColor: 'blueviolet', borderColor: 'blueviolet' }"
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
                <div class="img-btn-group" v-if="runState=='success'" >
                <!-- <div class="img-btn-group" v-if="true" > -->
                    <div v-if="showMask">
                        <vue-slider 
                            v-model=maskOpacity
                            class="mask-opacity-silder"
                            :min=0.0 
                            :max=1.0
                            :interval=0.05
                            :process-style="{ backgroundColor: 'blueviolet' }"
                            :tooltip-style="{ backgroundColor: 'blueviolet', borderColor: 'blueviolet' }"
                            :tooltip-placement="['bottom']"
                            :contained="true"
                            @change="changeMaskOpacity"
                            >
                            <template v-slot:dot="{  focus }">
                                <div :class="['custom-dot', { focus }]"></div>
                            </template>
                        </vue-slider>
                    </div>
                     
                    <div class="checkbox-wrapper">
                        <input id="cbx-51" type="checkbox" :checked="showMask" :onchange="changeMask">
                        <label class="toggle" for="cbx-51">
                            <span>
                            <svg viewBox="0 0 10 10" height="10px" width="10px">
                                <path d="M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z"></path>
                            </svg>
                            </span>
                        </label>
                    </div>
                   
                </div>

                <el-image class="result-origin" :src="resultImgUrl" v-if="resultImgUrl && runState=='success'">
                </el-image>
                
                <el-image class="result-mask" :style="[variableOpacity]" :src="resultMaskUrl" v-if="resultMaskUrl && showMask && runState=='success'">
                </el-image>
                
                <div class="result-image" v-if="!resultImgUrl && runState=='ready'">
                    <el-icon><Picture /></el-icon>
                </div>
                <div class="result-image" v-if="!resultImgUrl && runState=='loading'">
                    <div class="loader">
                        <svg viewBox="0 0 80 80">
                            <circle id="test" cx="40" cy="40" r="32"></circle>
                        </svg>
                        <span>{{ runTimeMilSec / 1000.0 }}s</span>
                    </div>
                </div>
                <div class="result-image" v-if="!resultImgUrl && runState=='fail'">
                    <el-tag type="danger">Error</el-tag>
                    <span style="display:flex;">{{ errorMsg }}</span>
                </div>

            </div>
            
            <div class="btn-tool">
                <div class="download-btn">
                    <el-button :class="[runState=='success' ? 'result-btn  normal-btn' : 'normal-btn']" :disabled="!resultImgUrl || !resultMaskUrl || runState!='success'">Download&nbsp; ▼</el-button>
                    <!-- <el-button :class="[runState=='success' ? 'result-btn  normal-btn' : 'normal-btn']" :disabled="false">Download &nbsp; ▼</el-button> -->
                    <div class="download-content" v-if="resultImgUrl && resultMaskUrl && runState=='success'">
                    <!-- <div class="download-content" v-if="true"> -->
                        <div class="download-item" @click="downloadResult">ResultImage</div>
                        <div class="download-item" @click="downloadMask">MaskImage</div>
                        <div class="download-item" @click="downloadJson">JsonFile</div>
                        <div class="download-item" @click="downloadAll">All</div>
                    </div>
                </div>
                
                <el-button class="result-btn normal-btn" :disabled="true">Edit</el-button>
                
            </div>
            
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import {  Picture,CaretLeft,CaretBottom} from '@element-plus/icons-vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import axios from 'axios'
import JSZip from "jszip"

// axios api setting
axios.defaults.baseURL =
  process.env.NODE_ENV === "development" ? "" : "https://coralscop-test.hkustvgd.com";
const base = process.env.NODE_ENV === "development" ? "/api" : "";

// upload file
const imgInput = ref<HTMLInputElement>()
const imageUrl = ref('')
const upload = ref(true)
var uploadFileName = ref('');
// var uploadFileName = ref('8c78a50c-0cd1-4982-90da-d4d2a6800f27.jpg');

const isEditParam = ref(false);
const runState = ref('ready');
const errorMsg = ref('');


const resultImgUrl = ref('');
// modify to purple image
const resultMaskUrl = ref('');
// black and white image
var maskUrl = '';
const resultJsonUrl = ref('');

const resultImg = ref();
const resultMask = ref();
var resultJsonFile = ref();

const showMask = ref(true);
const maskOpacity = ref(0.3);
var variableOpacity = {
    'opacity': maskOpacity.value,
}

var modelParams = ref([
    {
        title: "Point Per Side",
        value: 32,
        min: 4,
        max: 64,
        range: [4, 8, 16, 32, 64],
        interval: 1,
        tooltip: "It controls the granularity of the generated masks. Larger values yield longer response times."
    },
    {
        title: "Predicted iou",
        value: 0.82,
        min: 0.00,
        max: 1.00,
        range: [0,1],
        interval: 0.01,
        tooltip: "It indicates the quality of the generated coral masks. The coral masks with predicted iou below this value will be filtered out.Higher is better."
    },
    {
        title: "Stability score",
        value: 0.62,
        min: 0.42,
        max: 0.82,
        range: [0.42, 0.82],
        interval: 0.01,
        tooltip: "The stability of the generated coral masks"
    },
    {
        title: "Min area",
        min: 0,
        max: 100,
        value: 100,
        range: [0, 100],
        interval: 10,
        tooltip: "Coral masks with areas lower than this value will be removed."
    },
]);
let timer: null | NodeJS.Timeout = null;
// millisecond
var runTimer;
const runTimeMilSec = ref(0);
const startRunTime = () => {
    runTimeMilSec.value = 0;
    runTimer = setInterval(() => {
        runTimeMilSec.value = runTimeMilSec.value + 100;
    }, 100);
}
const stopRunTime = () => {
    runTimer = clearInterval(runTimer);
}



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
const changeMaskOpacity = (value) => {
    variableOpacity['opacity'] = value;
}
const handlePictureCardPreview = (file:File) => {
    console.log('===preview===')
    // console.log(file)
    imageUrl.value = URL.createObjectURL(file)
    upload.value = false;
}

// remove the upload info
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
    // console.log(modelParams);
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

const clearResult = () => {
    resultImgUrl.value = '';
    resultMaskUrl.value = '';
    // black and white image
    maskUrl = '';
    resultJsonUrl.value = '';

    resultImg.value = '';
    resultMask.value = '';
    resultJsonFile.value = '';

    showMask.value = true;
    maskOpacity.value = 0.3;
    variableOpacity['opacity'] = maskOpacity.value;
}

const runModel = async () =>  {
    if (uploadFileName.value != null && uploadFileName.value != '' ) {
        clearResult();

        console.log('===running model===');
        // console.log(uploadFileName.value);

        runTimeMilSec.value = 0;
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
                startRunTime();
                while (runState.value == 'loading' && runTimeMilSec.value < 10000) {
                    // console.log(runTimeMilSec);
                    await pollingInquiry();
                }
                stopRunTime();
                if (runState.value == 'loading' && runTimeMilSec.value >= 10000) {
                    runState.value = 'fail';
                    errorMsg.value = "Time out! Please use a smaller size of image and try again!";
                }
                // clearTimeout(Number(timer));
                
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
        maskUrl = URL.createObjectURL(maskBlob);
        modifyMaskColor(maskUrl);
        // console.log(maskBlob);

        var json = await axios.get(base+jsonFilePath);
        resultJsonFile.value = JSON.stringify(json);
        resultJsonUrl.value = 'data:application/json;charset=utf-8,'+encodeURIComponent(resultJsonFile.value);       
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
            if (result.data.errors.length) {
                runState.value = 'fail';
                errorMsg.value = "Please use smaller iou and try again!";
            } else {
                runState.value = 'success';
                var resImgName = result.data.data.image_name;
                var resMaskPath = result.data.data.output_paths.mask_image.replace(/\.\//,'');
                var resJsonPath = result.data.data.output_paths.json.replace(/\.\//,'');
                getResultInfo(resImgName, resMaskPath, resJsonPath);
            }
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
        }, 500);
    });
}

const generateResultImg = async (imgSrc:string, maskSrc:string, maskOpa:number, blendMode:GlobalCompositeOperation) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imgSrc;
    const mask = new Image();
    mask.src = maskSrc;

    await img.onload;
    await mask.onload;
    canvas.height = img.height;
    canvas.width = img.width;
    if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = maskOpa;
        ctx.globalCompositeOperation = blendMode;
        ctx.drawImage(mask, 0, 0);
    }
    return canvas.toDataURL();

}

const handleClear = () => {
    // imgInput.value = ;
    imageUrl.value = '';
    upload.value = true;
    uploadFileName.value = '';
    // uploadFileName.value = '8c78a50c-0cd1-4982-90da-d4d2a6800f27.jpg';

    isEditParam.value = false;
    runState.value = 'ready';

    resultImgUrl.value = '';
    resultMaskUrl.value = '';
    // black and white image
    maskUrl = '';
    resultJsonUrl.value = '';

    resultImg.value = '';
    resultMask.value = '';
    resultJsonFile.value = '';

    showMask.value = true;
    maskOpacity.value = 0.3;
}

const downloadFile = (src:string, filename:string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


const downloadResult = async() => {
    console.log("===Download Result Image===");
    var mergeUrl = await generateResultImg(resultImgUrl.value, resultMaskUrl.value, maskOpacity.value, 'multiply');
    downloadFile(mergeUrl, 'coralscop-result.png');
    
}
const downloadMask = async() => {
    console.log("===Download Mask Image===");
    downloadFile(maskUrl, 'coralscop-mask.png');
}
const downloadJson = async() => {
    console.log("===Download Json File===");
    downloadFile(resultJsonUrl.value, 'coralscop-json.json');
}
const downloadAll = async() => {
    console.log("===Download All===");
    const zip = new JSZip();

    var mergeUrl = await generateResultImg(resultImgUrl.value, resultMaskUrl.value, maskOpacity.value, 'multiply');
    // console.log(mergeUrl);
    zip.file('coralscop-result.png', mergeUrl.split(';base64,')[1], {base64:true});
    zip.file('coralscop-mask.png', resultMask.value.data, {binary:true});
    zip.file('coralscop-json.json', resultJsonUrl.value, {binary:true});
    zip.generateAsync({ type: 'blob' }).then(content => {
        // console.log(content);
        downloadFile(URL.createObjectURL(content), 'coralscop-result.zip');
    });
    
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
    /* object-fit: contain; */
    position: absolute;
    padding: 20px;
    height: auto;
    max-height: 525px;
    width: auto;
    max-width: 525px;
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
    top: 2%;
    right: 2%;
    justify-content: flex-end;
    gap: 3px;
    z-index: 110;
}
.mask-opacity-silder {
    min-width: 150px;
    margin-top: 5px;
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
    /* width: 100%; */
    width: 48%;
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

.normal-btn {
    padding: calc(.875rem - 1px) calc(1.5rem - 1px);
    font-weight: 600;
    font-size: 16px;
    min-height: 48px;
    background: rgb(255, 255, 255);
    color: blueviolet;
    border-radius: 8px;
    border-bottom: 1px solid blueviolet;
    border-right: 1px solid blueviolet;
    border-top: 1px solid white;
    border-left: 1px solid white;
    transition-duration: 1s;
    transition-property: border-top, border-left, border-bottom, border-right, box-shadow;
}
.normal-btn:hover {
    border-top: 1px  solid blueviolet;
    border-left: 1px  solid blueviolet;
    border-bottom: 1px  solid blueviolet;
    border-right: 1px  solid blueviolet;
    /* border-bottom: 2px solid rgb(238, 103, 238);
    border-right: 2px solid rgb(238, 103, 238); */
    /* box-shadow: rgba(240, 46, 170, 0.4) 5px 5px, rgba(240, 46, 170, 0.3) 10px 10px, rgba(240, 46, 170, 0.2) 15px 15px; */
}

.model-params {
    display: grid;
    width: 100%;
    padding: 0;
    margin-top: 5px;
    background-color: white;
    border-radius: 8px;
    border: 0.5px solid #E0E1E4;
    border-bottom: 1px solid blueviolet;
    border-right: 1px solid blueviolet;
    box-shadow: rgb(0 0 0 / 5%) 0 0 8px;
}
.model-params:hover,
.model-params:focus {
    border:1px solid blueviolet;
}
.model-param-head {
    cursor: pointer;    
    letter-spacing: 1.5px;
    display: flex;
    justify-content: space-between;
    padding: 12px;
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
    
    .param-item-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        .param-title {
            color: #374151;
            font-size: 14px;
            display: inline-flex;
            padding: 0;
            margin: 0;
            text-align: left;
            align-items: center;
            gap: 3px;
            .param-help {
                margin: 0;
                margin-top: 5px;
                text-align: center;
                align-items: center;
                position: relative;
            }
            .tooltip {
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-10%);
                color: #fff;
                padding: 6px 10px;
                border-radius: 15px;
                opacity: 0;
                visibility: hidden;
                font-size: 12px;
                transition: all 0.3s ease;
                width: 25vw;
                z-index: 10;
            }

            .param-help:hover .tooltip {
                opacity: 1;
                visibility: visible;
                bottom: 20px;
                /* background-color: #7020FF; */
                background-image: linear-gradient(to right, blueviolet, #35a2fd);
                height: fit-content;
            }
        }
        .param-input {
            grid-column: 4/4;
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
        .param-input:hover {
            background-color: #f2f2f2;
        }
        .param-input:focus {
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
    background-color: blueviolet;
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
    border: 2px #FFFFFF solid;
    background-color: white;
    overflow: hidden;
    padding: 0;
    margin: 0;
    cursor: pointer;

    .result-image {
        text-align: center;
        position: relative;
        /* width: 50vw;
        height: 50vh; */
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
        /* object-fit: contain; */
        height: auto;
        max-height: 525px;
        width: auto;
        max-width: 525px;
        padding: 20px;
    }
    .result-mask {
        text-align: center;
        position: absolute;
        /* top: 5%; */
        /* opacity: 60%; */
        z-index: 30;
        mix-blend-mode: multiply;
        /* object-fit: contain; */
        height: auto;
        max-height: 525px;
        width: auto;
        max-width: 525px;
        padding: 20px;
    }
    .el-image {
        display: flex;
        overflow: hidden;
    }
}

.checkbox-wrapper input[type="checkbox"] {
  visibility: hidden;
  display: none;
}

.checkbox-wrapper .toggle {
  position: relative;
  display: block;
  width: 42px;
  height: 24px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transform: translate3d(0, 0, 0);
}

.checkbox-wrapper .toggle:before {
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

.checkbox-wrapper .toggle span {
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

.checkbox-wrapper .toggle span svg {
  margin: 7px;
  fill: none;
}

.checkbox-wrapper .toggle span svg path {
  stroke: #c8ccd4;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 24;
  stroke-dashoffset: 0;
  transition: all 0.5s linear;
}

.checkbox-wrapper input[type="checkbox"]:checked + .toggle:before {
  background: blueviolet;
}

.checkbox-wrapper input[type="checkbox"]:checked + .toggle span {
  transform: translateX(18px);
}

.checkbox-wrapper input[type="checkbox"]:checked + .toggle span path {
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

.btn-tool {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    /* width: 40vw; */
}
.result-btn {
    font-size: .875rem;
    /* min-height: 48px; */
    cursor: pointer;
}

.result-btn:hover {
    background-color: #FFFFFF;
    color: blueviolet;
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

.download-content {
    display: none;
    font-size: 13px;
    position: absolute;
    z-index: 1;
    min-width: 145px;
    background-color: #FFFFFF;
    border: 1px solid blueviolet;
    /* border: 1px solid rgb(209,213,219); */
    border-radius: 0px 8px 8px 8px;
    box-shadow: 0px 8px 8px 0px rgba(0,0,0,0.2);
    overflow: hidden;
    margin-bottom: 10px;
}
.download-item {
    /* color: #5628ee; */
    color: blueviolet;
    padding: 8px 20px;
    text-decoration: none;
    display: block;
    transition: 0.1s;
    text-align: left;
    /* padding-left: 5px; */
}

.download-item:hover {
    /* background-color: #35a2fd; */
    background-image: linear-gradient(to right, blueviolet, #35a2fd);
    color: #FFFFFF;
    font-weight: bold;
    cursor: pointer;
}

.download-item:focus {
    background-color: #212121;
    color: blueviolet;
}
.download-btn {
    position: relative;
    display: block;
}
.download-btn:hover .download-content {
    display: block;
}
.download-btn:hover .result-btn{
    border-radius: 8px 8px 0px 0px;
    border-top: 1px solid blueviolet;
    border-left: 1px solid blueviolet;
    border-bottom: 0;
}
</style>



