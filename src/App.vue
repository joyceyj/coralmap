<template>
    <div class="side-menu">
        <Menu></Menu>
    </div>
    
    <div class="main-content">
        <RouterView ></RouterView>
    </div>

    <div class="foot">
        <!-- <p>CoralSCOP</p> -->
    </div>
    

</template>

<script lang="ts" setup>

</script>

<style scoped>

.main-content {
    width: 100vw;
    height: auto;
    /* margin-bottom: 20px; */
    background-color: #FAFAFA;
    display: flex;
    justify-content: center;
}
.side-menu {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1600;
}
.foot {
    width: 100vw;
    height: 120px;
    /* margin-top: 20px; */
    /* background-color: rgb(19, 159, 225); */
    /* background-color: #FAFAFA; */
    p {
        color: white;
        font-family: MarkerFelt;
        font-weight: bold;
        font-size: 26px;
        margin: 0;
        position: relative;
        top: 30px;
        left: -500px;
    }
}
</style>
