import React, { useState, useEffect } from "react";
import { doc, setDoc, Timestamp, updateDoc, getDocs, getDoc, collection } from "firebase/firestore"; 
import { db } from './firebase-config';

function Timer( {gameOver, setGameOver, startTime, setStartTime, start, setStart, endTime, setEndTime, timerOn, setTimerOn} ) {
    const [time, setTime] = useState(0);
    const scoresAnonymousRef = doc(db, 'scores', 'anonymousUser')


 async function saveDataStart() {
    await updateDoc(scoresAnonymousRef, {
        startTime: startTime
      });
    }  


  async function saveDataEnd() {
    await updateDoc(scoresAnonymousRef, { endTime: endTime});
  }


    useEffect(() => {
        let interval = null;

        if(gameOver === true) {
            setEndTime(Date.now()/1000)
            setTimerOn(false)
            saveDataEnd()
            
        }

        if(timerOn && gameOver === false) {
          interval = setInterval(() => {
            setTime(prevTime => prevTime + 10)
          },10)
         

        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval)

    }, [timerOn, gameOver])


    useEffect(() => {
      if(start){
       
      saveDataStart()
      setStart(false) 
      }
    }, [start])

 
    return (
        <div className="timerContainer">
            <div>
            <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
            <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
            </div>
        </div>
    )
}


export default Timer