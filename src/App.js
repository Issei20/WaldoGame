import React, { useState, useEffect } from 'react'
import championsImage from "./championslol.jpg"
import "./style.css"
import { db } from './firebase-config'
import { collection, getDocs, getDocsFromServer, doc, getDoc, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import Timer from "./Timer"
import { setSelectionRange } from '@testing-library/user-event/dist/utils';

function App() {

 const [showMenu, setShowMenu] = useState(false);
 const [xPos, setXPos] = useState(0);
 const [yPos, setYPos] = useState(0);
 const [yordles, setYordles] = useState([]);
 const [foundYordles, setFoundYordles] = useState([])
 const [gameOver, setGameOver] = useState(null)
 const yordlesCollectionRef = collection(db, "yordles")
 const [newScores, setNewScores] = useState([])
 const [highscore, setHighscore] = useState(0);
 const scoresAnonymousRef = doc(db, 'scores', 'anonymousUser');
 const scoresRef = collection(db, 'scores');
 const [userName, setUserName] = useState("anonymous");
 const [send, setSend] = useState(false)
 const [startTime, setStartTime] = useState(0);
 const [endTime, setEndTime] = useState(0);
 const [start, setStart] = useState(false)
 const [timerOn, setTimerOn] = useState(false);
 const [allScores, setAllScores] = useState([]);
 const [canShowScore, setCanShowScore] = useState(false);
 const [highest, setHighest] = useState(0);
 const [newRecord, setNewRecord] = useState(false);


 // get data from firestore database
 useEffect(() => {
  const getYordles = async () => {
    const data = await getDocs(yordlesCollectionRef);
    setYordles(data.docs.map((doc) => ({...doc.data(),  id: doc.id})))
  }

  getYordles();

 }, []);
 


 // get the pos of the mouse for the drop down menu on click
useEffect(() => {
  function handleClick(e) {
    if(gameOver === false){
    if(!showMenu) {
    setShowMenu(!showMenu)
    setXPos(e.pageX)
    setYPos(e.pageY)
    console.log(xPos, yPos)
    } else if (showMenu) {
      setShowMenu(!showMenu)
    }
  }
  }
   document.addEventListener('click', handleClick)
   return function cleanupListener() {
    document.removeEventListener('click', handleClick)
  }

  },[showMenu, setShowMenu, gameOver])


 // check pos of the yordles with firestore backend
  function checkValidity(e) {
    yordles.forEach((yordle) => {
     if(!yordle.found) { 
      if( (((xPos <= yordle.coordX+15 && yPos <= yordle.coordY+15 ) && (xPos >= yordle.coordX-15 && yPos >= yordle.coordY-15 ))
       || ((xPos <= yordle.coordX-15 && yPos <= yordle.coordY-15 ) && (xPos >= yordle.coordX+15 && yPos >= yordle.coordY+15 ))) && (e.target.id === yordle.name)) {
        yordle.found = true
        setFoundYordles([...foundYordles, yordle.name])
        console.log(foundYordles)
         
      }
    }
    })
  
  }
  useEffect(() => {
     if(foundYordles.length === 3 && gameOver === false){
       setGameOver(true)
       
     }
  
  },[foundYordles, gameOver])


  // drop down menu with yordles name
 function dropDownMenu() {
   return (
    <div>
    <div className="targetBox" style={{ left: xPos-25, top: yPos-25}}></div>
      <ul className="yordleList" style={{ left: xPos+54, top: yPos-45}}>
        <li id="Teemo" onClick={(e) => checkValidity(e)}>Teemo</li>
        <li id="Tristana" onClick={(e) => checkValidity(e)}>Tristana</li>
        <li id="Poppy" onClick={(e) => checkValidity(e)}>Poppy</li>
      </ul>
    </div>
  )
}


// fetch docs and pass it into an array and get the start time and end time to update the highscore
  useEffect(() => {
  if(gameOver === true) {
    async function getScoresDb () {
      const dataScores = await getDocs(scoresRef);
      setNewScores(dataScores.docs.map((doc) => ({...doc.data(),  id: doc.id})))
      const indexAnonymous = newScores.findIndex(item => item.name === "anonymous")
      setHighscore(Math.floor(newScores[indexAnonymous].endTime * 100 - newScores[indexAnonymous].startTime * 100)/100);
     await updateDoc(scoresAnonymousRef, {
      score: highscore,
    });
    const dataUserScores = await getDocs(scoresRef);
    setAllScores(dataUserScores.docs.map((doc) => ({...doc.data(),  id: doc.id})))
    
   
    setGameOver("finish")
    }
   
    getScoresDb()

  }
 },[gameOver, highscore, send, scoresAnonymousRef, newScores, scoresRef])


async function updatehigh() {
  
  await addDoc(collection(db, "scores"), {
    name: userName,
    score: highscore,
  });
  setCanShowScore(true)
 }


// if send update the database, add new user with highscore
  useEffect(() => {
  if(send) {
    updatehigh()
    setSend(false)
   
 }


}, [highscore, userName, send])

 async function sendScore() {
  console.log(highscore)
    setSend(true)
    setNewRecord(false)
    
  }
  
  useEffect(() => {
    if (gameOver === "finish") {
      let allScoresArr = allScores;
      const noAnArr = allScoresArr.filter(item => item.name !== "anonymous");
     noAnArr.sort(function(a, b){
        return a.score - b.score
      })

    setHighest(noAnArr[0].score);
     
     if (highest > highscore) { 
     
     setNewRecord(true)
     
     }
    }
  },[highscore, highest, gameOver])


  // show input for the username
  function showInputMenu() {
    return (
     <div className='showScoresDiv'>
       <label to="nameInput">You have made an highscore type your username to save your highscore</label>
     <input name="nameInput" id="nameInput" onChange={(e) => setUserName(e.target.value)}></input>
     <button onClick={() => sendScore()}>Send</button>
     </div>
    )
  }


  // render yordles found
  function renderFound() {
   return (foundYordles.map(yordle => {
        return (
          <div className="foundStyle">{yordle}</div>
        )
    }))
  }

  // render image map
  function imageRender() {
    return(<div>
      <img className="lolChampions" src={championsImage} alt="lolChampions" useMap="#lolMap" width="900" height="500"></img>
      <map name="lolMap">
      <area alt="teemo" id="Teemo" coords="525,447,571,503" shape="rect" />
     <area alt="tristana" id="Tristana" coords="537,238,578,200" shape="rect" />
     <area alt="poppy" id="Poppy" coords="250,436,189,504" shape="rect" />
       </map>
       </div>
    )
  }

  async function showUserHighscore() {
    const dataUserScores = await getDocs(scoresRef);
    setAllScores(dataUserScores.docs.map((doc) => ({...doc.data(),  id: doc.id})))
    setCanShowScore("fetched")   
  }

  useEffect(() => {
    if(canShowScore) {
      showUserHighscore()
    }
  },[canShowScore])


  // get start time and initialize the game 
  function startGame() {
    setStart(true)
    setTimerOn(true)
    setStartTime(Date.now()/1000)
    setGameOver(false)
  }

  function restartGame() {
    window.location.reload();
    return false;
  }

  function finalShow() {
    allScores.sort(function (a, b) {
      return a.score - b.score;
    });
    return(
      <div className="scoresContainer"><h1>Highscores : </h1>
    {allScores.map(item  => {
      if(item.name !== "anonymous")
      return (
        <div>
        <div className="unitScore" ><p>Score : {item.score}</p></div>
        <div><p>Username : {item.name} </p></div>
        </div>
      )
    })}
    </div>
    )
  }

  // render 
  return (
    <div className="App">
      <h1>Find the Yordles ! </h1> 
      <h2>Find Teemo, Tristana and Poppy</h2>
      <h3>Yordles found : {renderFound()} </h3>   
      <Timer gameOver={gameOver} onGameOverChange={setGameOver} startTime={startTime} setStartTime={setStartTime} 
      endTime={endTime} setEndTime={setEndTime} start={start} setStart={setStart}
      timerOn={timerOn} setTimerOn={setTimerOn}/>
      {canShowScore || gameOver ?<button className="restartBtn" onClick={() => restartGame()}>Restart</button> : null}  
      {showMenu ? dropDownMenu() : null}
      {gameOver === "finish" ? <p className="yourScore">Your score is : {highscore}</p> : null}
      {newRecord ? showInputMenu() : null }
      {gameOver === false ? imageRender() : null}
      {gameOver === null ? <button className="btnStart" onClick={() => startGame()}>Start</button> : null } 
      {canShowScore === "fetched" || gameOver === "finish" ? finalShow(): null}
        </div>
  );
}

export default App;
