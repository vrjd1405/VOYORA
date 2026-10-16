import jsPDF from 'jspdf';
import { DayGroup, ItineraryStats } from '../types';

export function generateItineraryPdf(
  tripTitle: string,
  days: DayGroup[],
  stats: ItineraryStats
): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    const checkPageBreak = (spaceNeeded: number) => {
      if (yPos + spaceNeeded > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
        drawHeaderMini();
      }
    };

    const drawHeaderMini = () => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(140, 150, 170);
      doc.text('VOYORA  |  CURATED TRAVEL ITINERARY', 20, 12);
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.3);
      doc.line(20, 15, pageWidth - 20, 15);
    };

    // Main Cover Header Banner
    doc.setFillColor(11, 15, 25); // Deep Navy
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Brand Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(248, 250, 252);
    doc.text('VOYORA', 20, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(56, 189, 248); // Sky blue
    doc.text('DISCOVER MORE. TRAVEL BETTER.', 66, 19.5);

    // Trip Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(226, 232, 240);
    doc.text(tripTitle.toUpperCase(), 20, 32);

    // Generation Date & Stats
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${dateStr}`, pageWidth - 20, 20, { align: 'right' });
    doc.text(
      `${stats.totalPlaces} Destinations  •  ${stats.totalDays} Days Planned`,
      pageWidth - 20,
      32,
      { align: 'right' }
    );

    yPos = 52;

    // Overview Stats Card
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(20, yPos, pageWidth - 40, 18, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('TRIP HIGHLIGHTS:', 26, yPos + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    const catKeys = Object.keys(stats.categoriesBreakdown || {});
    const catSummary = catKeys.map(k => `${k}: ${stats.categoriesBreakdown[k]}`).join('  |  ');
    doc.text(
      `Must-Visit Places: ${stats.mustVisitCount}   •   Categories: ${catSummary || 'General'}`,
      26,
      yPos + 13
    );

    yPos += 28;

    // Iterate through Days
    days.forEach(day => {
      checkPageBreak(30);

      // Day Header
      doc.setFillColor(37, 99, 235); // Blue
      doc.roundedRect(20, yPos, 22, 7, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`DAY ${day.dayNumber}`, 23, yPos + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(`Day ${day.dayNumber} Itinerary (${day.items.length} Places)`, 46, yPos + 5.5);

      yPos += 12;

      // Day Items
      day.items.forEach((item, itemIdx) => {
        const itemBoxHeight = item.notes ? 24 : 16;
        checkPageBreak(itemBoxHeight + 4);

        // Item number bullet
        doc.setFillColor(241, 245, 249);
        doc.circle(24, yPos + 3, 3.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text(`${itemIdx + 1}`, 24, yPos + 4.2, { align: 'center' });

        // Place Name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(item.name, 32, yPos + 4);

        // Must-Visit Badge if applicable
        if (item.isMustVisit) {
          const nameWidth = doc.getTextWidth(item.name);
          doc.setFillColor(254, 243, 199);
          doc.roundedRect(34 + nameWidth, yPos, 20, 5, 1, 1, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(180, 83, 9);
          doc.text('★ MUST-VISIT', 36 + nameWidth, yPos + 3.6);
        }

        // Location & Category
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `${item.category}  •  ${item.city}, ${item.country}  •  Coords: ${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}`,
          32,
          yPos + 9
        );

        // Personal Notes if present
        if (item.notes) {
          doc.setFillColor(255, 251, 235);
          doc.setDrawColor(253, 230, 138);
          doc.roundedRect(32, yPos + 11.5, pageWidth - 55, 7.5, 1, 1, 'FD');
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(146, 64, 14);
          doc.text(`Note: ${item.notes.substring(0, 110)}`, 35, yPos + 16.5);
          yPos += 8;
        }

        yPos += 14;
      });

      yPos += 6;
    });

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 174, 192);
      doc.text(
        `Voyora Smart Travel Planner — Page ${p} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const filename = `Voyora_Itinerary_${tripTitle.replace(/\s+/g, '_')}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error('Failed to export PDF:', err);
    throw err;
  }
}
