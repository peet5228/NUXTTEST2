const express = require('express')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/signature')
const db = require('../../db')
const router = express()
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// API สำหรับ GET ข้อมูล
router.get('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(
            `select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member,id_eva]
        )
        res.json(rows[0])
    }catch(err){
        console.error("Error GET User",err)
        res.status(500).json({message:'Error GET User'})
    }
})

// API สำหรับ Uplaod ข้อมูล
router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const file = req.files?.file
        const maxSize = 10 * 1024 * 1024
        if(file.size > maxSize) return res.status(400).json({message:'ไฟล์มีขนาดใหญ่เกินไป (ไม่เกิน 10 MB)'})
        const filename = Date.now() + path.extname(file.name).toLowerCase()
        await file.mv(path.join(uploadDir,filename))
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[filename,id_eva,id_member])
        res.status(201).json({message:'Upload Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error Upload",err)
        res.status(500).json({message:'Error Upload'})
    }
})

// API สำหรับ delete ข้อมูล
router.delete('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[d]] = await db.query(`select signature from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        const fp = path.join(uploadDir,d.signature)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[null,id_eva,id_member])
        res.json({message:'Delete Success'})
        // res.json(rows)
    }catch(err){
        console.error("Error delete",err)
        res.status(500).json({message:'Error delete'})
    }
})

module.exports = router