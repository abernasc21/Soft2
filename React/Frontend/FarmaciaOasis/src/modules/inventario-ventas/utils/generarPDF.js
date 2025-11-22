import html2pdf from 'html2pdf.js';
import dayjs from 'dayjs';

export function generarPDFVenta(datosVenta, carrito, totalVenta, numeroVenta, datosConDescuento = {}) {
    // ✅ EXTRAER DATOS DE DESCUENTO
    const {
        totalSinDescuento = totalVenta,
        montoDescuento = 0,
        porcentajeDescuento = 0
    } = datosConDescuento;

    // Crear el contenido HTML del comprobante
    const contenidoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <style>
            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            }
            body {
            font-family: 'Helvetica', Arial, sans-serif;
            color: #333;
            background: white;
            }
            .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            }
            .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #1871c1;
            padding-bottom: 15px;
            margin-bottom: 20px;
            }
            .company-info h1 {
            font-size: 24px;
            color: #1871c1;
            margin-bottom: 5px;
            }
            .company-info p {
            font-size: 11px;
            color: #666;
            margin: 2px 0;
            }
            .invoice-info {
            text-align: right;
            }
            .invoice-info .label {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
            }
            .invoice-info .number {
            font-size: 14px;
            color: #1871c1;
            font-weight: bold;
            margin-bottom: 5px;
            }
            .invoice-info .date {
            font-size: 10px;
            color: #666;
            }
            .section {
            margin-bottom: 20px;
            }
            .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #1871c1;
            border-bottom: 1px solid #04BFBF;
            padding-bottom: 5px;
            margin-bottom: 8px;
            }
            .client-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 11px;
            line-height: 1.6;
            }
            .client-info p {
            margin: 3px 0;
            }
            .client-info strong {
            font-weight: bold;
            }
            table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            }
            thead {
            background: #1871c1;
            color: white;
            }
            th {
            padding: 8px;
            font-size: 10px;
            font-weight: bold;
            text-align: left;
            border: 1px solid #1871c1;
            }
            td {
            padding: 8px;
            font-size: 10px;
            border-bottom: 1px solid #e0e0e0;
            }
            tbody tr:nth-child(even) {
            background-color: #f8f9fa;
            }
            .text-right {
            text-align: right;
            }
            .text-center {
            text-align: center;
            }
            .summary {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #1871c1;
            }
            .summary-row {
            display: flex;
            justify-content: space-between;
            width: 40%;
            margin-bottom: 8px;
            font-size: 11px;
            }
            .summary-row .label {
            font-weight: 500;
            }
            .total-row {
            display: flex;
            justify-content: space-between;
            width: 40%;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #1871c1;
            font-size: 14px;
            font-weight: bold;
            color: #1871c1;
            }
            .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
            font-size: 8px;
            color: #999;
            }
            .badge {
            display: inline-block;
            background: #04BFBF;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            }
            .descuento-info {
            background: #f0f9ff;
            border: 1px solid #b3e5fc;
            border-radius: 6px;
            padding: 8px 12px;
            margin: 10px 0;
            }
            .descuento-text {
            color: #0288d1;
            font-weight: 600;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <!-- HEADER -->
            <div class="header">
            <div class="company-info">
                <h1>FARMACIA OASIS</h1>
                <p>El Alto, La Paz, Bolivia </p>
                
            </div>
            <div class="invoice-info">
                <div class="label">ID DE LA VENTA</div>
                <div class="number">#${numeroVenta}</div>
                <div class="date">${dayjs().format('DD/MM/YYYY HH:mm:ss')}</div>
            </div>
            </div>

            <!-- CLIENTE -->
            <div class="section">
            <div class="section-title">CLIENTE</div>
            <div class="client-info">
                <p><strong>Nombre:</strong> ${datosVenta.nombre}</p>
                <p><strong>CI/NIT:</strong> ${datosVenta.ci_nit || 'S/D'}</p>
                <p><strong>Método de Pago:</strong> <span class="badge">${datosVenta.metodo_pago.toUpperCase()}</span></p>
                ${porcentajeDescuento > 0 ? `<p><strong>Descuento Cliente:</strong> <span class="badge" style="background: #4caf50;">${porcentajeDescuento}%</span></p>` : ''}
            </div>
            </div>

            <!-- PRODUCTOS -->
            <div class="section">
            <div class="section-title">PRODUCTOS</div>
            <table>
                <thead>
                <tr>
                    <th style="width: 10%;">Cant.</th>
                    <th style="width: 20%;">Producto</th>
                    <th style="width: 20%;">medida</th>
                    
                    <th style="width: 20%; text-align: right;">P. Unit.</th>
                    
                    <th style="width: 15%; text-align: right;">Subtotal</th>
                </tr>
                </thead>
                <tbody>
                ${carrito.map(item => `
                    <tr>
                    <td class="text-center">${item.cantidad}</td>
                    <td>
                        ${item.nombre}
                        ${item.presentacion ? `<br><span style="color: #999; font-size: 9px;">(${item.presentacion})</span>` : ''}
                        
                    </td>
                    <td>
                        ${item.medida || 'N/A'}
                    </td>
                    <td class="text-right">Bs ${item.precio_venta.toFixed(2)}</td>
                    
                    <td class="text-right">Bs ${(item.precio_venta * item.cantidad).toFixed(2)}</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
            </div>

            <!-- RESUMEN -->
            <div class="summary">
            <div class="summary-row">
                <span class="label">Cantidad de artículos:</span>
                <span>${carrito.reduce((sum, item) => sum + item.cantidad, 0)}</span>
            </div>
            
            ${porcentajeDescuento > 0 ? `
                <div class="summary-row">
                    <span class="label">Subtotal:</span>
                    <span>Bs ${totalSinDescuento.toFixed(2)}</span>
                </div>
                <div class="summary-row descuento-text">
                    <span class="label">Descuento (${porcentajeDescuento}%):</span>
                    <span>- Bs ${montoDescuento.toFixed(2)}</span>
                </div>
            ` : ''}
            
            <div class="total-row">
                <span>TOTAL:</span>
                <span>Bs ${totalVenta.toFixed(2)}</span>
            </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
            <p>Gracias por su compra.</p>
            <p>Generado el ${dayjs().format('DD/MM/YYYY HH:mm:ss')}</p>
            </div>
        </div>
        </body>
        </html>
    `;

    // Configuración del PDF
    const opciones = {
        margin: 0,
        filename: `Venta_${numeroVenta}_${dayjs().format('YYYY-MM-DD_HHmmss')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { 
        orientation: 'portrait', 
        unit: 'mm', 
        format: 'a4' 
        }
    };

    // Generar PDF
    html2pdf().set(opciones).from(contenidoHTML).save();
}

export function imprimirComprobante(datosVenta, carrito, totalVenta, numeroVenta, datosConDescuento = {}) {
    // ✅ EXTRAER DATOS DE DESCUENTO
    const {
        totalSinDescuento = totalVenta,
        montoDescuento = 0,
        porcentajeDescuento = 0
    } = datosConDescuento;

    const contenidoHTML = `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <style>
            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            }
            body {
            font-family: 'Helvetica', Arial, sans-serif;
            color: #333;
            }
            .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            }
            .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #1871c1;
            padding-bottom: 15px;
            margin-bottom: 20px;
            }
            .company-info h1 {
            font-size: 24px;
            color: #1871c1;
            margin-bottom: 5px;
            }
            .company-info p {
            font-size: 11px;
            color: #666;
            margin: 2px 0;
            }
            .invoice-info {
            text-align: right;
            }
            .invoice-info .label {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
            }
            .invoice-info .number {
            font-size: 14px;
            color: #1871c1;
            font-weight: bold;
            margin-bottom: 5px;
            }
            .invoice-info .date {
            font-size: 10px;
            color: #666;
            }
            .section {
            margin-bottom: 20px;
            }
            .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #1871c1;
            border-bottom: 1px solid #04BFBF;
            padding-bottom: 5px;
            margin-bottom: 8px;
            }
            .client-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 11px;
            line-height: 1.6;
            }
            .client-info p {
            margin: 3px 0;
            }
            .client-info strong {
            font-weight: bold;
            }
            table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            }
            thead {
            background: #1871c1;
            color: white;
            }
            th {
            padding: 8px;
            font-size: 10px;
            font-weight: bold;
            text-align: left;
            border: 1px solid #1871c1;
            }
            td {
            padding: 8px;
            font-size: 10px;
            border-bottom: 1px solid #e0e0e0;
            }
            tbody tr:nth-child(even) {
            background-color: #f8f9fa;
            }
            .text-right {
            text-align: right;
            }
            .text-center {
            text-align: center;
            }
            .summary {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #1871c1;
            }
            .summary-row {
            display: flex;
            justify-content: space-between;
            width: 40%;
            margin-bottom: 8px;
            font-size: 11px;
            }
            .summary-row .label {
            font-weight: 500;
            }
            .total-row {
            display: flex;
            justify-content: space-between;
            width: 40%;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #1871c1;
            font-size: 14px;
            font-weight: bold;
            color: #1871c1;
            }
            .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
            font-size: 8px;
            color: #999;
            }
            .badge {
            display: inline-block;
            background: #04BFBF;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            }
            .descuento-text {
            color: #0288d1;
            font-weight: 600;
            }
            @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .container {
                padding: 0;
            }
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <div class="company-info">
                <h1>FARMACIA OASIS</h1>
                <p>El Alto, La Paz, Bolivia </p>
                
            </div>
            <div class="invoice-info">
                <div class="label">ID DE LA VENTA</div>
                <div class="number">#${numeroVenta}</div>
                <div class="date">${dayjs().format('DD/MM/YYYY HH:mm:ss')}</div>
            </div>
            </div>

            <div class="section">
            <div class="section-title">CLIENTE</div>
            <div class="client-info">
                <p><strong>Nombre:</strong> ${datosVenta.nombre}</p>
                <p><strong>CI/NIT:</strong> ${datosVenta.ci_nit || 'S/D'}</p>
                <p><strong>Método de Pago:</strong> <span class="badge">${datosVenta.metodo_pago.toUpperCase()}</span></p>
                ${porcentajeDescuento > 0 ? `<p><strong>Descuento Cliente:</strong> <span class="badge" style="background: #4caf50;">${porcentajeDescuento}%</span></p>` : ''}
            </div>
            </div>

            <div class="section">
            <div class="section-title">PRODUCTOS</div>
            <table>
                <thead>
                <tr>
                    <th style="width: 10%;">Cant.</th>
                    <th style="width: 20%;">Producto</th>
                    <th style="width: 20%;">medida</th>
                    
                    <th style="width: 20%; text-align: right;">P. Unit.</th>

                    <th style="width: 15%; text-align: right;">Subtotal</th>
                </tr>
                </thead>
                <tbody>
                ${carrito.map(item => `
                    <tr>
                    <td class="text-center">${item.cantidad}</td>
                    <td>
                        ${item.nombre}
                        ${item.presentacion ? `<br><span style="color: #999; font-size: 9px;">(${item.presentacion})</span>` : ''}
                        
                    </td>
                    <td>
                        ${item.medida || 'N/A'}
                    </td>
                    <td class="text-right">Bs ${item.precio_venta.toFixed(2)}</td>
                    
                    <td class="text-right">Bs ${(item.precio_venta * item.cantidad).toFixed(2)}</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
            </div>

            <div class="summary">
            <div class="summary-row">
                <span class="label">Cantidad de artículos:</span>
                <span>${carrito.reduce((sum, item) => sum + item.cantidad, 0)}</span>
            </div>
            
            ${porcentajeDescuento > 0 ? `
                <div class="summary-row">
                    <span class="label">Subtotal:</span>
                    <span>Bs ${totalSinDescuento.toFixed(2)}</span>
                </div>
                <div class="summary-row descuento-text">
                    <span class="label">Descuento (${porcentajeDescuento}%):</span>
                    <span>- Bs ${montoDescuento.toFixed(2)}</span>
                </div>
            ` : ''}
            
            <div class="total-row">
                <span>TOTAL:</span>
                <span>Bs ${totalVenta.toFixed(2)}</span>
            </div>
            </div>

            <div class="footer">
            <p>Gracias por su compra.</p>
            <p>Generado el ${dayjs().format('DD/MM/YYYY HH:mm:ss')}</p>
            </div>
        </div>
        <script>
            window.print();
        </script>
        </body>
        </html>
    `;

    const ventana = window.open('', '_blank');
    ventana.document.write(contenidoHTML);
    ventana.document.close();
}