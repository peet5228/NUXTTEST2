<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
                    <h1 class="text-h5 font-weight-bold">คะแนนประเมินกรรมการ</h1>
                    <v-row class="mt-4" v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="indicate in topic.indicates" :key="indicate.id_indicate">
                                    <td class="text-center border pa-1">{{ indicate.name_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.detail_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.point_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.point_indicate*4 }}</td>
                                    <td class="text-center border pa-1">{{ indicate.score_commit*indicate.point_indicate || 0 }}</td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="text-end mt-4">
                        <v-card class="pa-2" color="success">คะแนนรวม : {{ totalScore.toFixed(0) }} คะแนน</v-card>
                    </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 1" type="info">ยังไม่ได้กรอกแบบประเมิน</v-alert>
                <v-alert v-else type="warning">ยังไม่มีแบบประเมิน</v-alert>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {commit} from '../../API/base'
import { I } from 'vue-router/dist/router-CWoNjPRp.mjs'

const topics = ref<any>([])
const user = ref<any>({})
const id_eva = useRoute().params.id_eva
const totalScore = ref(0)

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,"__blank")
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/score_commit/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error Get User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${commit}/score_commit/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
        res.data.forEach(s => s.indicates.forEach((i:any) => totalScore.value += (i.score_commit*i.point_indicate)))
    }catch(err){
        console.error('Error Get User!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopic()])
})

</script>

<style scoped>

</style>