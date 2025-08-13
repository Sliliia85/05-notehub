import css from "./Modal.module.css";
import { createPortal } from 'react-dom';

export default function Modal() {
    return createPortal(
        <div
  className={css.backdrop}
  role="dialog"
  aria-modal="true"
>
  <div className={css.modal}>
  </div>
</div>

    )
}