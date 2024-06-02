<template>
    <el-dialog 
        append-to-body
        width="400"
        class="login-dialog"
        v-model="dialogLogInVisible"
    >
        <form class="form">
            <p class="form-title">Log in</p>
            <div class="input-container">
                <input required v-model="longinData.email" type="email" placeholder="Enter email">
                <span></span>
            </div>
            <div class="input-container">
                <input required v-model="longinData.password" type="password" placeholder="Enter password">
            </div>
            
            <button type="button" class="submit" @click="handleLogin">Log in</button>

            <p class="signup-link">
                No account?
                <span class="link-span" @click="handleTurnSignup">Sign up</span>
            </p>
        </form>
    </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { userInfoStore } from '@/store/user'
// axios api setting
axios.defaults.baseURL =
  process.env.NODE_ENV === "development" ? "" : "https://coralscop-bke.hkustvgd.com/api/v1";
const base = process.env.NODE_ENV === "development" ? "/bke" : "";

const dialogLogInVisible = ref(false);
var longinData = {
            'email': '',
            'password': '',
            'token': '',
            'fullname': '',
        };
const userStore = userInfoStore();
// const checkLoginValid = () => {
//     if (longinData.email || longinData.password) {
//         return false;
//     }
// }

const emit = defineEmits(['openSignup']);


const handleLogin = async () => {
    try {
        console.log("===login===");
        // console.log(process.env.NODE_ENV);
        // console.log(base);
        const result = await axios.post(base+'/user/login', longinData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(result);
        if (result.status == 200) {
            userStore.setIsLogin(true);
            longinData.token = result.data.access_token;
            userStore.setUserInfo(longinData);
        } else {
            ElMessage.success(result.data.message);
        }
        console.log(userStore.isLogin);
        
    } catch (err) {
        console.error(err);
    }
};

const handleTurnSignup = () => {
    dialogLogInVisible.value = false;
    emit('openSignup');
}

const open = () => {
    dialogLogInVisible.value = true;
}

defineExpose({
    open
})

</script>

<style>
.login-dialog {
    border-radius: 20px;
    padding: 20px;
}

.form {
  background-color: #fff;
  display: block;
  padding: 1rem;
  max-width: 350px;
}

.form-title {
  font-size: 28px;
  line-height: 1.75rem;
  font-weight: 600;
  text-align: center;
  color: #000;
  margin-top: 0;
}

.input-container {
  position: relative;
}

.input-container input, .form button {
  outline: none;
  border: 1px solid #e5e7eb;
  margin: 8px 0;
}

.input-container input {
  background-color: #fff;
  padding: 16px;
  /* padding-right: 3rem; */
  font-size: 0.875rem;
  line-height: 1.25rem;
  width: 288px;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.submit {
  display: block;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  background-color: #139FE1;
  color: #ffffff;
  font-size: 18px;
  line-height: 1.25rem;
  font-weight: 500;
  width: 100%;
  border-radius: 0.5rem;
  text-transform: uppercase;
}

.signup-link {
  color: #6B7280;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
}

.link-span {
  color: #551A8B; /* Link color */
  cursor: pointer; /* Change cursor to pointer on hover */
  text-decoration: underline;
}


</style>
  @/store/user