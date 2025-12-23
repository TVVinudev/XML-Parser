export default function OverwriteModal({ conflict, onConfirm, onCancel }) {
  if (!conflict) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="modal-title">Record already exists</h2>

        <p className="modal-text">
          <strong>Name:</strong>{" "}
          {conflict.incoming.givenName}{" "}
          {conflict.incoming.familyName}
        </p>

        <p className="modal-subtext">
          Do you want to overwrite this record?
        </p>

        <div className="modal-actions">
          <button className="btn btn-cancel" onClick={onCancel}>
            No
          </button>

          <button className="btn btn-confirm" onClick={onConfirm}>
            Yes, Overwrite
          </button>
        </div>
      </div>
    </div>
  );
}
