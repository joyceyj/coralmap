<template>
    <div class="segment-box">
        <div class="edit-type">
            <div class="tabs">
                <input type="radio" id="type-rmv" name="tabs" checked>
                <label class="tab" for="type-rmv">Remove</label>
                <input type="radio" id="type-add" name="tabs">
                <el-tooltip content="Next version" placement="top" effect="light">
                    <label class="tab" for="type-add">Add</label>
                </el-tooltip>
                <span class="glider"></span>
            </div>
        </div>
        <div class="tool-bar">
            <span class="tool-tip">Hover & Click</span>
            <div class="tools">
                <el-tooltip content="Cancel the selection" placement="top" effect="light">
                    <span class="tool-item" @click="reset">Reset</span>
                </el-tooltip>
                <!-- <span :class="'tool-item'+(clicks.length==0?' disabled':'')">Undo</span> -->
                <!-- <span :class="'tool-item'+(clickHistory.length==0?' disabled':'')">Redo</span> -->
                <el-tooltip content="The number of selected mask" placement="top" effect="light">
                    <span class="tool-item">Selected: {{ selectNum }}</span>
                </el-tooltip>
                <el-tooltip content="Remove selected mask" placement="top" effect="light">
                    <span :class="'tool-item'+(selectNum==0?' disabled':'')" @click="removeSelectedMask">Remove</span>
                </el-tooltip>
                <el-tooltip content="Remove and Save (could not reset)" placement="top" effect="light">
                    <span class="tool-item" @click="saveRemove">Save</span>
                </el-tooltip>
                
            </div>
        </div>
        <div class="segment-wrapper">
            <img id="segment-image" class="segment-content" :src="imageUrl" 
                :width="resize.w" :height="resize.h"
                alt="fail loading" crossorigin="anonymous"/>
            <img id="segment-mask" class="segment-content" :src="fullMaskUrl" 
                :width="resize.w" :height="resize.h"
                @mousemove="handleMouseMove"
                @mousedown="handleMouseDown"
                alt="fail loading" crossorigin="anonymous"/>
            <canvas id="segment-canvas" 
                class="segment-content" 
                :width="resize.w" :height="resize.h"
                 ></canvas>
            <div id="point-box" :style="{width:resize.w, height:resize.h}"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {loadImage} from '@/helper/loadImage'
interface ImageInfo {
    w: number;
    h: number;
    scale: number;
    ratio: number;
}
const props = defineProps({
    jsonData: { type: String },
    imageUrl: { type: String },
    fullMaskUrl: { type: String },
    opacity: {type: Number, default: 0.3},
});

const emit = defineEmits(['editResult']);

const windowSize :ImageInfo = {h:615, w:1024, ratio: 1024.0/615.0, scale: 1.0};
var resize :ImageInfo = {h:615, w:1024, ratio: 1024.0/615.0, scale: 1.0};
var naturalSize :ImageInfo = {h:615, w:1024, ratio: 1024.0/615.0, scale: 1.0};
var bboxlist: number[][] = [];

// const removeAnnotation = [];
const selectNum = ref(0);
// const clicks = [];
// const clickHistory = [];

const isDraw = ref(false);
const editMask = ref('');
// var fullMask :ImageData;

var resultMask;
var resultJson;

const scale = async () => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = <string>props.imageUrl;
        image.onload = () => {
            let w = image.width;
            let h = image.height;
            let scale = 1.0;
            // console.log(w,h);
            const ratio = (w * 1.0) / (h*1.0);
            naturalSize.w = w;
            naturalSize.h = h;
            naturalSize.ratio = ratio;

            if (windowSize.ratio < ratio) {
                w = windowSize.w;
                h = Math.round(windowSize.w / ratio);
            } else {
                w = Math.round(windowSize.h * ratio);
                h = windowSize.h;
            }
            scale = (w * 1.0) / (image.width * 1.0);
            var res :ImageInfo = { w: w, h: h, ratio: ratio, scale:scale};
            resolve(res);
        };
        image.onerror = (error) => {
            reject(error);
        }
    })
}

const initEdit = async () => {
    try {
        // get the scale factor of the image to segment-content
        var res :ImageInfo = <ImageInfo> await scale();
        // console.log(res);
        resize = res;

        // resize the image
        const img = document.getElementById('segment-image') as HTMLImageElement;
        img.style.width = resize.w+"px";
        img.style.height = resize.h+"px";
        // resize the mask
        const mask = document.getElementById('segment-mask') as HTMLImageElement;
        mask.style.width = resize.w+"px";
        mask.style.height = resize.h+"px";
        mask.style.opacity = props.opacity.toString();
        // resize the canvas
        const canvas = <HTMLCanvasElement>document.getElementById('segment-canvas');
        canvas.width = resize.w;
        canvas.height = resize.h;

    } catch (error) {
        console.error("Error scaling the image");
    }

    editMask.value = <string>props.fullMaskUrl;
    
    // get the bbox list
    var json = JSON.parse(<string>props.jsonData);
    // console.log(tmp.data.annotations);
    bboxlist = json.data.annotations.map(item => item.bbox);

    // add the scale bbox
    for (var i = 0; i < bboxlist.length; i++) {
        var bbox : number[] = bboxlist[i];
        for (var j = 0; j < 4; j++) {
            bbox.push(bbox[j]*resize.scale);
        }
        bbox.push(0); // hovered
        bbox.push(0); // selected
    }
    // console.log(bboxlist);
    drawAllBbox();
}

const isMouseInAnnotation = (mouseX: number, mouseY: number, bbox: number[]): boolean => {
    if (mouseX >= bbox[0] && mouseX <= bbox[0]+bbox[2] && mouseY >= bbox[1] && mouseY <= bbox[1]+bbox[3]) {
        return true;
    } else {
        return false;
    }
}

const drawAllBbox = () => {
    // console.log('===drawAllBbox===');
    const canvas = <HTMLCanvasElement>document.getElementById('segment-canvas');
    canvas.width = resize.w;
    canvas.height = resize.h;
    const ctx = canvas?.getContext('2d',{ willReadFrequently: true });
    if (ctx) {
        // ctx.clearRect(0, 0, resize.w, resize.h);
        ctx.strokeStyle = "#B50101";
        ctx.lineWidth = 1;
        bboxlist.forEach(bbox => {
            if (bbox[8] == 1 || bbox[9] == 1) {
                ctx.strokeRect(bbox[4],bbox[5],bbox[6],bbox[7]);
            }
        });
        ctx.stroke();
    }
}

const handleMouseMove = (event: MouseEvent)  => {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // console.log(mouseX, mouseY);

    isDraw.value = false;
    bboxlist.forEach(bbox => {
        var scaleBbox = bbox.slice(4,8);
        // console.log(bbox,scaleBbox);
        if (isMouseInAnnotation(mouseX, mouseY, scaleBbox)) {
            // console.log('true');
            if (bbox[8] == 0 && bbox[9] == 0) {
                isDraw.value = true;
            }
            bbox[8] = 1;
        } else {
            if (bbox[8] == 1 && bbox[9] == 0) {
                isDraw.value = true;
            }
            bbox[8] = 0;
        }
    });
    if (isDraw.value) {
        drawAllBbox();
    }
}

const handleMouseDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // console.log(mouseX, mouseY);
    bboxlist.forEach(bbox => {
        var scaleBbox = bbox.slice(4,8);
        if (isMouseInAnnotation(mouseX, mouseY, scaleBbox)) {
            // console.log('true');
            if (bbox[9] == 0) {
                bbox[9] = 1;
            } else {
                bbox[9] = 0;
            }
            bbox[8] = 1;
            // return;
        }
    });
    var selectIdx = bboxlist.map(item => item[9]);
    selectNum.value = selectIdx.filter((idx => idx == 1)).length;
    drawAllBbox();
    // console.log("====mousedown=====");
    // console.log(bboxlist);
}

const reset = () => {

    selectNum.value = 0;
    const mask = document.getElementById('segment-mask') as HTMLImageElement;
    mask.src = <string>props.fullMaskUrl;
    mask.style.width = resize.w+"px";
    mask.style.height = resize.h+"px";
    mask.style.opacity = props.opacity.toString();
    editMask.value = <string>props.fullMaskUrl;

        // get the bbox list
    var json = JSON.parse(<string>props.jsonData);
    // console.log(tmp.data.annotations);
    bboxlist = json.data.annotations.map(item => item.bbox);

    // add the scale bbox
    for (var i = 0; i < bboxlist.length; i++) {
        var bbox : number[] = bboxlist[i];
        for (var j = 0; j < 4; j++) {
            bboxlist[i].push(bbox[j]*resize.scale);
        }
        bboxlist[i].push(0); // hovered
        bboxlist[i].push(0); // selected
    }

    drawAllBbox();
    // console.log("====reset=====");
    // console.log(bboxlist);
}

const removeSelectedMask = async () => {
    if (selectNum.value == 0) return;
    // console.log("====before remove=====");
    // console.log(bboxlist);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = await loadImage(editMask.value);
    canvas.height = img.height;
    canvas.width = img.width;

    if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0,0,img.width,img.height);
        const data = imageData.data;
        // console.log(data.filter(val => val > 0 ).length);
        bboxlist.forEach(bbox => {
            if (bbox[9] == 1) {
                // console.log(bbox);
                for (var w = bbox[0]; w <= bbox[0]+bbox[2]; w++) {
                    for (var h = bbox[1]; h <= bbox[1]+bbox[3]; h++) {
                        var index = (h * naturalSize.w + w) * 4;
                        data[index] = 0;
                        data[index+1] = 0;
                        data[index+2] = 0;
                        data[index+3] = 0;
                    }
                }
            }
        })
        ctx.putImageData(imageData,0,0);
        editMask.value = canvas.toDataURL();
        // console.log(editMask.value);

        const mask = document.getElementById('segment-mask') as HTMLImageElement;
        mask.src = editMask.value;
        mask.style.width = resize.w+"px";
        mask.style.height = resize.h+"px";
        mask.style.opacity = props.opacity.toString();

        bboxlist = bboxlist.filter(item => item[9] !== 1);
        // console.log(bboxlist);
        var selectIdx = bboxlist.map(item => item[9]);
        selectNum.value = selectIdx.filter((idx => idx == 1)).length
        drawAllBbox();
        // console.log("====after remove=====");
        // console.log(bboxlist);
    }
    
}


const isEqualBbox = (a:number[], b:number[]) => {
    for (var i = 0; i < 4; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

const saveRemove = async () => {
    removeSelectedMask().then( () => {
            // console.log("====save=====");
            // console.log(bboxlist);
            var json = JSON.parse(<string>props.jsonData);
            var remainBboxlist = bboxlist.map(item => item.slice(0, 4));
            var anno = json.data.annotations.filter(item => remainBboxlist.some(arr => isEqualBbox(arr, item.bbox)));
            resultJson = json;
            resultJson.data.annotations = anno;
            // console.log(anno);
            resultMask = editMask.value;
            var result = {'editJson': resultJson, 'editMask': resultMask};
            emit('editResult', result);
        }
    )
    
}

onMounted(() => {
    initEdit();
})

</script>

<style>
.segment-box {
    position: relative;
    display: flex;
    /* margin-top: 100px; */
    /* margin-left: 20px; */
    width: 1100px;
    height: 680px;
    text-align: center;
}
.segment-wrapper {
    position: absolute;
    left: 50px;
    top: 35px;
}
.segment-content {
    position: absolute;
    left: 50px;
    top: 35px;
}
.segment-point {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #409EFF;
}
.segment-point.negative {
    background-color: #F56C6C;
}
#segment-image {
    z-index: 1;
}
#segment-mask {
    mix-blend-mode: multiply;
    z-index: 20;
}
#segment-canvas {
    pointer-events: none;
    transform-origin: left top;
    z-index: 50;
}
#point-box {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    pointer-events: none;
}

.edit-type {
    display: block;
    position: relative;
    top: 40%;
    height: 100px;
}

.tabs {
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #fff;
    box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
    padding: 0.75rem;
    border-radius: 8px;
}

.tabs * {
    z-index: 2;
}

.edit-type input[type="radio"] {
    display: none;
}

.tab {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    width: 60px;
    font-size: 14px;
    color: black;
    font-weight: 500;
    border-radius: 99px;
    cursor: pointer;
    transition: color 0.15s ease-in;
}

/* .edit-type input[type="radio"]:checked + label {
    color: #139FE1;
}

.edit-type input[id="type-rmv"]:checked ~ .glider {
    transform: translateY(0);
}

.edit-type input[id="type-add"]:checked ~ .glider {
    transform: translateY(100%);
} */


.glider {
    position: absolute;
    display: flex;
    height: 30px;
    width: 60px;
    background-color: #e6eef9;
    z-index: 1;
    border-radius: 8px;
    transition: 0.25s ease-out;
}

@media (max-width: 700px) {
    .tabs {
        transform: scale(0.6);
    }
}
.tool-bar {
    display: flex;
    justify-content: space-between;
    position: inherit;
    top:0;
    height: 40px;
    gap: 16px;
    text-align: center;
    .tool-tip {
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        padding: 10px;
    }
}
.tools {
    /* border: 1px solid gray; */
    border-radius: 4px;
    background-color: #EDEEF1;
    display: flex;
    justify-content: space-between;
    margin:2px;
}
.tool-item {
    font-size: 14px;
    font-weight: 600;
    padding: 8px 10px;
    cursor: pointer;
}
/* .tool-item:hover {
    background-color: white;
    color: white;
} */
.tool-item.disabled {
    opacity: 0.4;
    pointer-events: none;
}
</style>
