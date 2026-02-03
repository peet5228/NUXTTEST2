<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">รายงานผู้รับการประเมินผลทั้งหมด</h1>
                    </v-sheet>
                    <v-card-text>
                        รายชื่อผู้รับการประเมินผล
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อ-นามสกุล</th>
                                    <th class="border text-center">อีเมล</th>
                                    <th class="border text-center">ชื่อผู้ใช้</th>
                                    <!-- <th class="border text-center">จัดการ</th> -->
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_member">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}<br><span class="opacity-80">{{ items.role }}</span></td>
                                    <td class="text-center border">{{ items.email }}</td>
                                    <td class="text-center border">{{ items.username }}</td>
                                </tr>
                                <tr v-if="result.length === 0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                        <br><br>
                        <center><v-btn color="warning" prepend-icon="mdi-printer" class="noP" @click="print()">พิมพ์</v-btn></center>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'
import { consoleError } from 'vuetify/lib/util/console.mjs'

const token = process.client ? localStorage.getItem("token") : null

const result = ref([])




const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/member/eva`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}


const print = () => {
    window.print()
}

onMounted(fetch)
</script>

<style scoped>
@media print{
    .v-btn,.noP{
        display: none;
    }
}
</style>