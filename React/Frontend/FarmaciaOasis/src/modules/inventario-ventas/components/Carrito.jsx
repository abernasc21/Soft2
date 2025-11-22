    function Carrito({ 
        carrito,
        onModificarCantidad, 
        onEliminarItem, 
        totalVenta }) {
        if (carrito.length === 0) {
        return (
            <div>
            <p>El carrito está vacío</p>
            </div>
        );
        }
    
        return (
        <div className="carrito">
            <h3>Carrito de Compras</h3>
            {carrito.map(item => (
            <div key={item.id} className="item-carrito">
                <div className="info-producto">
                <strong>{item.nombre}</strong>
                <span>{item.complemento}</span>
                </div>
                <div className="controles-cantidad">
                <button onClick={() => onModificarCantidad(item.id, -1)}>−</button>
                <span>{item.cantidad}</span>
                <button onClick={() => onModificarCantidad(item.id, 1)}>+</button>
                </div>
                <div className="precio-total">
                {item.precio_venta * item.cantidad} Bs
                </div>
                <button 
                className="btn-eliminar"
                onClick={() => onEliminarItem(item.id)}
                >
                🗑️
                </button>
            </div>
            ))}
            <div className="total-carrito">
            <h3>Total: {totalVenta} Bs</h3>
            </div>
        </div>
        );
    }
    
    export default Carrito;