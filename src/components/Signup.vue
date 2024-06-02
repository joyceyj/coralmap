<template>
    <el-dialog 
        append-to-body
        width="400"
        class="signin-dialog"
        v-model="dialogSignUpVisible"
    >
        <form class="form" v-if="signUpState == 'form'">
            <p class="form-title">Sign Up</p>

            <div class="input-container">
                <input required v-model="signUpData.email" type="email" placeholder="Enter email">
                <span></span>
            </div>

            <div class="input-container">
                <input required v-model="signUpData.fullname" type="text" placeholder="Enter full name">
                <span></span>
            </div>

            <div class="input-container">
                <input required v-model="signUpData.password" type="password" placeholder="Enter password">
            </div>
            
            <button type="button" class="submit" @click="handleSignUp">Sign Up</button>

            <p style="color: red;" class="tips">{{ errorMsg }}</p>

        </form>

        <div v-if="signUpState == 'success'">
            <p class="form-title">Sign Up Success</p>
            <div class="success-animation">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
            </div>
            <p  class="tips">Log in with {{ userEmail }}</p>
            <!-- <button type="submit" class="submit" @click="handleSignUp">Continue</button> -->
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
// axios api setting
axios.defaults.baseURL =
  process.env.NODE_ENV === "development" ? "" : "https://coralscop-bke.hkustvgd.com/api/v1";
const base = process.env.NODE_ENV === "development" ? "/bke" : "";


const dialogSignUpVisible = ref(false);
var signUpData = {
            'email': '',
            'password': '',
            'fullname': '',
            'token': '',
        };
const signUpState = ref('form');
const userEmail = ref('');
const errorMsg = ref('');

const handleSignUp = async () => {
    try {
        console.log("===SignUp===");
        // console.log(process.env.NODE_ENV);
        // console.log(base);
        const result = await axios.post(base+'/user/signup', signUpData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(result.status);
        if (result.status == 200) {
            userEmail.value = result.data.email;
            signUpState.value = 'success';
        } else {
            errorMsg.value = result.data.detail[0].msg;
        }
        
    } catch (err: any) {
        console.error(err);
        if (err.response.data.detail[0].msg) {
            errorMsg.value = err.response.data.detail[0].msg;
        } else {
            errorMsg.value = err.response.data.detail;
        }
        // console.log(err.response.data.detail);
        
    }
};

const open = () => {
  dialogSignUpVisible.value = true;
}

defineExpose({
    open
})

</script>

<style>
.signin-dialog {
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

.signup-link a {
  text-decoration: underline;
}

.success-animation { margin:50px auto;}

.checkmark {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: block;
    stroke-width: 2;
    stroke: #4bb71b;
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px #4bb71b;
    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    position:relative;
    top: 5px;
    right: 5px;
   margin: 0 auto;
}
.checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #4bb71b;
    fill: #fff;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
 
}

.checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes scale {
    0%, 100% {
        transform: none;
    }

    50% {
        transform: scale3d(1.1, 1.1, 1);
    }
}

@keyframes fill {
    100% {
        box-shadow: inset 0px 0px 0px 30px #4bb71b;
    }
}
.tips {
    font-size: 16px;
    line-height: 1.75rem;
    font-weight: 500;
    text-align: center;
    color: #0c0c0c;
    margin-top: 0;
}
    
</style>
