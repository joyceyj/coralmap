<template>
    <div class="app_container">
        <div class="common-layout">
            
            <el-container>
                <!-- header -->
                 <el-header class="header">
                    <div>
                        <span class="title">CoralSCOP</span>
                    </div>
                            
                    <RouterLink to="/login" class="log-in-button">
                        <span>Log in</span>
                    </RouterLink>


                    
                </el-header>
                

                <el-container>
                    <!-- aside -->
                    <el-aside class="aside">
                        <Menu />
                    </el-aside>

                    <!-- main -->
                    <el-main class="main">
                        <!-- <Map /> -->
                        <RouterView></RouterView>
                    </el-main>

                </el-container>

            </el-container>
        </div>
    </div>
</template>

<script lang="ts">

export default{
    name: 'app',
    setup(){
        
    },
    mounted() {
        this.$router.push({
            name: 'map',
        });
    },

}
</script>

<style scoped>
/* 手动配置全局样式 */
html,
body,
.app_container,
.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
}
/* 背景颜色 */
.aside {
    /* background-color: #545c64; */
    width: 170px;
    border-right: 2px solid #F2F3F7;
}
.main { 
  background-color: #F5F6FA;
}
.header {
    /* height: $headHeight;
    max-height: $headHeight; */
    /* background-color: #001529; */
    color: #168DBD;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 2px solid #F2F3F7;
    width: 100vw;
    .div {
        display: flex;
        align-items: center;
    }
    
}

.title {
    margin-left: 16px;
    font-size: 24px;
    font-family: "Poppins", "Poppins-Medium";
    font-weight: 600;
    background-image: linear-gradient(to right, #d628fe, #35a2fd);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
.log-in-button {
    display: flex;
    position: relative;
    justify-content: flex-end;
    cursor: pointer;
}

</style>
