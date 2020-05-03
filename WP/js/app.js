// window.onload = function(){ 
//   document.getElementById("record");
//   document.getElementById("stopRecord");
//   var flag;
//   flag = true;
//   navigator.mediaDevices.getUserMedia({audio:true})
//     .then(stream => {handlerFunction(stream)})


//           function handlerFunction(stream) {
//           rec = new MediaRecorder(stream);
//           rec.ondataavailable = e => {
//             audioChunks.push(e.data);
//             if (rec.state == "inactive"){
//               let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
//               recordedAudio.src = URL.createObjectURL(blob);
//               recordedAudio.controls=false;
//               recordedAudio.autoplay=false;
//               sendData(blob)

//               let data = blob//document.getElementById('inputFile').files[0];
//               let xhr = new XMLHttpRequest();
//               xhr.withCredentials = true;
//               xhr.addEventListener("readystatechange", function () {
//                   if (this.readyState === 4) {
//                       console.log(this.responseText);
//                   }
//               });
//               xhr.withCredentials = false;
//               xhr.open("PUT", "https://album-mp3.s3.amazonaws.com/"+data.name + '1' + '.mp3');
//               xhr.setRequestHeader("Content-Type", data.type);
//               xhr.send(data);

//             }
//           }
//         }
//               function sendData(data) {}

//       record.onclick = e => {
//         console.log('I was clicked')
//         record.disabled = true;
//         record.style.backgroundColor = "blue"
//         stopRecord.disabled=false;
//         audioChunks = [];
//         rec.start();
//       }
//       stopRecord.onclick = e => {
//         console.log("I was clicked")
//         record.disabled = false;
//         stop.disabled=true;
//         record.style.backgroundColor = "red"
//         flag = false; 
//         rec.stop();
//       }
// } 
