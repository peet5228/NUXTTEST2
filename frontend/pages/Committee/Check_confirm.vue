<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-h5 font-weight-bold">ตรวจสอบและยืนยันผล</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อ</th>
                                    <th class="border text-center">นามสกุล</th>
                                    <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">ผลการประเมิน</th>
                                    <th class="border text-center">ยืนยันผลประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }}</td>
                                    <td class="text-center border">{{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.day_eva }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="text-center border"><v-btn class="text-white" size="small" color="blue" @click="check(items.id_eva)">ตรวจสอบ</v-btn></td>
                                    <td class="text-center border">
                                        <!-- <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn v-if="items.signature" class="text-white" size="small" color="success" @click="go(items.id_eva)">ยืนยันผลแล้ว</v-btn>
                                        <v-btn v-else class="text-white" size="small" color="blue"  @click="go(items.id_eva)">ยืนยันผล</v-btn>
                                    </td>
                                </tr>
                                <tr v-if="result.length === 0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,commit} from '../../API/base'

const token = process.client ? localStorage.getItem("token") : null
const result = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/show_eva`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const go = (id_eva:number) => {
    navigateTo({path:`/Committee/Signature${id_eva}`})
}
const check = (id_eva:number) => {
    navigateTo({path:`/Committee/Score_commit${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>

</style>