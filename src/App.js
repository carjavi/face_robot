/**
 * face robot
 *
 * @author Carlos Briceño
 * @originalAuthor Patrik Melander (lotAballs).
 *
 * MIT License
 */

import React, { Component } from 'react';
import iconMic from './images/mic.png'
import iconMusic from './images/music.png'
import './App.css';

class App extends Component {
  constructor(props){ // ya definido
    super(props); // ya definido
    this.ws = null; // ????
    this.timeoutSpeak = null;
    this.state = {faceClass:"face1",
                  info:"",
                  showMic:false,
                  micTextParcial:"",
                  showMusic:false,
                  musicName:"",
                  showMouthSpeaking:false,
                  mouthSpeakingWidth:250,
                  pupilTop:50,
                  pupilLeft:50,
                  hideLeftLid:true,
                  hideRightLid:true,
                  showMouth: true,
                  showMouthLaughter:false,
                  showMouthSad:false,
                  showfaceBlink: true,
                  showAngryFace: false,
                  showSadFace:false,
                  showMouthOpenSad:false,
                  showSurpriseFace: false,
                  timespeak:null}
  }

  componentDidMount(){
    this.blink()
    this.initWebsocket()
    
  }

  componentWillUnmount(){
    this.finishWebsocket()
    
  }

  initWebsocket(){
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onerror = () => console.log('WebSocket error');
    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      //this.ws.send("estoy vivo!"); // envia al server
    }
    this.ws.onclose = () => console.log('WebSocket connection closed');
    
    this.ws.onmessage = (e) => {
      var event = JSON.parse(e.data)
      console.log (event);

      switch(event.accion){
        case "escuchando":{
          if(event.estado){
              this.setState({showMic:event.estado,micTextParcial:"",showMusic:false})
          }
          else{
            if(event.texto){
              this.setState({micTextParcial:event.texto})
              setTimeout(()=>{
                this.setState({showMic:false})
              },2000)
            }
          }
          break;
        }
        case "hablar":{
            var valor = event.timeoutSpeak;
            var valor2 = valor.toString()
            console.log("timespeak:",valor2);
            // esconde
              this.setState(state => ({
                showMouthSpeaking: false,
                showMouth: false,
                showMouthSad:false,
                showMouthOpenSad:false,
                showMouthLaughter:false
              }));
              // Muestra
              this.speech();
              setTimeout(()=>{
                this.setState(state => ({
                  showMouth: true
                }))
                clearTimeout(this.timeoutSpeak);
              },valor2)
            /*
            this.setState(state => ({
              showMouthSpeaking: true
            }));
            this.speak();
            setTimeout(()=>{
              this.setState(state => ({
                showMouthSpeaking: false
              }))
              clearTimeout(this.timeoutSpeak);
            },valor2)
            */
           break;
        }
        case "laughter":{
              // esconde
              this.setState(state => ({
                showMouthSpeaking: false,
                showMouth: false,
                showMouthSad:false,
                showMouthOpenSad:false
              }));
              // Muestra
              this.setState({showMouthLaughter:true})
              setTimeout(()=>{
                this.setState(state => ({
                  showMouthLaughter: false,
                  showMouth: true
                }))
                clearTimeout();
              },1000)
              break;
        }
        case "mouthsad":{
             // esconde
              this.setState(state => ({
                showMouthSpeaking: false,
                showMouth: false,
                showMouthLaughter:false,
                showMouthOpenSad:false
              }));
              // Muestra  
              this.setState({showMouthSad:true})
              setTimeout(()=>{
                this.setState(state => ({
                  showMouthSad: false,
                  showMouth: true
                }))
                clearTimeout();
              },1000)   
              break;
        }
        case "angryface":{
            // esconde
            this.setState(state => ({
              showfaceBlink:false,
              showSadFace:false,
              showMouthSpeaking: false,
              showMouth: false,
              showMouthLaughter:false,
              hideLeftLid:false,
              hideRightLid:false,
              showMouthOpenSad:false,
              showSurpriseFace:false
            }));
            // Muestra  
            this.setState({
              showMouthSad:true,
              showAngryFace:true
            })
            break;
        }
        case "sadface":{
            // esconde
            this.setState(state => ({
              showAngryFace:false,
              showMouthSpeaking: false,
              showMouth: false,
              showMouthLaughter:false,
              hideLeftLid:false,
              hideRightLid:false,
              showMouthSad:false,
              showSurpriseFace:false,
              showMouthOpenSad:false,
            }));
            // Muestra  
            this.setState({
              showfaceBlink:true,
              showSadFace: true,
              showMouthOpenSad:true
            })
            break;
        }
        case "surpriseface":{
              // esconde
              this.setState(state => ({
                showAngryFace:false,
                showMouthSpeaking: false,
                showMouth: false,
                showMouthLaughter:false,
                hideLeftLid:false,
                hideRightLid:false,
                showMouthSad:false,
                showfaceBlink:false,
                showSadFace: false,
                showMouthOpenSad:false,
              }));
              // Muestra  
              this.setState({
                showSurpriseFace:true,
                showMouth:true
              })
              setTimeout(()=>{
                this.setState(state => ({
                  showSurpriseFace: false,
                  showfaceBlink:true
                }))
                clearTimeout();
              },2000)
              break;
        }
        case "normalface":{
              // esconde
              this.setState(state => ({
                showAngryFace:false,
                showSadFace: false,
                showMouthSpeaking: false,
                showMouthSad:false,
                showMouthLaughter:false,
                showMouthOpenSad:false,
                showSurpriseFace:false,
              }));
              // Muestra  
              this.setState({
                showfaceBlink:true,
                showMouth: true
              })
              break;
        }
        default:{
          console.warn("Accion no definida: "+ event.accion);
        }
      }
    }
  }

  finishWebsocket(){
    if(this.ws){
        this.ws.close()
    }
  }



  blink(){
      var blinkConfig = {
          delay: function() {
              return Math.random() * 5000 + 1000;
          },
          duration: function() {
              return 300 + Math.floor(Math.random() * 100);
          }
      }

      this.setState({hideLeftLid:false,hideRightLid:false})
      setTimeout(()=>{
          this.setState({hideLeftLid:!this.state.leftEyeTouching,hideRightLid:!this.state.rightEyeTouching})
          setTimeout(this.blink.bind(this),blinkConfig.delay())
      },blinkConfig.duration())
  }
  
  speak(){
    this.setState({mouthSpeakingWidth:250 - Math.floor(Math.random() * 200)}); 
    this.timeoutSpeak = setTimeout(this.speak.bind(this),150 + Math.floor(Math.random() * 100)); 
  }


  speech(){
    this.setState({showMouthLaughter:true,showMouth: false});
    setTimeout(()=>{
      this.setState(state => ({
        showMouthLaughter: false,
        showMouth: true
      }))
      clearTimeout();
    },200);
    this.timeoutSpeak = setTimeout(this.speech.bind(this),400);
  }

  SpeakButton(){
    // esconde
    this.setState(state => ({
      showMouthSpeaking: false,
      showMouth: false,
      showMouthSad:false,
      showMouthOpenSad:false,
      showMouthLaughter:false
    }));
    // Muestra
    this.speech();
    setTimeout(()=>{
      this.setState(state => ({
        showMouth: true
      }))
      clearTimeout(this.timeoutSpeak);
    },4000)
    
}


LaughterButton(){
  // esconde
  this.setState(state => ({
    showMouthSpeaking: false,
    showMouth: false,
    showMouthSad:false,
    showMouthOpenSad:false
  }));
  // Muestra
  this.setState({showMouthLaughter:true})
  setTimeout(()=>{
    this.setState(state => ({
      showMouthLaughter: false,
      showMouth: true
    }))
    clearTimeout();
  },1000)
}

MouthSadButton(){
    // esconde
    this.setState(state => ({
      showMouthSpeaking: false,
      showMouth: false,
      showMouthLaughter:false,
      showMouthOpenSad:false
    }));
    // Muestra  
    this.setState({showMouthSad:true})
    setTimeout(()=>{
      this.setState(state => ({
        showMouthSad: false,
        showMouth: true
      }))
      clearTimeout();
    },1000)
}


AngryFaceButton(){
    // esconde
    this.setState(state => ({
      showfaceBlink:false,
      showSadFace:false,
      showMouthSpeaking: false,
      showMouth: false,
      showMouthLaughter:false,
      hideLeftLid:false,
      hideRightLid:false,
      showMouthOpenSad:false,
      showSurpriseFace:false
    }));
    // Muestra  
    this.setState({
      showMouthSad:true,
      showAngryFace:true
    })
}

SadFaceButton(){
  // esconde
  this.setState(state => ({
    showAngryFace:false,
    showMouthSpeaking: false,
    showMouth: false,
    showMouthLaughter:false,
    hideLeftLid:false,
    hideRightLid:false,
    showMouthSad:false,
    showSurpriseFace:false,
    showMouthOpenSad:false,
  }));
  // Muestra 
  this.blink(); 
  this.setState({
    showfaceBlink:true,
    showSadFace: true,
    showMouthOpenSad:true
  })
}

SurpriseFaceButton(){
  // esconde
  this.setState(state => ({
    showAngryFace:false,
    showMouthSpeaking: false,
    showMouth: false,
    showMouthLaughter:false,
    hideLeftLid:false,
    hideRightLid:false,
    showMouthSad:false,
    showfaceBlink:false,
    showSadFace: false,
    showMouthOpenSad:false,
  }));
  // Muestra  
  this.setState({
    showSurpriseFace:true,
    showMouth:true
  })
  setTimeout(()=>{
    this.setState(state => ({
      showSurpriseFace: false,
      showfaceBlink:true
    }))
    clearTimeout();
  },2000)
}

NormalFaceButton(){
  // esconde
  this.setState(state => ({
    showAngryFace:false,
    showSadFace: false,
    showMouthSpeaking: false,
    showMouthSad:false,
    showMouthLaughter:false,
    showMouthOpenSad:false,
    showSurpriseFace:false,
  }));
  // Muestra  
  this.setState({
    showfaceBlink:true,
    showMouth: true
  })
}


  render() {
    var hideLid = {display:"none"}

    return (
        
        <div className={this.state.faceClass}> {/*Reccuerda un solo componente <h3>Hello {this.state.testState}!</h3>*/}
          
            <button onClick={this.SpeakButton.bind(this)}>speak</button> 
            <button onClick={this.LaughterButton.bind(this)}>Laughter</button>
            <button onClick={this.MouthSadButton.bind(this)}>Mouth Sad</button>
            <button onClick={this.AngryFaceButton.bind(this)}>Angry Face</button>
            <button onClick={this.SadFaceButton.bind(this)}>Sad Face</button>
            <button onClick={this.SurpriseFaceButton.bind(this)}>Surprise eyebrows</button>
            <button onClick={this.NormalFaceButton.bind(this)}>Normal Face</button>

            {this.state.showfaceBlink?
            <div>
                <div className="lid left" style={this.state.hideLeftLid ? hideLid : null}></div>
                <div className="eye left" style={this.state.hideLeftLid ? null : hideLid} data-eye="left"></div>

                <div className="lid right" style={this.state.hideRightLid ? hideLid : null}></div>
                <div className="eye right" style={this.state.hideRightLid ? null : hideLid} data-eye="right"></div>
            </div>
            :null}

            {this.state.showAngryFace?
            <div>
                <div className="eye angryleft"></div>
                <div className="eye angryright"></div>
            </div>
            :null}

            {this.state.showSadFace?
            <div>
                <div className=""></div>
                <div className=""></div>
            </div>
            :null}

            {this.state.showSurpriseFace?
            <div>
                <div className="eye supriseleft"></div>
                <div className="eye supriseright"></div>
            </div>
            :null}

            {this.state.showMouthSpeaking?
              <div className="mouthSpeaking" style={{width:this.state.mouthSpeakingWidth+"px",marginLeft:(-1*this.state.mouthSpeakingWidth/2)+"px"}}></div>
            :null}

            {this.state.showMouth?
              <div className="mouth"></div>
            :null}

            {this.state.showMouthLaughter?
              <div className="mouthlaughter"></div>
            :null}

            {this.state.showMouthSad?
              <div className="mouthsad"></div>
            :null}

            {this.state.showMouthOpenSad?
              <div className="mouthopensad"></div>
            :null}

            {this.state.showMic?
              <div className="mic">
                <img src={iconMic} alt="icono microfono" />
                {this.state.micTextParcial}
              </div>
              :null}

            {this.state.showMusic?
              <div className="music">
                <img src={iconMusic} alt="icono microfono" />
                {this.state.musicName}
              </div>
              :null}

        </div>
    );
  }

}


export default App;
