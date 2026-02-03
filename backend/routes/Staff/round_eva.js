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
        const [rows] = await db.query(`select * from tb_system order by id_sys desc`)
        // res.json({rows,message:''})
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ GET ข้อมูล
router.get('/y',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_system where status_sys='y' order by id_sys desc`)
        // res.json({rows,message:''})
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

// API สำหรับ GET ข้อมูล
router.get('/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_sys} = req.params
        const [rows] = await db.query(`select * from tb_system where id_sys='${id_sys}' order by id_sys desc`)
        if(rows.length === 0) return res.status(403).json({message:'Invalid Params'})
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
        const {day_open,day_out,round_sys,year_sys,status_sys} = req.body
        const [rows] = await db.query(`insert into tb_system (day_open,day_out,round_sys,year_sys,status_sys) values (?,?,?,?,?)`,[day_open,day_out,round_sys,year_sys,status_sys])
        res.json({rows,message:'Insert Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error Insert",err)
        res.status(500).json({message:'Error Insert'})
    }
})

// API สำหรับ Update ข้อมูล
router.put('/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_sys} = req.params
        const {day_open,day_out,round_sys,year_sys,status_sys} = req.body
        const [rows] = await db.query(`update tb_system set day_open=?,day_out=?,round_sys=?,year_sys=?,status_sys=? where id_sys='${id_sys}'`,[day_open,day_out,round_sys,year_sys,status_sys])
        res.json({rows,message:'update Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error Update",err)
        res.status(500).json({message:'Error Update'})
    }
})

// API สำหรับ Delete ข้อมูล
router.delete('/:id_sys',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_sys} = req.params
        // const {day_open,day_out,round_sys,year_sys,status_sys} = req.params
        const [rows] = await db.query(`delete from tb_system where id_sys='${id_sys}'`)
        res.json({rows,message:'update Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error Update",err)
        res.status(500).json({message:'Error Update'})
    }
})

module.exports = router