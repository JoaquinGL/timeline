import React, { useState, useEffect, RefObject } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './PdfGenerator.module.scss';

interface PdfGeneratorProps {
  contentRef: RefObject<HTMLDivElement | null>;
}

const PdfGenerator: React.FC<PdfGeneratorProps> = ({ contentRef }) => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const contentHeight = contentRef.current.scrollHeight;

      // 🔹 Detecta cuando el usuario ha llegado al final del contenido
      if (scrollY + windowHeight >= contentHeight - 5) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentRef]);

  const generatePdf = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
      position -= 297;
      if (heightLeft > 0) pdf.addPage();
    }

    pdf.save('timeline.pdf');
  };

  return (
    <>
      {isBottom && ( // 🔹 Solo muestra el botón cuando el usuario ha llegado al final
        <button className={styles.pdfButton} onClick={generatePdf}>
          Descargar PDF
        </button>
      )}
    </>
  );
};

export default PdfGenerator;
