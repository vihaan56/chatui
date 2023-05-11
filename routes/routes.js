const express = require("express");
const router = express.Router();
const con = require("../connections/db");
const moment = require("moment");
router.post("/sendmessage", async (req, res) => {
  console.log(req.body)
  var uid = req.body.user_id;
  var rid = req.body.r_id;
  var mssg = req.body.message;
  var timestamp = new Date().toString();

  

  // timestamp = Math.floor(timestamp / 1000);

  con.query(
    "SELECT * FROM `singlechat` WHERE (`user1`=? AND `user2`=?) OR (`user1`=? AND `user2`=?)",
    [uid, rid, rid, uid],
    (error, result) => {
      console.log(result)

      if (result.length > 0) {
        con.query(
          `INSERT INTO message(sender, content, chat_id, timestamp) VALUES (?,?,?,?)`,
          [uid, mssg, result[0].singlechat_id, timestamp],
          (error2, result2) => {
            var iid = result2.insertId;
            con.query(
              "UPDATE `singlechat` SET `lastmessage`=? WHERE `singlechat_id`=?",
              [iid, result[0].singlechat_id],
              (error, result) => {
                con.query(
                  "SELECT * FROM `message` WHERE `message_id`= ?",
                  [iid],
                  (error, result) => {
                    res.send(result);
                  }
                );
              }
            );
          }
        );
      } else {
        con.query(
          "INSERT INTO `singlechat`(`user1`, `user2`, `lastmessage`, `timestamp`) VALUES (?,?,?,?)",
          [uid, rid, -1, timestamp],
          (error, result) => {
            var chatid = result.insertId;
            con.query(
              `INSERT INTO message(sender, content, chat_id, timestamp) VALUES (?,?,?,?)`,
              [uid, mssg, chatid, timestamp],
              (error2, result2) => {
                var iid = result2.insertId;
                con.query(
                  "UPDATE `singlechat` SET `lastmessage`=? WHERE `singlechat_id`=?",
                  [iid, chatid],
                  (error, result) => {
                    con.query(
                      "SELECT * FROM `message` WHERE `message_id`= ?",
                      [iid],
                      (error, result) => {
                        res.send(result);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    }
  );
});
router.post('/usersdata',async (req,res)=>{

  var id = req.body.user_id;
  con.query(`SELECT user_id,name from users WHERE user_id=?`,[id],(error, result)=>{
      if(result.length > 0){
        res.json(result);
      }
  })
})

router.post('/getlastmessage',async(req,res)=>{
 var u1 = req.body.user1;
 var u2 = req.body.user2;
 con.query("SELECT * FROM `singlechat` WHERE (`user1`=? && `user2`=?) OR (`user1`=? && user2=?)",[u1,u2,u2,u1], (error,result)=>{
  if(result.length > 0){
   // result2[i].last = "vihaan";
     if(result.length == 1){
        var id = result[0].lastmessage;
        con.query(
        "SELECT * FROM message WHERE `message_id` = ?",
        [id],
        (error2, result2) => {
            res.send(result2);
            
        });
     }
     else{

       var id1 = result[0].lastmessage;
       var id2 = result[1].lastmessage;
       if(id1 > id2){
        con.query(
          "SELECT * FROM message WHERE `message_id` = ?",
          [id1],
          (error2, result2) => {
            console.log(result2);
              res.send(result2);
              
          });
       }
       else{

        con.query(
          "SELECT * FROM message WHERE `message_id` = ?",
          [id2],
          (error2, result2) => {
            console.log(result2);
              res.send(result2);
              
          });
       }
       
     }
 
  }
  else{
  res.send([]);
  }
 
});

});
router.post("/getallusers", async (req, res) => {
  var uid = req.body.user_id;
  con.query(
    "SELECT `user_id`,`name`,`username`,`timestamp` FROM users WHERE `user_id` != ?",
    [uid],
    (error2, result2) => {
      // result2[0].last = "vihaan";
    
      // result2[i].lastmessage = lastmessage;
      // console.log(result2[i])
      res.send(result2);

  
        // con.query("SELECT * FROM `singlechat` WHERE `user1`=? && `user2`=?",[uid,result2[2].user_id],(error,result)=>{
          
        //   res.send(result);

    });
});
router.post("/getusersforchat", async (req, res) => {
  var uid = req.body.user_id;
  con.query(
    `SELECT users.user_id,users.name,users.username,singlechat.lastmessage,singlechat.singlechat_id,singlechat.user1,singlechat.user2 FROM users,singlechat WHERE users.user_id!=${uid} AND (singlechat.user1 = ${uid} AND singlechat.user2 =users.user_id 
    )  `,
    (error, result) => {
      console.log(result);
      res.send({ result: result });
    }
  );
});
router.post("/fetchchat", async (req, res) => {
  var sid = req.body.user_id;
  var rid = req.body.r_id;
  var cid = [];

  con.query(
    "SELECT * FROM `singlechat` WHERE (`user1`=? AND `user2`=?) OR (`user1`=? AND `user2`=?)",
    [sid, rid, rid, sid],
    (error, result) => {
      if (result.length == 0) {
        res.send([]);
      } else if (result.length === 1) {
        con.query(
          "SELECT * FROM `message` where chat_id = ?",
          [result[0].singlechat_id],
          (error, result) => {
            if (result.length > 0) {
              res.json(result);
            } else {
              res.send([]);
            }
          }
        );
      } else {
        con.query(
          "SELECT * FROM `message` where chat_id = ? or chat_id= ?",
          [result[0].singlechat_id, result[1].singlechat_id],
          (error, result) => {
            if (result.length > 0) {
              res.json(result);
            } else {
              res.send([]);
            }
          }
        );
      }
    }
  );
});

module.exports = router;
