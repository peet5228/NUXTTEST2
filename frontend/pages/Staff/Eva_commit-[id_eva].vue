<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4 text-center" color="">
                        <h1 class="text-h5 font-weight-bold">เพิ่มกรรมการ</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                
                            </v-row>
                        </v-form>

                        <br><br><br>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">กรรมการประเมิน</th>
                                    <th class="border text-center">ตำแหน่ง</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in List" :key="items.id_commit">
                                    <td class="text-center border">{{ index+1 }}</td>
                                    <td class="text-center border">{{ nameOf(items.id_member) }}</td>
                                    <td class="text-center border">{{ items.role }}</td>
                                    <td class="text-center border">
                                        <!-- <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn class="text-white" size="small" color="error" @click="del(items.id_eva)">ลบ</v-btn>
                                    </td>
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

const people = ref([])
const header = ref([])
const List = ref([
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''},
    {id_commit:null,id_member:'',role:''}
])
const role = []


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