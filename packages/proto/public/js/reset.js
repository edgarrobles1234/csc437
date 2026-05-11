import { css } from "@unbndl/html";

const styles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  img,
  picture,
  svg,
  video {
    display: block;
    max-width: 100%;
  }

  ul,
  ol {
    padding-left: 1.5rem;
  }

  a {
    color: inherit;
  }
`;

export default { styles };