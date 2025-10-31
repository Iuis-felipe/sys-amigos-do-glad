import { useCallback } from 'react';

// Hook para captura de tela usando a API nativa do navegador
export const useScreenCapture = () => {
  const captureScreen = useCallback(async () => {
    try {
      // Verifica se a API de captura de tela está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('API de captura de tela não suportada neste navegador');
      }

      // Solicita permissão para captura de tela
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      return stream;
    } catch (error) {
      console.error('Erro ao capturar tela:', error);
      throw error;
    }
  }, []);

  const downloadImage = useCallback((canvas: HTMLCanvasElement, filename: string) => {
    // Converte canvas para blob
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  }, []);

  // Método alternativo usando html2canvas (requer instalação da lib)
  const captureElementAsImage = useCallback(async (elementId: string, filename: string = 'captura') => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Elemento com ID '${elementId}' não encontrado`);
    }

    try {
      // Implementação manual de captura usando Canvas API
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Não foi possível criar contexto do canvas');
      }

      canvas.width = rect.width;
      canvas.height = rect.height;

      // Esta é uma implementação básica - para funcionalidade completa,
      // recomenda-se usar a biblioteca html2canvas
      const data = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:12px">
              ${element.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `;

      const img = new Image();
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          downloadImage(canvas, filename);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });

    } catch (error) {
      console.error('Erro ao capturar elemento:', error);
      throw error;
    }
  }, [downloadImage]);

  // Método para salvar como PDF (requer jsPDF)
  const saveAsPDF = useCallback(async (elementId: string, filename: string = 'documento') => {
    try {
      // Implementação básica - para PDF completo, use jsPDF + html2canvas
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Elemento com ID '${elementId}' não encontrado`);
      }

      // Cria um novo documento PDF (implementação manual básica)
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${filename}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              .no-print { display: none !important; }
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${element.outerHTML}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 1000);
              }
            </script>
          </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Erro ao salvar como PDF:', error);
      throw error;
    }
  }, []);

  return {
    captureScreen,
    captureElementAsImage,
    saveAsPDF,
    downloadImage
  };
};