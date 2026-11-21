import Button from "../common/Button";
import "./MediaUploadForm.css";

export default function MediaUploadForm({ onNext, onBack }) {
  return <div className="organize-step"><h2>Step 2 of 3 — Photos & Videos</h2><div className="organize-step__intro" role="status">Media upload is unavailable because the backend has no file storage endpoint. Only the camp details will be saved.</div><div className="organize-step__actions"><Button variant="ghost" onClick={onBack}>← Back</Button><Button variant="accent" size="lg" onClick={onNext}>Continue</Button></div></div>;
}
