const socket = io();

let peerConnection;
const configuration = {
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
  ]
};

// Save a list of ice candidates to send to the peer
const iceCandidates = [];

async function createOffer() {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', offer);
}

document.getElementById('btn-call').addEventListener("click", () => {
  console.log('call')
  showVideoPopup()
  createPeerConnection();
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      const localVideo = document.getElementById('localVideo');
      localVideo.srcObject = stream;
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
      createOffer()
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
});

document.getElementById('btn-end-call').addEventListener("click", () => {
  endCall()
});

socket.on('offer', offer => {
  console.log('on offer received')
  createPeerConnection();
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      showVideoPopup()
      const localVideo = document.getElementById('localVideo');
      localVideo.srcObject = stream;
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

      peerConnection.setRemoteDescription(offer)
        .then(() => peerConnection.createAnswer())
        .then((answer) => peerConnection.setLocalDescription(answer))
        .then(() => {
          socket.emit('answer', peerConnection.localDescription);
        })
        .catch((error) => {
          console.error('Error creating or setting local/remote description:', error);
        });
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
});

socket.on('answer', answer => {
  console.log('on answer ' + answer)
  peerConnection.setRemoteDescription(answer)
    .catch((error) => {
      console.error('Error setting remote description:', error);
    });
});

socket.on('ice-candidate', iceCandidate => {
  console.log('ice candidates: ' + iceCandidate)
  peerConnection.addIceCandidate(iceCandidate)
});

socket.on('end-call', state => {
  console.log('end call')
  peerConnection.close();
  hideVideoPopup();
});

function endCall() {
  console.log('end call')
  peerConnection.close();
  socket.emit('end-call', true);
  hideVideoPopup()
}

function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', event.candidate);
    }
  };

  peerConnection.ontrack = (event) => {
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = event.streams[0];
  };

  peerConnection.onicegatheringstatechange = () => {
    if (peerConnection.iceGatheringState === 'complete') {
      document.getElementById('call-label').innerHTML = 'On call'
    }
  };
}