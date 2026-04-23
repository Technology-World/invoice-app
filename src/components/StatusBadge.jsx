export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`} aria-label={`Status: ${status}`}>
      {status}
    </span>
  );
}
