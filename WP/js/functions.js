var flag;
flag = true;

function upLoadPhoto() {
  let file = document.getElementById("inputFile").files[0];
  let file_name = file.name;
  let file_type = file.type;
  let reader = new FileReader();

  reader.onload = function () {
    let arrayBuffer = this.result;
    let blob = new Blob([new Int8Array(arrayBuffer)], {
      type: file_type,
    });
    let blobUrl = URL.createObjectURL(blob);

    $("#addPic").attr("src", blobUrl);
    $("#addContain").removeClass("hide");
    document.getElementById("addName").innerText =
      "File '" + file_name + "' successfully uploaded!";
    console.log(blob);

    let data = document.getElementById("inputFile").files[0];
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    xhr.withCredentials = false;
    xhr.open(
      "PUT",
      "https://krnqx4j2t4.execute-api.us-east-1.amazonaws.com/upload" +
        "/upload/nyu-cc-photo-album-photo/" +
        data.name,
      true
    );
    console.log(data.name);
    xhr.setRequestHeader("Content-Type", data.type);
    // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    // xhr.setRequestHeader("Access-Control-Allow-Methods", "PUT");
    // xhr.setRequestHeader("Access-Control-Allow-Headers", "*");
    // console.log(data.name);
    xhr.send(data);

    // xhr.open("PUT", "https://nyu-cc-photo-album-photo.s3.amazonaws.com/"+data.name);
    // console.log(data.name)
    // xhr.setRequestHeader("Content-Type", data.type);
    // xhr.send(data);
  };
  reader.readAsArrayBuffer(file);
}

function diaplayItem(src, file_name) {
  let $template = $(
    ` <div class="card col-md-4">
            <img class="card-img-top" src=${src}>
            <p class="card-text">${file_name}</p>
        </div>
        <br>`
  );
  $("#picContain").append($template);
  if ($("#albumContain").hasClass("hide")) {
    $("#albumContain").removeClass("hide");
  }
}

var apigClient = apigClientFactory.newClient();

function searchPhoto() {
  $("#albumContain").addClass("hide");
  $("#addContain").addClass("hide");
  $("#picContain").empty();

  if (flag == false) {
    console.log("asdfasdf");
  }
  let value_input = $("#searchValue");
  let search_sentence = value_input.val();
  if (search_sentence.search("show me") === -1) {
    search_sentence = search_sentence;
  }
  value_input.val("");
  console.log(search_sentence);

  if (flag == false) {
    let params = {
      q: "use_voice",
    };

    let additionalParams = {
      queryParams: {
        q: "use_voice",
      },
    };

    console.log(additionalParams);
    apigClient
      .searchGet(params, {}, additionalParams)
      .then((res) => {
        console.log(res);
        // todo use display item function here to create new pictures
        let body = res["data"];
        if (JSON.stringify(body) === "{}") {
          alert(`There is not image matches your search!`);
        }
        for (let key in body) {
          let test_src = body[key];
          let test_name = key;
          console.log(key);
          diaplayItem(test_src, test_name);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    let params = {
      q: search_sentence,
    };

    let additionalParams = {
      queryParams: {
        q: search_sentence,
      },
    };

    apigClient
      .searchGet(params, {}, additionalParams)
      .then((res) => {
        console.log(res);
        // todo use display item function here to create new pictures
        let body = res["data"];
        console.log("LOOK", res);

        if (JSON.stringify(body) === "{}") {
          alert(`There is not image matches your search!`);
        }
        for (let key in body) {
          let test_src = body[key];
          let test_name = key;
          console.log(key);
          diaplayItem(test_src, test_name);
        }
      })
      .catch((e) => {
        console.log("something goes wrong");
      });
  }
}


// window.onload = function () {
//   document.getElementById("record");
//   document.getElementById("stopRecord");
  
//   // .then(stream => {
//   //     handlerFunction(stream)
//   // })

//   record.onclick = (e) => {
//     console.log("I was clicked");
//     record.disabled = true;
//     record.style.backgroundColor = "blue";
//     stopRecord.disabled = false;
//     audioChunks = [];
//     // rec.start();
    
//     navigator.mediaDevices.getUserMedia({ audio: true }).then(handlerFunction).catch(onMediaError);
//     function handlerFunction(stream) {
//       mediaRecorder = new MediaStreamRecorder(stream);
//       mediaRecorder.mimeType = "audio/wav"; // check this line for audio/wav
//       mediaRecorder.ondataavailable = function (blob) {
//         // POST/PUT "Blob" using FormData/XHR2
//         var file = new File([blob], "undefined1.wav", {
//           type: "audio/wav",
//         });
//         var formData = new FormData();
//         formData.append("video-filename", file.name);
//         formData.append("video-blob", file);
//         var request = new XMLHttpRequest();
//         xhr.withCredentials = true;
//         xhr.addEventListener("readystatechange", function () {
//           if (this.readyState === 4) {
//             console.log(this.responseText);
//           }
//         });
//         xhr.withCredentials = false;
//         xhr.open(
//           "PUT",
//           "https://krnqx4j2t4.execute-api.us-east-1.amazonaws.com/upload/upload/nyu-cc-photo-album-photo/" +
//             "undefined1" +
//             ".wav"
//         );
//         xhr.setRequestHeader("Content-Type", "audio/wav");
//         xhr.send(formData);
//       };
//       mediaRecorder.start(3000);

//       // var options = {
//       //     audioBitsPerSecond : 128000,
//       //     videoBitsPerSecond : 2500000,
//       //     mimeType : 'audio/mp4'
//       //   }
//       // var rec = new MediaRecorder(stream,options);
//       // rec.ondataavailable = e => {
//       //     audioChunks.push(e.data);
//       //     if (rec.state == "inactive") {
//       //        // let blob = new Blob(audioChunks, {type: 'audio/wav; codecs=1'});
//       //         let blob = new Blob(audioChunks, {type: 'audio/mp4'});
//       //         recordedAudio.src = URL.createObjectURL(blob);
//       //         recordedAudio.controls = true;
//       //         recordedAudio.autoplay = true;
//       //         //sendData(blob)

//       //         let data = blob//document.getElementById('inputFile').files[0];
//       //         let xhr = new XMLHttpRequest();
//       //         xhr.withCredentials = true;
//       //         xhr.addEventListener("readystatechange", function () {
//       //             if (this.readyState === 4) {
//       //                 console.log(this.responseText);
//       //             }
//       //         });
//       //         xhr.withCredentials = false;
//       //         xhr.open("PUT", "https://krnqx4j2t4.execute-api.us-east-1.amazonaws.com/upload/upload/nyu-cc-photo-album-photo/" + data.name + '1' + '.wav');
//       //         xhr.setRequestHeader("Content-Type", data.type);
//       //         xhr.send(data);

//       //     }
//       // }
//     }
//   };
//   stopRecord.onclick = (e) => {
//     console.log("I was clicked");
//     alert(
//       "Currently processing your voice query; please press the search button"
//     );
//     record.disabled = false;
//     stop.disabled = true;
//     record.style.backgroundColor = "red";
//     flag = false;
//     //mediaRecorder.stop();
//     //rec.stop();
//     // mediaRecorder.stop();
//     // mediaRecorder.stream.stop();
//   };
// };
