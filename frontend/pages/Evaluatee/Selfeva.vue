<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form @submit.prevent="saveScore">
                    <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="pa-2 mt-2">
                        <p>ชื่อ - นามสกุล : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row class="mt-2" v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="text-h6">{{ t+1 }}.{{ topic.name_topic }}</h1>
                            <v-card class="pa-2">
                                <v-row v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                                    <p>
                                        {{ t+1 }}.{{ i+1 }} {{ indicate.name_indicate }} รายละเอียด : {{ indicate.detail_indicate }} น้ำหนักคะแนน : {{ indicate.point_indciate }} คะแนนเต็ม : {{ indicate.point_indciate*4 }}
                                    </p>
                                    <v-textarea label="คำอธิบายเพิ่มเติม(ถ้ามี)" v-model="indicate.detail_eva" rows="2"></v-textarea>
                                    <v-file-input label="file" @change="onFileChange($event,topic.id_topic,indicate.id_indicate)" accept="image/*,.pdf"></v-file-input>
                                    <v-select v-if="indicate.check_indicate === 'y'" label="ใส่คะแนนประเมิน 1-4" :items="[1,2,3,4]" v-model="indicate.score"></v-select>
                                    <v-text-field v-else label="ใส่คะแนนประเมิน 1-4" @input="indicate.score > 4 ? indicate.score = 4 : null" type="number" v-model="indicate.score"></v-text-field>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {eva} from '../../API/base'

const topics = ref<any>([])
const user = ref<any>({})

const fetchUser = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error Get User!',err)
    }
}
const fetchTopic = async () =>{
    const token = localStorage.getItem('token')
    try{
        const res = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    }catch(err){
        console.error('Error Get User!',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchUser(),fetchTopic()])
})

const saveScore = async () =>{

}
</script>

<style scoped>

</style>