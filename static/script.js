var remoteVideo = document.getElementById("remoteVideo");

var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");

startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function log(text) {
    console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> " 
    + text);
}

function successCallback(stream){
log("Received local stream");
if (window.URL) {
    log("1")
    try {
        localVideo.srcObject = stream;
} catch (error) {
    localVideo.srcObject = window.URL.createObjectURL(stream);
}
    log("2")
} else {
    log("3")
    localVideo.srcObject = stream;
    log("4")
}
log("5")
localStream = stream;
log("6")
    callButton.disabled = false;
}


function start() {
    log("Requesting local stream");
    startButton.disabled = true;
    
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
.then(successCallback)
    .catch(function(error) {
    log("navigator.getUserMedia error: ", error);
});

}


function call() {
    callButton.disabled = true;
    hangupButton.disabled = false;

    log("Starting call");
    if (navigator.mediaDevices.getUserMedia) {
        if (localStream.getVideoTracks().length > 0) {
            log('Using video device: ' + localStream.getVideoTracks()[0].label);
    }
        if (localStream.getAudioTracks().length > 0) {
            log('Using audio device: ' + localStream.getAudioTracks()[0].label);
    }
    }
        RTCPeerConnection = webkitRTCPeerConnection;
   
    log("RTCPeerConnection object: " + RTCPeerConnection);
    var servers = null;
    localPeerConnection = new RTCPeerConnection(servers);
    log("Created local peer connection object localPeerConnection");
    localPeerConnection.onicecandidate = gotLocalIceCandidate;
    remotePeerConnection = new RTCPeerConnection(servers);
    log("Created remote peer connection object remotePeerConnection");
    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    remotePeerConnection.onaddstream = gotRemoteStream;
    localPeerConnection.addStream(localStream);
    log("Added localStream to localPeerConnection");
    localPeerConnection.createOffer(gotLocalDescription, onSignalingError);
}

function onSignalingError(error){
console.log('Failed to create signaling message : ' + error.name);
}

function gotLocalDescription(description){
// Add the local description to the local PeerConnection
localPeerConnection.setLocalDescription(description);
log("Offer from localPeerConnection: \n" + description.sdp);
// ...do the same with the 'pseudoremote' PeerConnection
// Note: this is the part that will have to be changed if you want
// the communicating peers to become remote
// (which calls for the setup of a proper signaling channel)
remotePeerConnection.setRemoteDescription(description);
// Create the Answer to the received Offer based on the 'local' description
remotePeerConnection.createAnswer(gotRemoteDescription, onSignalingError);
}

function gotRemoteDescription(description){
// Set the remote description as the local description of the
// remote PeerConnection.
remotePeerConnection.setLocalDescription(description);
log("Answer from remotePeerConnection: \n" + description.sdp);
// Conversely, set the remote description as the remote description of the
// local PeerConnection
localPeerConnection.setRemoteDescription(description);
}

function hangup() {
log("Ending call");
// Close PeerConnection(s)
localPeerConnection.close();
remotePeerConnection.close();
localPeerConnection = null;
remotePeerConnection = null;
// Disable Hangup button
hangupButton.disabled = true;
// Enable Call button to allow for new calls to be established
callButton.disabled = false;
}
function gotRemoteStream(event){
// Associate the remote video element with the retrieved stream
if (window.URL) {
// Chrome
try {
    remoteVideo.srcObject = event.stream;
    remoteVideo.srcObject = window.URL.createObjectURL(event.stream);
} catch (error) {
    log('!123')
}
} else {
// Firefox
remoteVideo.srcObject = event.stream;
}
log("Received remote stream");
}

// Handler to be called whenever a new local ICE candidate becomes available
function gotLocalIceCandidate(event){
if (event.candidate) {
// Add candidate to the remote PeerConnection
remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
log("Local ICE candidate: \n" + event.candidate.candidate);
}
}
function gotRemoteIceCandidate(event){
if (event.candidate) {
// Add candidate to the local PeerConnection
localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
log("Remote ICE candidate: \n " + event.candidate.candidate);
}
}


