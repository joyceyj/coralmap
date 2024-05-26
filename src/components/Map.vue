<template>
    <!-- <div class="map-title">
        <p>MAP OF SOURCES</p>
    </div> -->
    <div class="map-container" id="mapRef">
        <!-- <l-map
            v-model="zoom"
            v-model:zoom="zoom"
            :center="[47.41322, -1.219482]"
            @move="log('move')" class="map-content">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">

            </l-tile-layer>
        </l-map> -->
    </div>
    <div class="map-statistic">
        <el-row :gutter="16">
            <el-col :span="8">
                <div class="statistic-card">
                    <el-statistic :value="locNum">
                        <template #title>
                            <div class="card-title">
                                Number of sites
                            </div>
                        </template>
                    </el-statistic>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistic-card">
                    <el-statistic :value="imageNum">
                        <template #title>
                            <div class="card-title">
                                Number of images
                            </div>
                        </template>
                    </el-statistic>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistic-card">
                    <el-statistic :value="annotationNum">
                        <template #title>
                            <div class="card-title">
                                Number of annotations
                            </div>
                        </template>
                    </el-statistic>
                </div>
            </el-col>
        </el-row>
    </div>
</template>


  
<script lang="ts" setup>
import L, { Point } from "leaflet";
import "leaflet/dist/leaflet.css";

import axios from 'axios'

// axios api setting
const bkeUrl = "https://coralscop-bke.hkustvgd.com";
axios.defaults.baseURL =
  process.env.NODE_ENV === "development" ? "" : "https://coralscop-bke.hkustvgd.com/api/v1";
const base = process.env.NODE_ENV === "development" ? "/bke" : "";

const locNum = ref(0);
const imageNum = ref(0);
const annotationNum = ref(0);
var map;
var summaryData;
var siteData = {};

import blueicon from '@/assets/marker_blue.svg'
var publicIcon = L.icon({
    iconUrl: blueicon,            // Name of Material icon
    iconSize: [30, 30]                 // Width and height of the icon
});
// var privateIcon = L.icon({
//     iconUrl: './src/assets/marker_green.svg',            // Name of Material icon
//     iconSize: [30, 30]                 // Width and height of the icon
// });

const getSummaryData = async () => {
    var res = await axios.get(base+'/summary/images');
    summaryData = res.data;
    // console.log(summaryData);
    imageNum.value = summaryData.length;
}

// const myGoogleMapToken = 'AIzaSyDRqsEg7eFHRm0GB1XoLXfG_HY7PectB94';
// const GoogleMapGeocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
// // google map
// const getSiteName = async (latitude,longitude) => {
    
//     var res = await axios.get(GoogleMapGeocodingUrl , {
//         params: {
//             latlng: latitude.toString()+","+longitude.toString(),
//             key: myGoogleMapToken,
//             language: 'en',
//         }
//     });
//     console.log(res);
//     return res.data.results.formatted_address;
// }
// bigdat cloud
const getSiteName = async (latitude,longitude) => {
    var res = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        params: {
            latitude: latitude,
            longitude: longitude,
            localityLanguage: 'en',
        }
    });
    // console.log(res.data.locality);
    return res.data.locality;
}

const initMap = async () => {
    map = L.map('mapRef', {
        center: [22.505, 95.09],
        zoom: 3,
        minZoom: 3,
        maxZoom: 10,
        // noWrap: true,
        zoomControl: true,
        // attributionControl: false
    });
    // http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
    // L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png").addTo(map);
    // L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}").addTo(map);

    await getSummaryData();
    const s = new Set();
    if (summaryData.length) {
        summaryData.forEach(element => {
            // console.log(element);
            var site = element['geo']['coordinates'].join(",");
            if (!s.has(site)) {
                s.add(site);
                siteData[site] = [];
            }
            siteData[site].push(element);            
        });
        locNum.value = s.size;
        // console.log(s);
        Object.keys(siteData).forEach(async key => {
            // console.log(siteData[key]);
            const mark = L.marker(siteData[key][0]['geo']['coordinates'], {icon: publicIcon}).addTo(map);
            var sitename = await getSiteName(siteData[key][0]['geo']['coordinates'][0],siteData[key][0]['geo']['coordinates'][1]);
            // console.log(siteData[key],sitename);
            // console.log("https://coralscop-bke.hkustvgd.com"+siteData[key][0]['image_name']);
            // var content = "<b>"+sitename+"</b> <br>Number of images: "+siteData[key].length;
            var content = "<div class='popup-content'>"
                        + "<p class='popup-title'>" + sitename + "</p>"
                        + "<p> Number of images: "+siteData[key].length+"</p>"
                        + "<div class='popup-img'><img src="+bkeUrl+siteData[key][0]['image_name']+" style='width:120px;height:120px;' />";
            
            if (siteData[key].length > 1) {
                content = content + "<img src="+bkeUrl+siteData[key][1]['image_name']+" style='width:120px;height:120px;' />";
            }
            if (siteData[key].length > 2) {
                content = content + "<img src="+bkeUrl+siteData[key][2]['image_name']+" style='width:120px;height:120px;' />";
            }
            content = content + "</div></div>";
            
            mark.bindPopup(content, {
                className: 'custom-popup',
                offset: new Point(0,-10),
                // closeButton: false,
            });
        })
    }
    

}
onMounted(() => {
    initMap();
    
})

</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  height: auto;
  width: 100vw;
  display: block;
  background-color: #FAFAFA;
  font-family: system-ui,-apple-system,system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;
}
.map-container {
  height: 75vh;
  width: auto;
  border: 2px solid #E2E5E6;
}
#mapRef {
    border-radius: 6px;
}
.custom-popup {
    /* background-color: #139FE1; */
    /* color: #FAFAFA; */
    /* padding: 10px; */
    border-radius: 8px;
    width: 420px;
    /* min-width: 550px; */
}
/* .leaflet-popup-close-button {
  color: #139FE1;
  background-color: #139FE1;
} */
.popup-content {
    display: flex;
    justify-items: flex-start;
    flex-direction: column;
    width: 380px;
    gap: 5px;
    p {
        margin: 0;
    }    
}
.popup-title {
    font-weight: 600;
}

.popup-img {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.map-statistic {
    margin-top: 10px;
    margin-bottom: 25px;
}

:global(h2#card-usage ~ .example .example-showcase) {
    background-color: var(--el-fill-color) !important;
}

.el-statistic {
    --el-statistic-content-font-size: 28px;
}

.statistic-card {
    height: 100%;
    padding: 8px;
    border-radius: 6px;
    background-color: var(--el-bg-color-overlay);
}
.card-title {
    display: inline-flex; 
    align-items: center;
    font-weight: 700;
}
.popup {
    width: 200px;
    height: 100pxs;
    border-radius: 8px;
    text-align: center;
}
</style>