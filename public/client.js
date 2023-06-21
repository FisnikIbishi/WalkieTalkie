const socket = io();
// const peerConnection = new RTCPeerConnection({
//   iceServers: [
//     { urls: 'stun:stun.l.google.com:19302' }
//     // {
//     //   url: 'turn:numb.viagenie.ca',
//     //   credential: 'muazkh',
//     //   username: 'webrtc@live.com'
//     // }
//   ]
// });

var peerConnection = new RTCPeerConnection({
  iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:a.relay.metered.ca:80",
        username: "7e4277cf20b09ff5f4d9e6ce",
        credential: "L5wP03KvO9adleCe",
      },
      {
        urls: "turn:a.relay.metered.ca:80?transport=tcp",
        username: "7e4277cf20b09ff5f4d9e6ce",
        credential: "L5wP03KvO9adleCe",
      },
      {
        urls: "turn:a.relay.metered.ca:443",
        username: "7e4277cf20b09ff5f4d9e6ce",
        credential: "L5wP03KvO9adleCe",
      },
      {
        urls: "turn:a.relay.metered.ca:443?transport=tcp",
        username: "7e4277cf20b09ff5f4d9e6ce",
        credential: "L5wP03KvO9adleCe",
      },
  ],
});



async function getUserMedia(constraints) {
  try {
   const  stream = await navigator.mediaDevices.getUserMedia(constraints);
    /* use the stream */
    stream.getTracks().forEach(t => peerConnection.addTrack(t, stream));

    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;
    console.log('stream', stream)
  } catch (err) {
    /* handle the error */
  }
}

getUserMedia({
  audio: true,
  video: true,
});

// Save a list of ice candidates to send to the peer
const iceCandidates = [];

peerConnection.onicecandidate = e => {
  console.log('onicecandidate')
  if (e.candidate) {
    console.log('add ice candidates 1: ' + e.candidate)
    iceCandidates.push(e.candidate);
  }
};

peerConnection.ontrack = e => {
  console.log('ontrack')
  const remoteVideo = document.getElementById('remoteVideo');
  remoteVideo.srcObject = e.streams[0];
};

// socket.on('userJoined', id => {
//   console.log("new user joined: " + id)
//   // Calling other client and sending our stream
// });

peerConnection.onicecandidate = e => {
  if (e.candidate) {
    iceCandidates.push(e.candidate);
  }
};

peerConnection.ontrack = e => {
  document.getElementById('remoteVideo').srcObject = e.streams[0];
};

peerConnection.onicegatheringstatechange = () => {
  if (peerConnection.iceGatheringState === 'complete') {
    console.log('Answer ready, click copy button.');
  }
};

socket.on('ice candidates', iceCandidate => {
  console.log('ice candidates: ' + iceCandidate)
  iceCandidates.push(iceCandidate);
});

async function createOffer() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('call', offer);
}

document.getElementById('btn-call').addEventListener("click", () => {
  console.log('call')
  createOffer();
});

socket.on('call', offer => {
  console.log('answer')
  onOfferReceived(offer)
});

async function onOfferReceived(offer) {
  console.log('on offer received')
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  console.log('sending answer')
  socket.emit('answer', answer);
}

async function setAnswer(answer) {
  console.log('on answer')
  await peerConnection.setRemoteDescription(answer);
  iceCandidates.forEach(c => peerConnection.addIceCandidate(c));
}

socket.on('answer', answer => {
  setAnswer(answer)
});
