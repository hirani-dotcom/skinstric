let pendingCameraStream = null;

export const storeCameraStream = (stream) => {
    if (pendingCameraStream && pendingCameraStream !== stream) {
        pendingCameraStream.getTracks().forEach((track) => track.stop());
    }

    pendingCameraStream = stream;
};

export const takeCameraStream = () => {
    const stream = pendingCameraStream;
    pendingCameraStream = null;
    return stream;
};

export const discardCameraStream = () => {
    pendingCameraStream?.getTracks().forEach((track) => track.stop());
    pendingCameraStream = null;
};
