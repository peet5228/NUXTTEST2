const express = require('express')
const db = require('../db')
const router = express()
const bc = require('bcrypt')
const {verifyToken,requireRole} = require('../middleware/authMiddleware')

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
router.get('/staff',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva`)
        const [[one]] = await db.query(`select count(*)as total from tb_eva where status_eva!=3`)
        const [[two]] = await db.query(`select count(*)as total from tb_eva where status_eva=3`)
        const [[eva]] = await db.query(`select count(*)as total from tb_member where role='ผู้รับการประเมินผล'`)
        const [[commit]] = await db.query(`select count(*)as total from tb_member where role='กรรมการประเมิน'`)
        res.json({
            box : [
                {title: 'แบบประเมินทั้งหมด' , value: evaCount.total || 0},
                {title: 'แบบประเมินที่ไม่สำเร็จ' , value: evaCount.total > 0 ` ${ ( one.total*100/evaCount.total ).toFixed(2) }% ` : '00.00%'},
                {title: 'แบบประเมินที่สำเร็จ' , value: evaCount.total > 0 ` ${ ( two.total*100/evaCount.total ).toFixed(2) }% ` : '00.00%'},
            ],
            box : [
                {title: 'แบบประเมินทั้งหมด' , value: evaCount.total || 0},
                {title: 'แบบประเมินที่ไม่สำเร็จ' , value: evaCount.total > 0 ` ${ ( one.total*100/evaCount.total ).toFixed(2) }% ` : '00.00%'},
                {title: 'แบบประเมินที่สำเร็จ' , value: evaCount.total > 0 ` ${ ( two.total*100/evaCount.total ).toFixed(2) }% ` : '00.00%'},
            ]
        })
        // res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:'Error Get'})
    }
})

module.exports = router