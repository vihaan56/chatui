import * as React from "react";

// import ImageIcon from '@mui/icons-material/Image';
// import WorkIcon from '@mui/icons-material/Work';
// import BeachAccessIcon from '@mui/icons-material/BeachAccess';

export default function UserItem({ name, user_id,lastmessage }) {
  var param = "/chatbox/" + user_id;
   if(lastmessage.length > 39){
      lastmessage = lastmessage.substring(0,39)+"..."; 
   }
  return (
    <>
      
        <div className="user">
        <a href={param} key={user_id}>
          <div className="user-items">
            <div className="image">
              <span className="image-span">
                <img alt="#" className="user-image" src="https://cdn.pixabay.com/photo/2018/04/26/16/31/marine-3352341_960_720.jpg" />
              </span>
            </div>
            <div className="username">
              <div className="username-flex">
                <div className="name">{name}</div>
                <div className="last-message">{lastmessage===""?'click to chat':lastmessage}</div>
              </div>
            </div>
          </div>
          </a>
        </div>
    </>
  );
}
