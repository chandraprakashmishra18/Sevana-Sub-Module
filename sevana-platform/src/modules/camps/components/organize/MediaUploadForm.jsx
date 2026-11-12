import { useState } from "react";
import Button from "../common/Button";
import "./MediaUploadForm.css";

function MediaUploadForm({ formData, updateFormData, onNext, onBack }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));
    updateFormData({ media: [...formData.media, ...newFiles] });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    updateFormData({ media: formData.media.filter((_, i) => i !== index) });
  };

  return (
    <div className="organize-step">
      <h2>Step 2 of 3 — Photos & Videos</h2>
      <p className="organize-step__intro">
        Add photos or videos for your camp listing (optional, but strongly recommended — camps with media get more sign-ups).
      </p>

      <div
        className={`media-upload__dropzone ${dragActive ? "media-upload__dropzone--active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("media-file-input").click()}
      >
        <span className="media-upload__icon">📷</span>
        <p>Drag & drop files here, or click to browse</p>
        <input
          id="media-file-input"
          type="file"
          accept="image/*,video/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {formData.media.length > 0 && (
        <div className="media-upload__preview-grid">
          {formData.media.map((file, index) => (
            <div className="media-upload__preview-item" key={index}>
              {file.type === "video" ? (
                <video src={file.url} className="media-upload__preview" muted />
              ) : (
                <img src={file.url} alt={file.name} className="media-upload__preview" />
              )}
              <button
                type="button"
                className="media-upload__remove"
                onClick={() => removeFile(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="media-upload__note">
        📌 Demo note: files are previewed locally in your browser only. Real upload
        and storage will be enabled once the backend is connected.
      </p>

      <div className="organize-step__actions">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button variant="accent" size="lg" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default MediaUploadForm;