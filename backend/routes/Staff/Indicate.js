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
router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_indicate , tb_topic where tb_indicate.id_topic=tb_topic.id_topic order by id_indicate desc`)
        // res.json({rows,message:''})
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ GET ข้อมูล where params
router.get('/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_indicate} = req.params
        const [rows] = await db.query(`select * from tb_indaicate where id_indicate='${id_indicate}'`)
        if(rows.length === 0) return res.status(403).json({message:'invalid Params'})
        // res.json({rows,message:''})
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Insert ข้อมูล
router.post('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`insert into tb_indicate (id_topic,name_indicate,detail_indicate,point_indicate,check_indicate) values (?,?,?,?,?)`,[id_topic,name_indicate,detail_indicate,point_indicate,check_indicate])
        res.json({rows,message:'Insert Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ Update ข้อมูล
router.put('/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_indicate} = req.params
        const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`update tb_indicate set id_topic=?,name_indicate=?,detail_indicate=?,point_indicate=?,check_indicate=? where id_indicate='${id_indicate}'`,[id_topic,name_indicate,detail_indicate,point_indicate,check_indicate])
        res.json({rows,message:'Update Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error Update",err)
        res.status(500).json({message:'Error Update'})
    }
})

// API สำหรับ Delete ข้อมูล
router.delete('/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_indicate} = req.params
        // const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`delete from tb_indicate where id_indicate='${id_indicate}'`)
        res.json({rows,message:'Update Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error Update",err)
        res.status(500).json({message:'Error Update'})
    }
})

module.exports = router