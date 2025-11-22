// Sonido realista de cajero abriendo y cerrando la caja registradora
export const saleSound = {
  play: () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // // Sonido 1: "Clack" de apertura (agudo y corto)
      // playOpenSound(audioContext, 0);
      
      // Sonido 2: "Cha-ching" de monedas (0.2 segundos después)
      playCoinSound(audioContext, 0.2);
      
      // // Sonido 3: "Clack" de cierre (0.6 segundos después)
      // playCloseSound(audioContext, 0.6);
      
    } catch (error) {
      console.log('Error reproduciendo sonido de cajero:', error);
      playFallbackSound();
    }
  }
};

// Sonido de apertura - "CLACK" agudo
const playOpenSound = (audioContext, startTime) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + startTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + startTime + 0.1);
  oscillator.type = 'sine';
  
  // Envolvente rápida y aguda
  gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
  gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + 0.1);
  
  oscillator.start(audioContext.currentTime + startTime);
  oscillator.stop(audioContext.currentTime + startTime + 0.1);
};

// Sonido de monedas - "CHA-CHING"
const playCoinSound = (audioContext, startTime) => {
  // Múltiples osciladores para simular monedas
  const frequencies = [800, 1000, 600, 1200];
  const times = [0, 0.05, 0.1, 0.15];
  
  times.forEach((timeOffset, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequencies[index], audioContext.currentTime + startTime + timeOffset);
    oscillator.type = 'triangle'; // Tipo más suave para monedas
    
    // Envolvente para cada "moneda"
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime + timeOffset);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + startTime + timeOffset + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + timeOffset + 0.3);
    
    oscillator.start(audioContext.currentTime + startTime + timeOffset);
    oscillator.stop(audioContext.currentTime + startTime + timeOffset + 0.3);
  });
};

// Sonido de cierre - "CLACK" más grave
const playCloseSound = (audioContext, startTime) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + startTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + startTime + 0.15);
  oscillator.type = 'sine';
  
  // Envolvente más lenta para el cierre
  gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + startTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + 0.15);
  
  oscillator.start(audioContext.currentTime + startTime);
  oscillator.stop(audioContext.currentTime + startTime + 0.15);
};

// Sonido de fallback simple
const playFallbackSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Sonido simple de "ding"
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    console.log('No se pudo reproducir ningún sonido');
  }
};