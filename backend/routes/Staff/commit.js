const express = require('express')
const db = require('../../db')
const router = express()
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// ====== DEMO ======
// API สำหรับ GET ข้อมูล
// router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try{
//         const [rows] = await db.query(``)
//         // res.json({rows,message:''})
//         res.json(rows)
//     }catch(err){
//         console.error("Error Get",err)
//         res.status(500).json({message:'Error Get'})
//     }
// })
// ====== DEMO ======

// API สำหรับ GET ข้อมูล
router.get('/header/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const  {id_eva} = req.params
        const [rows] = await db.query(`select * from tb_eva,tb_system,tb_member where tb_eva.id_eva='${id_eva}' and tb_eva.id_member=tb_member.id_member and tb_eva.id_sys=tb_system.id_sys`)
        // res.json({rows,message:''})
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ GET ข้อมูล
router.get('/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        const [after] = await db.query(`select id_member,concat(first_name,' ',last_name) from tb_member where role='กรรมการประเมิน' order by id_member desc`)
        const [before] = await db.query(`select id_commit,tb_member.id_member , first_name,last_name,level_commit as role from tb_member ,tb_commit,tb_eva where tb_commit.id_eva='${id_eva}' and tb_eva.id_eva=tb_commit.id_eva and tb_commit.id_member=tb_member.id_member order by tb_member.id_memberr desc`)
        res.json({after,before})
        // res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Insert ข้อมูล
router.post('/:id_eva',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_eva} = req.params
        await db.query(`delete from tb_commit where id_eva='${id_eva}'`)
        const m = req.body
        const v = m.map(p => [id_eva,p.id_member,p.role,'n'])
        const [rows] = await db.query(`insert into tb_commit (id_eva,id_member,level_commit,sattus_member) values ?`,[v])
        res.json({message:'Insert Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports = router