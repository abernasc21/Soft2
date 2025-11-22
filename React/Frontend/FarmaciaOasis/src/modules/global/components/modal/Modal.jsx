import classes from './Modal.module.css';

/**
 * Componente Modal reutilizable para diálogos y ventanas emergentes
 * Soporta diferentes tamaños y cierre por overlay
 */
function Modal({ titulo, children, onClose, tamaño = 'normal', opened = true }) {
  if (!opened) return null;

  // Cerrar modal al hacer clic en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={classes.globModalOverlay} onClick={handleOverlayClick}>
      <div className={`${classes.globModalContent} ${tamaño === 'grande' ? classes.grande : ''}`}>
        {/* Header del modal con título y botón cerrar */}
        <div className={classes.globModalHeader}>
          <h2 className={classes.globModalTitle}>{titulo}</h2>
          <button className={classes.btnCerrar} onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>
        
        {/* Contenido principal del modal */}
        <div className={classes.globModalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;