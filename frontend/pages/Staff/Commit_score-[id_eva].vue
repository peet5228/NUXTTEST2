<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 2 || user.status_eva === 3">
                    <h1 class="text-h5 font-weight-bold">คะแนนประเมินของกรรมการ</h1>
                    <v-card class="pa-2 mt-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">ประธาน</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">กรรมการ</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">เลขา</th>
                                    <th class="bg-grey text-black pa-1 border" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="indicate in topic.indicates" :key="indicate.id_indicate">
                                    <td class="text-center border pa-1">{{ indicate.name_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.detail_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.point_indicate }}</td>
                                    <td class="text-center border pa-1">{{ indicate.point_indicate*4 }}</td>
                                    <td class="text-center border pa-1">{{ scores[indicate.id_indicate]?.a ?? 'รอประธานประเมิน' }}</td>
                                    <td class="text-center border pa-1">{{ scores[indicate.id_indicate]?.b ?? 'รอกรรมการประเมิน' }}</td>
                                    <td class="text-center border pa-1">{{ scores[indicate.id_indicate]?.c ?? 'รอเลขาประเมิน' }}</td>
                                    <td class="text-center border pa-1">
                                        {{ (((scores[indicate.id_indicate]?.a ?? 0)+(scores[indicate.id_indicate]?.b ?? 0)+(scores[indicate.id_indicate]?.c ?? 0))/3).toFixed(2) }}
                                    </td>
                                </tr>
                            </v-table>
                        </v-col>
                    </v-row>
                    <div class="text-end mt-4">
                        <v-card class="pa-2" color="success">คะแนนรวมสุทธิ : {{ ((user.total_commit)/3).toFixed(2) }} คะแนน</v-card>
                    </div>
                    <div class="mt-4">
                        <v-card class="pa-2">
                            <label for="ข้อเสนอแนะของกรรมการ">ข้อเสนอแนะของกรรมการ</label>
                            <v-row class="mt-2">
                                <v-col cols="12" v-for="(commit,c) in commits" :key="commit.id_commit">{{ c+1 }}.{{ commit.level_commit }} : {{ commit.detail_commit || '-' }}</v-col>
                            </v-row>
                        </v-card>
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
import {staff} from '../../API/base'

const topics = ref<any>([])
const user = ref<any>({})
const scores = ref<any>([])
const commits = ref<any>([])
const id_eva = useRoute().params.id_eva

const viweFile = (filename:string) =>{
    const url = `http://localhost:3001/uploads/evadetail/${filename}`
    window.open(url,"__blank")
}

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${staff}/commit_score/user/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error Get User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${staff}/commit_score/topic/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    }catch(err){
        console.error('Error Get User!',err)
    }
}
const fetchCommit = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${staff}/commit_score/commits/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res.data
    }catch(err){
        console.error('Error Get User!',err)
    }
}
const fetchScores = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${staff}/commit_score/scores/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res.data.scores
    }catch(err){
        console.error('Error Get User!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopic(),fetchScores(),fetchCommit()])
})

</script>

<style scoped>

</style>