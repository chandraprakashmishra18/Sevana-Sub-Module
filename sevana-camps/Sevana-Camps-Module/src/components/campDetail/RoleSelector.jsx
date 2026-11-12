import { useNavigate } from "react-router-dom";
import ProgressBar from "../common/ProgressBar";
import Button from "../common/Button";
import "./RoleSelector.css";

function RoleSelector({ camp }) {
  const navigate = useNavigate();
  const { id, workerSlots, attendeeSlots, status } = camp;

  const hasAttendeeOption = attendeeSlots && attendeeSlots.total > 0;
  const isWorkerFull = workerSlots.filled >= workerSlots.total;
  const isAttendeeFull = hasAttendeeOption && attendeeSlots.filled >= attendeeSlots.total;
  const isPast = status === "past";

  const handleJoin = (role) => {
    navigate(`/camps/${id}/join`, { state: { role } });
  };

  if (isPast) {
    return (
      <div className="role-selector role-selector--past">
        <p>This camp has already taken place. Check the outcome summary below.</p>
      </div>
    );
  }

  return (
    <div className="role-selector">
      <h3>How do you want to join?</h3>

      <div className="role-selector__option">
        <div className="role-selector__option-header">
          <span className="role-selector__option-icon">🙋</span>
          <div>
            <p className="role-selector__option-title">Join as a Worker</p>
            <p className="role-selector__option-subtitle">Doctor, teacher, volunteer, or coordinator</p>
          </div>
        </div>
        <ProgressBar current={workerSlots.filled} total={workerSlots.total} label="worker slots filled" />
        <Button
          variant="primary"
          fullWidth
          disabled={isWorkerFull}
          onClick={() => handleJoin("worker")}
        >
          {isWorkerFull ? "Worker Slots Full" : "Join as Worker"}
        </Button>
      </div>

      {hasAttendeeOption && (
        <div className="role-selector__option">
          <div className="role-selector__option-header">
            <span className="role-selector__option-icon">🧑</span>
            <div>
              <p className="role-selector__option-title">Join as an Attendee</p>
              <p className="role-selector__option-subtitle">Get a checkup or attend the class</p>
            </div>
          </div>
          <ProgressBar current={attendeeSlots.filled} total={attendeeSlots.total} label="attendee slots filled" />
          <Button
            variant="outline"
            fullWidth
            disabled={isAttendeeFull}
            onClick={() => handleJoin("attendee")}
          >
            {isAttendeeFull ? "Attendee Slots Full" : "Join as Attendee"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default RoleSelector;
