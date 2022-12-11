import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ query, largeImage, closeModal }) => {
  useEffect(() => {
    const closeModalByEsc = ({ code }) => {
      if (code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', closeModalByEsc);
    return () => {
      window.removeEventListener('keydown', closeModalByEsc);
    };
  }, [closeModal]);

  const closeModalByBackdrop = event => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return createPortal(
    <div className={s.Overlay} onClick={closeModalByBackdrop}>
      <div className={s.Modal}>
        <img src={largeImage} alt={query} />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  query: PropTypes.string.isRequired,
  largeImage: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
