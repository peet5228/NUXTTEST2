<template>
  <v-app>
    <v-app-bar color="#7d0c14" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>NTC evaluation system</v-toolbar-title>
      <v-spacer />
      <!-- โปรไฟล์ -->
       <p class="text-center">ผู้ใช้งาน : {{ user.first_name }} {{ user.last_name }} <br> {{ user.role }}</p>&nbsp;&nbsp;
      <v-btn icon="mdi-logout" variant="text" @click="logout" />&nbsp;&nbsp;
    </v-app-bar>

    <ClientOnly>
    <v-navigation-drawer v-model="drawer" color="#404040" app :temporary="isMoblie" :permanent="!isMoblie">
      <v-list density="comfortable">
        <v-list-item v-for="item in navitem" :key="item.title" :to="item.to">
            <v-list-item-title>
                {{ item.title }}
            </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    </ClientOnly>

    <v-main>
      <v-container fluid class="py-6">
        <slot />
      </v-container>
      <v-footer app class="text-caption justify-center">© 2025 NTC evaluation system</v-footer>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
import axios from 'axios';
import { useDisplay } from 'vuetify';
import {api} from '../API/base'

const {mdAndDown} = useDisplay()
const isMoblie = computed(() => mdAndDown.value)
const drawer = ref(true)
const user = ref<any>({})

const roles = [
    //staff
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},

    //staff
    {title:'รายชื่อผู้รับการประเมิน',to:'/Committee/',role:'กรรมการประเมิน'},

    //staff
    {title:'หน้าหลัก',to:'/Evaluatee/',role:'ผู้รับการประเมินผล'},
]
const navitem = computed(() => roles.filter((item) => item.role.includes(user.value.role)))

const logout = async () =>{
    if(!confirm('ต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error GET Profile!',err)
    }
}
onMounted(fetchUser)
</script>