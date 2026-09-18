const BULLET_PATTERN =
  /^\s*(?:[•●▪◦‣⁃*-])\s+(.*)$/;

const ResumeDescription = ({
  description = "",
  className = "",
  style,
}) => {
  if (
    typeof description !==
      "string" ||
    !description.trim()
  ) {
    return null;
  }

  const lines =
    description
      .split(/\r?\n/)
      .map((line) =>
        line.trim()
      )
      .filter(Boolean);

  const items =
    lines.map(
      (line) => {
        const bulletMatch =
          line.match(
            BULLET_PATTERN
          );

        if (bulletMatch) {
          return {
            type: "bullet",
            text:
              bulletMatch[1]
                .trim(),
          };
        }

        return {
          type: "text",
          text: line,
        };
      }
    );

  const hasBullets =
    items.some(
      (item) =>
        item.type ===
        "bullet"
    );

  /*
   * Normal descriptions remain
   * ordinary paragraph text.
   */

  if (!hasBullets) {
    return (
      <p
        className={`
          whitespace-pre-line
          ${className}
        `}
        style={style}
      >
        {description}
      </p>
    );
  }

  /*
   * Bullet descriptions are
   * rendered as real list items.
   *
   * Using list-outside gives wrapped
   * lines a natural hanging indent:
   *
   * • First line of the bullet
   *   continuation of the bullet
   */

  return (
    <div
      className={className}
      style={style}
    >
      {items.map(
        (item, index) => {
          if (
            item.type ===
            "bullet"
          ) {
            return (
              <ul
                key={`bullet-${index}`}
                className="
                  list-disc
                  list-outside
                  pl-[1.15em]
                "
              >
                <li>
                  {item.text}
                </li>
              </ul>
            );
          }

          return (
            <p
              key={`text-${index}`}
              className="
                whitespace-pre-line
              "
            >
              {item.text}
            </p>
          );
        }
      )}
    </div>
  );
};

export default ResumeDescription;