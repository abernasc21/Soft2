/**
 * Hook para la paleta de colores del sistema
 * Mantiene consistencia en los colores en toda la aplicación
 */
export const useColors = () => {
    const colors = {
        primary: {
            blue: '#034C8C',      
            cyan: '#04BFBF',      
            darkBlue: '#0277BD',  
            lightCyan: '#04BFAD',
            ocean: '#035AA6'      
        },
        background: {
            light: '#f8f9fa',     
            white: '#ffffff',     
            gray: '#e9ecef',      
            subtle: '#fafbfc'     
        },
        text: {
            primary: '#2c3e50',   
            secondary: '#495057', 
            muted: '#6c757d',     
            light: '#adb5bd'      
        }
    };
    
    return colors;
};

export default useColors;