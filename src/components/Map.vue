<template>
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
                    <el-statistic :value="3971">
                        <template #title>
                            <div class="card-title">
                                Number of sources
                            </div>
                        </template>
                    </el-statistic>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="statistic-card">
                    <el-statistic :value="3381420">
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
                    <el-statistic :value=" 126135543">
                        <template #title>
                            <div class="card-title">
                                Number of point annotations
                            </div>
                        </template>
                    </el-statistic>
                </div>
            </el-col>
        </el-row>
    </div>
</template>


  
<script setup>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';

var publicIcon = L.icon({
    iconUrl: '../src/assets/marker_purple.svg',            // Name of Material icon
    iconSize: [30, 30]                 // Width and height of the icon
});
var privateIcon = L.icon({
    iconUrl: '../src/assets/marker_green.svg',            // Name of Material icon
    iconSize: [30, 30]                 // Width and height of the icon
});



const initMap = () => {
    // const mapRef = ref(null);
    let map;

    map = L.map('mapRef', {
        center: [51.505, -0.09],
        zoom: 3,
        minZoom: 3,
        maxZoom: 10,
        // noWrap: true,
        zoomControl: true,
        // attributionControl: false
    });
    // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    // https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png
    // https://tile.openstreetmap.org/{z}/{x}/{y}.png
    // https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png
    // http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
    // http://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const marker1 = L.marker([51.5, -0.09], {icon: publicIcon}).addTo(map)
    const marker3 = L.marker([51.5, -13], {icon: publicIcon}).addTo(map)
    const marker4 = L.marker([65, -40], {icon: publicIcon}).addTo(map)
    const marker5 = L.marker([30, -70], {icon: publicIcon}).addTo(map)
    const marker2 = L.marker([40, 13], {icon: privateIcon}).addTo(map)

}
onMounted(() => {
    initMap()
})

</script>

<style>
.map-container {
  height: 75vh;
  width: 85vw;
}
#mapRef {
    border-radius: 6px;
}
.map-statistic {
    margin-top: 5px;
    margin-bottom: 5px;
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
</style>