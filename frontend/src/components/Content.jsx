import React, { createContext, useContext, useState } from "react";
import '../CSS/content.css';
import Date from "./date";
import Todo from "./todo";
import Pomodoro from "./pomodoro";
import {Taskpopup} from "../components/Popup"
import { authContext } from "../App";

import Todolist from "./todolist";
const PopContext = createContext();

function Content() {

  const [Popup, SetPopup]= useState(false)
  const [inputValue, setInputValue] = useState({content: "", checked: false, startDate: "",endDate: "",priority: "Low",});
  const [task, setTask] = useState([]);
  const [update, setUpdate] = useState('false');
  const Auth= useContext(authContext);
    return (
      
        <div>
       
            <div className="contentcontainer">
                <div className="upper-tab">

                       <div className="name">
                        {"Welcome, "+Auth.User.displayName}
                      </div>

                      <div className="time">
                      
                        <Date></Date>
                      
                      </div> 

                </div>

                <div className="lower-tab1">

                
                    {/* <div className=" b b1" style={{zIndex:'1001'}}> */}

                    {
                      Popup && <PopContext.Provider value={{Popup,SetPopup,inputValue,setInputValue,task,setTask, update,setUpdate}}><Taskpopup onclose={()=>{SetPopup(false)}}></Taskpopup></PopContext.Provider> 
                    }


                    {/* </div> */}

                    

                   

                   


                  <PopContext.Provider value={{Popup,SetPopup,inputValue,setInputValue,task,setTask, update, setUpdate}}>
                    <Todo></Todo>
                  </PopContext.Provider>
                   

                    <div className=" b b3">

                        <div className="calender">
                         <iframe
                           src="https://calendar.google.com/calendar/embed?src=sudeepti2006%40gmail.com&ctz=Asia%2FKolkata"
                           style={{ border: "0" }}
                           width="367"
                           height="300"
                           frameBorder="0"
                           scrolling="no"
                           title="Google Calendar"
                           
                         ></iframe>
                       </div>
                        
                    </div>
                   
              
                    
                    
                </div>
                <div className="lower-tab1">
                <Todolist></Todolist>
               <Pomodoro></Pomodoro>
                </div>
               
         </div>
    </div>
        
    );
}

export default Content;
export {PopContext}
