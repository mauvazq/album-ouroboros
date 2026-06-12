import { useRef, useState } from 'react';

export default function FileUpload({ onUpload, uploading, accept = 'image/*' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    if (files.length > 0 && onUpload) {
      onUpload(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`file-upload ${dragging ? 'dragging' : ''}`}
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />
      <div className="file-upload-icon">{uploading ? '⏳' : '📤'}</div>
      <p className="file-upload-text">
        {uploading
          ? 'Subiendo fotos...'
          : 'Arrastra fotos aquí o haz clic para seleccionar'}
      </p>
    </div>
  );
}
