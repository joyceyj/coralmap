<template>
    <div class="segment-box">
        <div class="edit-type">
            <div class="tabs">
                <input type="radio" id="type-label" name="tabs" v-model="editType" value="label" @change="handleChangeEditType" checked />
                <label class="tab" for="type-label">Label</label>
                <input type="radio" id="type-rmv" name="tabs" v-model="editType" value="rmv" @change="handleChangeEditType" />
                <label class="tab" for="type-rmv">Remove</label>
                <!-- <input type="radio" id="type-add" name="tabs" v-model="editType" value="add">
                <label class="tab" for="type-add" name="tabs">Add</label> -->
                
                <span class="glider"></span>
            </div>
        </div>

        <div class="tool-bar" v-if="editType === 'label'">
            <span class="tool-tip">Click & Select</span>
            <div class="label-set">
                <span class="label-set-title">Label Set</span>
                <div class="label-set-item">
                    <el-tag v-for="key in Object.keys(labelTag)" :key="key" class="label-item" effect="dark" :color="labelTag[key]" :closable="key != 'coral' && key != 'non-coral'" @close="handleCloseTag(key)" type="info" round>{{ key }}</el-tag>
                    <el-input v-if="inputTagVisible" ref="InputTagRef" v-model="inputTagValue" @keyup.enter="handelInputTagConfirm" @blur="handelInputTagConfirm" style="width: 130px; height: 24px;" />
                    <button v-else class="input-tag-btn" @click="showInputTag">+ New Label</button>
                </div>
            </div>
            <div class="label-selector">
                <el-select-v2 placeholder="click a mask" v-model="selectedLabel" :options="labelOptions" filterable style="width: 130px;" @change="handleSelectLabel"/>
            </div>
            <div class="tools">
                <span class="tool-item" @click="saveLabel">Save</span>
            </div>
        </div>

        <div class="tool-bar" v-if="editType === 'rmv'">
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
import { ElInput } from 'element-plus'
import { rleArrToBinaryMask } from '@/helper/maskUtils'
import { isPointInBoundingBox, isPointInPolygon } from '@/helper/pointIn'

interface ImageInfo {
    w: number;
    h: number;
    scale: number;
    ratio: number;
}
// interface LabelInfo {
//     id: number;
//     label: string;
// }

const props = defineProps({
    jsonData: { type: String },
    imageUrl: { type: String },
    fullMaskUrl: { type: String },
    opacity: {type: Number, default: 0.3},
});

const emit = defineEmits(['editResult']);

const editType = ref('label');
// watch(editType, (newValue) => {
//     console.log('selected value:', newValue);
// });
const inputTagVisible = ref(false);
const InputTagRef = ref<InstanceType<typeof ElInput>> ();
const inputTagValue = ref('');
// var labelList :LabelInfo[] = [];
var colors = [
  '#FF667F', // Red
  '#FF9966', // Green
  '#FFE666', // Blue
  '#6464D8', // Orange
  '#7FFF66', // Magenta
  '#FF470A', // Yellow
  '#66FFE6', // Cyan
  '#66CCFF', // Purple
  '#996600', // Dark Green
  '#9966FF', // Pink
  '#E666FF', // Maroon
  '#00EB4E', // Olive
  '#EB009C', // Teal
  '#B82E00', // Orange Red
  '#B7B771', // Indigo
];
const labelTag :Ref<Object> = ref({'coral': colors[0], 'non-coral': colors[1]});
const selectorVisible = ref(false);
const selectedLabel = ref('');
const labelOptions = ref(Object.entries(labelTag.value).map(([key,]) => ({label: key, value: key})));
const currentSelectId:Ref<number> = ref(-1);

const windowSize :ImageInfo = {h:615, w:1024, ratio: 1024.0/615.0, scale: 1.0};
var resize :ImageInfo = {h:615, w:1024, ratio: 1024.0/615.0, scale: 1.0};
var naturalSize :ImageInfo = {h:615, w:1024, ratio: 1024.0/615.0, scale: 1.0};

var bboxlist :any[][] = [];
var maskList :any[][] = [];

const selectNum = ref(0);
// const clicks = [];
// const clickHistory = [];

const isDraw = ref(false);
const editMask = ref('');

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
    bboxlist = json.data.annotations.map(item => {
        var list = item.bbox;
        // add the scale bbox
        var scalelist = list.map(point  => point * resize.scale);
        var resultlist = list.concat(scalelist);
        resultlist.push(0); // hovered
        resultlist.push(0); // selected
        resultlist.push(item.id); // id
        resultlist.push(item.label || 'coral'); // label
        return resultlist;
        
    });
    // console.log(bboxlist);
    drawAllBbox();

    // get the label list
    var exitLabel = bboxlist.reduce((acc, arr) => {
        var label = arr[11];
        acc[label] = label;
        return acc;
    }, {});
    labelTag.value = Object.assign({}, labelTag.value, exitLabel);
    Object.keys(labelTag.value).forEach((key, index) => {
        labelTag.value[key] = colors[index % colors.length];
    });
    // console.log(labelTag.value);
    labelOptions.value = Object.entries(labelTag.value).map(([key,]) => ({label: key, value: key}));
    nextTick(() => {
        drawLabelBbox();
    });

    // var mask_tmp = rleArrToBinaryMask(json.data.annotations[0]['uncompressed_segmentation']['counts'],json.data.annotations[0]['uncompressed_segmentation']['size']);
    // console.log(mask_tmp);
    maskList = json.data.annotations.map(item => rleArrToBinaryMask(item['uncompressed_segmentation']['counts'],item['uncompressed_segmentation']['size']));
    // console.log(maskList);
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

const drawLabelBbox = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('segment-canvas');
    canvas.width = resize.w;
    canvas.height = resize.h;
    const ctx = canvas?.getContext('2d',{ willReadFrequently: true });
    if (ctx) {
        // ctx.clearRect(0, 0, resize.w, resize.h);
        ctx.lineWidth = 1;
        bboxlist.forEach(bbox => {
            // console.log(labelTag.value[bbox[11]]);
            ctx.strokeStyle = labelTag.value[bbox[11]];
            ctx.strokeRect(bbox[4],bbox[5],bbox[6],bbox[7]);
        });
        ctx.stroke();
    }
}

const drawSelectBbox = (bbox: number[], color: string) => {
    const canvas = <HTMLCanvasElement>document.getElementById('segment-canvas');
    canvas.width = resize.w;
    canvas.height = resize.h;
    const ctx = canvas?.getContext('2d',{ willReadFrequently: true });
    if (ctx) {
        // ctx.clearRect(0, 0, resize.w, resize.h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(bbox[0],bbox[1],bbox[2],bbox[3]);
        ctx.stroke();
    }
}

const clearCanvas = () => {
    const canvas = <HTMLCanvasElement>document.getElementById('segment-canvas');
    canvas.width = resize.w;
    canvas.height = resize.h;
    const ctx = canvas?.getContext('2d',{ willReadFrequently: true });
    if (ctx) {
        ctx.clearRect(0, 0, resize.w, resize.h);
    }
}

const handleMouseMove = (event: MouseEvent)  => {
    if (editType.value == 'rmv') {
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        // console.log(mouseX, mouseY);

        isDraw.value = false;
        bboxlist.forEach(bbox => {
            var scaleBbox = bbox.slice(4,8);
            // console.log(bbox,scaleBbox);
            if (isPointInBoundingBox(mouseX, mouseY, scaleBbox)) {
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
    } else if (editType.value == 'label') {
        // console.log('label move');
    }
}

const handleMouseDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    // console.log(mouseX, mouseY);
    if (editType.value == 'rmv') {
        // console.log("====rmv mousedown=====");
        bboxlist.forEach(bbox => {
            var scaleBbox = bbox.slice(4,8);
            if (isPointInBoundingBox(mouseX, mouseY, scaleBbox)) {
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
        // console.log(bboxlist);
    } else if (editType.value == 'label') {
        console.log('===label mousedown===');
        var clearFlag = true;
        bboxlist.forEach(bbox => {
            var scaleBbox = bbox.slice(4,8);
            if (isPointInBoundingBox(mouseX, mouseY, scaleBbox)) {
                // console.log(bbox[10], bbox[11]);
                selectorVisible.value = true;
                selectedLabel.value = bbox[11];
                currentSelectId.value = bbox[10];
                drawSelectBbox(scaleBbox, labelTag.value[bbox[11]]);
                clearFlag = false;
                drawLabelBbox();
            }
        });
        
        if (clearFlag) {
            clearCanvas();
            selectedLabel.value = '';
            currentSelectId.value = -1;
            drawLabelBbox();
        }
    }
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
    bboxlist = json.data.annotations.map(item => {
        var list = item.bbox;
        // add the scale bbox
        var scalelist = list.map(point  => point * resize.scale);
        var resultlist = list.concat(scalelist);
        resultlist.push(0); // hovered
        resultlist.push(0); // selected
        resultlist.push(item.id); // id
        resultlist.push(item.label || 'coral'); // label
        return resultlist;
    });

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
            var result = {'editType': 'rmv', 'editJson': resultJson, 'editMask': resultMask};
            emit('editResult', result);
        }
    )
    
}

const handelInputTagConfirm = () => {
    if (inputTagValue.value) {
        var idx = Object.keys(labelTag.value).length;
        labelTag.value[inputTagValue.value] = colors[idx];
        labelOptions.value = Object.entries(labelTag.value).map(([key,]) => ({label: key, value: key}));
    }
    inputTagVisible.value = false;
    inputTagValue.value = '';
}

const showInputTag = () => {
    inputTagVisible.value = true;
    nextTick(() => {
        InputTagRef.value!.input!.focus();
    });
}

const handleCloseTag = (tag: string) => {
    delete labelTag.value[tag];
    labelOptions.value = Object.entries(labelTag.value).map(([key,]) => ({label: key, value: key}));
    bboxlist = bboxlist.map(bbox => {
        var newItem = bbox;
        if (newItem[11] == tag) newItem[11] = 'coral';
        return newItem;
    });
}

const handleSelectLabel = () => {
    bboxlist.forEach(bbox => {
        if (currentSelectId.value == bbox[10]) {
            bbox[11] = selectedLabel.value;
        }
    });
    drawLabelBbox();
}

const saveLabel = () => {
    console.log("===save label===");
    var json = JSON.parse(<string>props.jsonData);
    var anno = json.data.annotations.map(item => {
        var label:any[] = bboxlist.filter(bbox => bbox[10] == item.id);
        var newItem = item;
        newItem['label'] = label[0][11];
        // console.log(label);
        return newItem;
    });
    // console.log(anno);
    resultJson = json;
    resultJson.data.annotations = anno;
    var result = {'editType': 'label', 'editJson': resultJson};
    emit('editResult', result);
}

const handleChangeEditType = () => {
    if (editType.value == 'rmv') {
        drawAllBbox();
    } else if (editType.value == 'label') {
        drawLabelBbox();
    }
}

onMounted(() => {
    initEdit();
})

</script>

<style>
.segment-box {
    position: relative;
    display: flex;
    width: 1168px;
    height: 680px;
    text-align: center;
}
.segment-wrapper {
    position: absolute;
    left: 55px;
    top: 35px;
    width: 1100px;
    height: 680px;
}
.segment-content {
    position: absolute;
    left: 55px;
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
    border-radius: 24px;
    cursor: pointer;
    transition: color 0.15s ease-in;
}

.edit-type input[type="radio"]:checked + label {
    color: #139FE1;
}

.edit-type input[id="type-label"]:checked ~ .glider {
    transform: translateY(0);
}

.edit-type input[id="type-rmv"]:checked ~ .glider {
    transform: translateY(100%);
}


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
    left: 20px;
    height: 60px;
    width: 1024px;
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
    border: 1px solid #F1F1F3;
    border-radius: 8px;
    background-color: white;
    color: #111110;
    display: flex;
    justify-content: space-between;
    margin:2px;
    height: 32px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    margin: 10px;
}
.tool-item {
    font-size: 14px;
    font-weight: 600;
    padding: 6px 10px;
    cursor: pointer;
    /* border: 1px dotted grey; */
}
.tool-item:hover {
    color: #139FE1;
}
.tool-item.disabled {
    opacity: 0.4;
    pointer-events: none;
}
.label-set {
    display: flex;
    flex-direction: column;
    justify-items: start;
    width: 500px;
    z-index: 80;
}
.label-set-title {
    font-size: 16px;
    font-weight: 500;
    /* text-align: left; */
}
.label-set-item {
    display: flex;
    justify-items:left;
    gap: 8px;
    overflow: auto;
    scrollbar-width: thin;
    height: 35px;
}
.label-item {
    /* background-color: #139FE1; */
    /* color: white; */
    font-size: 16px;
    font-weight: 600;
}
.input-tag-btn {
    background-color: white;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    height: 24px;
    width: 100px;
    min-width: 100px;
    font-size: 14px;
    padding: 0 8px 0 8px;
    color: #606266;
    cursor: pointer;
}
.input-tag-btn:hover {
    color: #139FE1;
    border-color: #139FE1;
}
.label-selector {
    width: 130px;
    padding: 10px;
}

</style>
