<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4" color="">
                        <h1 class="text-h5 font-weight-bold">จัดการรอบการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ผู้รับการประเมิน</th>
                                    <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">สถานะการประเมิน</th>
                                    <th class="border text-center">จัดการ</th>
                                    <th class="border text-center">เพิ่มกรรมการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="text-center border">{{ items.day_eva }}</td>
                                    <td class="text-center border">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="text-center border">{{ items.status_eva === 1 ? 'ยังไม่ได้รับการประเมิน' : items.status_eva  === 2 ? 'รอกรรมการประเมิน' : 'ประเมินเสร็จสิ้น' }}</td>
                                    <td class="text-center border">
                                        <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" size="small" color="error" @click="del(items.id_eva)">ลบ</v-btn>
                                    </td>
                                    <td class="text-center border">
                                        <!-- <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn class="text-white" size="small" color="success" @click="go(items.id_eva)">เพิ่มกรรมการ</v-btn>
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
import {api,staff} from '../../API/base'

const token = process.client ? localStorage.getItem("token") : null

const result = ref([])
const member = ref([])
const round = ref([])

const form = ref({
    id_eva:null,
    id_sys:null,
    id_member:'',
    day_eva: null,
})

const reset = () => {
    form.value = {
        id_eva:null,
        id_sys:null,
        id_member:'',
        day_eva: null,
    }
}

const edit = (items:any) => {
    form.value = {...items}
}

const error = ref<Record<string,string>>({})

function validateForm(){
    error.value = {}
    const f = form.value
    if(!f.id_member)error.value.id_member='กรุณาเลือกผู้รับการประเมิน!'
    if(!f.id_sys)error.value.id_sys='กรุณาเลือกรอบการประเมิน!'
    if(!f.day_eva)error.value.day_eva='กรุณาเลือกวันที่ออกแบบประเมิน!'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const r = await axios.get(`${staff}/round_eva/y`,{headers:{Authorization:`Bearer ${token}`}})
        round.value = r.data
        const m = await axios.get(`${staff}/member/eva`,{headers:{Authorization:`Bearer ${token}`}})
        member.value = m.data
        const res = await axios.get(`${staff}/eva`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const saveMember = async () =>{
    if(!validateForm())return
    try{
        form.value.id_eva
        ? await axios.put(`${staff}/eva/${form.value.id_eva}`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/eva`,form.value,{headers:{Authorization:`Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error!',err)
    }
}

const del = async (id_eva:number) => {
    // console.log("ok")
    try{
        if(!confirm('ต้องการลบใช่หรือไม่?')) return
        await axios.delete(`${staff}/eva/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error("Error Delete",err)
    }
}

const go = (id_eva:number) => {
    navigateTo({path:`Eva_commit-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>

</style>