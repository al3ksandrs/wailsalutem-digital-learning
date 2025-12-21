interface RequestProps {
  subject: string;
  level: string;
  location: string;
  time: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const Request: React.FC<RequestProps> = ({
    subject,
    level,
    location,
    time,
    onEdit,
    onDelete
}) => {
  return (
    <div className="box lesson-card has-background-white-ter has-text-black">
      <div className="is-flex is-justify-content-space-between is-align-items-center">
        <p className="has-text-weight-semibold is-size-5">
          {subject}
        </p>

        <div className="buttons are-small">
          <button
            className="button is-white codicon codicon-pencil"
            aria-label="Edit"
            onClick={onEdit}
          >
          </button>

          <button
            className="button is-white has-text-danger codicon codicon-trash"
            aria-label="Delete"
            onClick={onDelete}
          >
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="is-flex is-align-items-center mb-2">
          <span className="icon mt-2 mr-2 codicon codicon-mortar-board"></span>
          <span>{level}</span>
        </div>

        <div className="is-flex is-align-items-center mb-2">
          <span className="icon mt-2 mr-2 codicon codicon-location"></span>
          <span>{location}</span>
        </div>

        <div className="is-flex is-align-items-center">
          <span className="icon mt-2 mr-2 codicon codicon-clock"></span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}

export default Request;
