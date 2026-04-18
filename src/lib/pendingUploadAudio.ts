let pendingUploadAudioFile: File | null = null;

export function setPendingUploadAudioFile(file: File) {
  pendingUploadAudioFile = file;
}

export function consumePendingUploadAudioFile(): File | null {
  const file = pendingUploadAudioFile;
  pendingUploadAudioFile = null;
  return file;
}
