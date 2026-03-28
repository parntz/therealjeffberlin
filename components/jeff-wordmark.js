export default function JeffWordmark({ as: Tag = "div", className = "" }) {
  const classes = ["jeff-wordmark", className].filter(Boolean).join(" ");

  return (
    <Tag className={classes} aria-label="Jeff Berlin">
      <span className="jeff-wordmark-jeff">JEFF</span>
      <span className="jeff-wordmark-berlin">BERLIN</span>
    </Tag>
  );
}
