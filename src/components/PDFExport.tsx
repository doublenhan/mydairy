import React, { useState } from 'react';
import { Heart, Calendar, ArrowLeft, Download, FileText, Image, Palette, Settings, Check, Loader2, Star, Sparkles, BookOpen } from 'lucide-react';
import jsPDF from 'jspdf';

interface Memory {
  id: string;
  date: string;
  content: string;
  photos: string[];
  mood: string;
  moodEmoji: string;
}

interface PDFExportProps {
  onBack?: () => void;
}

interface ExportSettings {
  dateRange: {
    start: string;
    end: string;
  };
  selectedMemories: string[];
  template: 'romantic' | 'elegant' | 'scrapbook';
  includeImages: boolean;
  includeMoods: boolean;
  coverPage: {
    enabled: boolean;
    title: string;
    names: string;
    featuredImage: string;
  };
}

function PDFExport({ onBack }: PDFExportProps) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    dateRange: {
      start: '2024-01-01',
      end: new Date().toISOString().split('T')[0]
    },
    selectedMemories: [],
    template: 'romantic',
    includeImages: true,
    includeMoods: true,
    coverPage: {
      enabled: true,
      title: 'Our Love Story',
      names: 'Sarah & Michael',
      featuredImage: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Mock data - in a real app, this would come from your backend
  React.useEffect(() => {
    const mockMemories: Memory[] = [
      {
        id: '1',
        date: '2024-01-15',
        content: 'Our first date at the little café downtown. You ordered a lavender latte and I couldn\'t stop staring at how the sunlight caught your hair. We talked for hours about everything and nothing, and I knew right then that this was the beginning of something beautiful. The way you laughed at my terrible jokes made my heart skip a beat.',
        photos: [
          'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1024956/pexels-photo-1024956.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        mood: 'excited',
        moodEmoji: '🤩'
      },
      {
        id: '2',
        date: '2024-01-20',
        content: 'Beach sunset walk where you said yes to being my girlfriend. The waves were gentle, the sky was painted in shades of pink and gold, and when I asked if you wanted to make this official, your smile lit up brighter than the sunset. We collected shells and made promises to always find time for moments like these.',
        photos: [
          'https://images.pexels.com/photos/1024970/pexels-photo-1024970.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        mood: 'romantic',
        moodEmoji: '💕'
      },
      {
        id: '3',
        date: '2024-02-14',
        content: 'Valentine\'s Day surprise picnic in the park. I spent all morning preparing your favorite sandwiches and that strawberry cake you love. When you saw the setup under our favorite oak tree, you cried happy tears. We spent the afternoon feeding ducks, reading poetry to each other, and planning our future adventures together.',
        photos: [
          'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        mood: 'happy',
        moodEmoji: '😊'
      },
      {
        id: '4',
        date: '2024-03-10',
        content: 'Cooking disaster turned perfect evening. We tried to make pasta from scratch and ended up with flour everywhere, including in your hair! Instead of being frustrated, we ordered pizza and danced in the kitchen while waiting for delivery. Sometimes the best memories come from the unplanned moments.',
        photos: [
          'https://images.pexels.com/photos/1024962/pexels-photo-1024962.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1024958/pexels-photo-1024958.jpeg?auto=compress&cs=tinysrgb&w=600',
        ],
        mood: 'nostalgic',
        moodEmoji: '🥺'
      }
    ];

    // Filter memories by date range
    const filteredMemories = mockMemories.filter(memory => {
      const memoryDate = new Date(memory.date);
      const startDate = new Date(exportSettings.dateRange.start);
      const endDate = new Date(exportSettings.dateRange.end);
      return memoryDate >= startDate && memoryDate <= endDate;
    });

    setMemories(filteredMemories);
    setExportSettings(prev => ({
      ...prev,
      selectedMemories: filteredMemories.map(m => m.id)
    }));
  }, [exportSettings.dateRange]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTemplateStyles = (template: string) => {
    switch (template) {
      case 'romantic':
        return {
          background: 'linear-gradient(135deg, #fdf2f8, #fef7ed)',
          primaryColor: '#ec4899',
          secondaryColor: '#f43f5e',
          fontFamily: 'Georgia, serif',
          decorativeElements: true
        };
      case 'elegant':
        return {
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
          primaryColor: '#475569',
          secondaryColor: '#64748b',
          fontFamily: 'Times New Roman, serif',
          decorativeElements: false
        };
      case 'scrapbook':
        return {
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          primaryColor: '#d97706',
          secondaryColor: '#f59e0b',
          fontFamily: 'Comic Sans MS, cursive',
          decorativeElements: true
        };
      default:
        return {
          background: 'white',
          primaryColor: '#000000',
          secondaryColor: '#666666',
          fontFamily: 'Arial, sans-serif',
          decorativeElements: false
        };
    }
  };

  const convertImageToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  };

  const generatePDF = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      let yPosition = margin;
      const templateStyles = getTemplateStyles(exportSettings.template);

      // Add cover page if enabled
      if (exportSettings.coverPage.enabled) {
        setExportProgress(10);
        
        // Cover page background
        pdf.setFillColor(236, 72, 153);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Cover page content
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(32);
        pdf.setFont('helvetica', 'bold');
        
        const titleLines = pdf.splitTextToSize(exportSettings.coverPage.title, contentWidth);
        pdf.text(titleLines, pageWidth / 2, pageHeight / 2 - 30, { align: 'center' });
        
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'normal');
        pdf.text(exportSettings.coverPage.names, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
        
        // Add featured image if available
        if (exportSettings.coverPage.featuredImage && exportSettings.includeImages) {
          try {
            const base64Image = await convertImageToBase64(exportSettings.coverPage.featuredImage);
            if (base64Image) {
              const imgWidth = 60;
              const imgHeight = 40;
              pdf.addImage(base64Image, 'JPEG', (pageWidth - imgWidth) / 2, pageHeight / 2 + 30, imgWidth, imgHeight);
            }
          } catch (error) {
            console.error('Error adding cover image:', error);
          }
        }
        
        // Add decorative elements
        if (templateStyles.decorativeElements) {
          pdf.setDrawColor(255, 255, 255);
          pdf.setLineWidth(2);
          pdf.rect(margin, margin, contentWidth, pageHeight - (margin * 2));
        }
        
        pdf.addPage();
        yPosition = margin;
      }

      setExportProgress(20);

      // Filter selected memories
      const selectedMemories = memories.filter(memory => 
        exportSettings.selectedMemories.includes(memory.id)
      );

      // Add memories
      for (let i = 0; i < selectedMemories.length; i++) {
        const memory = selectedMemories[i];
        setExportProgress(20 + (i / selectedMemories.length) * 70);

        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        // Memory date header
        pdf.setFillColor(236, 72, 153);
        pdf.rect(margin, yPosition, contentWidth, 15, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        
        let dateText = formatDate(memory.date);
        if (exportSettings.includeMoods) {
          dateText += ` ${memory.moodEmoji}`;
        }
        
        pdf.text(dateText, margin + 5, yPosition + 10);
        yPosition += 20;

        // Memory content
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        const contentLines = pdf.splitTextToSize(memory.content, contentWidth);
        pdf.text(contentLines, margin, yPosition);
        yPosition += contentLines.length * 5 + 10;

        // Add images if enabled
        if (exportSettings.includeImages && memory.photos.length > 0) {
          for (const photo of memory.photos) {
            try {
              const base64Image = await convertImageToBase64(photo);
              if (base64Image) {
                // Check if image fits on current page
                const imgHeight = 60;
                if (yPosition + imgHeight > pageHeight - margin) {
                  pdf.addPage();
                  yPosition = margin;
                }
                
                const imgWidth = Math.min(contentWidth, 80);
                pdf.addImage(base64Image, 'JPEG', margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 10;
              }
            } catch (error) {
              console.error('Error adding image:', error);
            }
          }
        }

        yPosition += 15; // Space between memories
      }

      setExportProgress(95);

      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(8);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text('Generated by Love Journal', pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      setExportProgress(100);

      // Save the PDF
      const fileName = `${exportSettings.coverPage.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const toggleMemorySelection = (memoryId: string) => {
    setExportSettings(prev => ({
      ...prev,
      selectedMemories: prev.selectedMemories.includes(memoryId)
        ? prev.selectedMemories.filter(id => id !== memoryId)
        : [...prev.selectedMemories, memoryId]
    }));
  };

  const selectAllMemories = () => {
    setExportSettings(prev => ({
      ...prev,
      selectedMemories: memories.map(m => m.id)
    }));
  };

  const deselectAllMemories = () => {
    setExportSettings(prev => ({
      ...prev,
      selectedMemories: []
    }));
  };

  const getTemplateIcon = (template: string) => {
    switch (template) {
      case 'romantic':
        return <Heart className="w-6 h-6" />;
      case 'elegant':
        return <Star className="w-6 h-6" />;
      case 'scrapbook':
        return <BookOpen className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-all duration-200 hover:-translate-x-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl animate-pulse">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Love Journal</span>
            </div>
            
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Export to
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"> PDF</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create a beautiful PDF book of your love memories to print and treasure forever
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Settings Panel */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8">
              <div className="flex items-center space-x-3 mb-8">
                <Settings className="w-6 h-6 text-pink-500" />
                <h2 className="text-2xl font-bold text-gray-900">Export Settings</h2>
              </div>

              {/* Date Range */}
              <div className="mb-8">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                  <Calendar className="w-5 h-5" />
                  <span>Date Range</span>
                </label>
                <div className="flex items-center space-x-4 flex-wrap gap-4">
                  <input
                    type="date"
                    value={exportSettings.dateRange.start}
                    onChange={(e) => setExportSettings(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="flex-1 min-w-[140px] px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                  />
                  <span className="text-gray-500 font-medium">to</span>
                  <input
                    type="date"
                    value={exportSettings.dateRange.end}
                    onChange={(e) => setExportSettings(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="flex-1 min-w-[140px] px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* Template Selection */}
              <div className="mb-8">
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                  <Palette className="w-5 h-5" />
                  <span>Template Style</span>
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'romantic', name: 'Romantic', description: 'Pink hearts & elegant fonts' },
                    { id: 'elegant', name: 'Elegant', description: 'Clean & sophisticated' },
                    { id: 'scrapbook', name: 'Scrapbook', description: 'Fun & colorful design' }
                  ].map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setExportSettings(prev => ({ ...prev, template: template.id as any }))}
                      className={`w-full flex items-center space-x-4 p-4 border-2 rounded-xl transition-all duration-200 text-left relative ${
                        exportSettings.template === template.id 
                          ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-md' 
                          : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      <div className="text-pink-500 flex-shrink-0">
                        {getTemplateIcon(template.id)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      {exportSettings.template === template.id && (
                        <Check className="w-5 h-5 text-pink-500 absolute top-2 right-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Options */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-900 mb-3">Content Options</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-pink-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={exportSettings.includeImages}
                      onChange={(e) => setExportSettings(prev => ({ ...prev, includeImages: e.target.checked }))}
                      className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <Image className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Include Photos</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-pink-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={exportSettings.includeMoods}
                      onChange={(e) => setExportSettings(prev => ({ ...prev, includeMoods: e.target.checked }))}
                      className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <Sparkles className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Include Mood Indicators</span>
                  </label>
                </div>
              </div>

              {/* Cover Page Settings */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-pink-50 transition-colors mb-4">
                  <input
                    type="checkbox"
                    checked={exportSettings.coverPage.enabled}
                    onChange={(e) => setExportSettings(prev => ({
                      ...prev,
                      coverPage: { ...prev.coverPage, enabled: e.target.checked }
                    }))}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Include Cover Page</span>
                </label>

                {exportSettings.coverPage.enabled && (
                  <div className="space-y-4 ml-8">
                    <input
                      type="text"
                      placeholder="Book Title"
                      value={exportSettings.coverPage.title}
                      onChange={(e) => setExportSettings(prev => ({
                        ...prev,
                        coverPage: { ...prev.coverPage, title: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                    />
                    <input
                      type="text"
                      placeholder="Your Names"
                      value={exportSettings.coverPage.names}
                      onChange={(e) => setExportSettings(prev => ({
                        ...prev,
                        coverPage: { ...prev.coverPage, names: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Memory Selection */}
          <div className="bg-white rounded-3xl shadow-xl border border-pink-100 overflow-hidden">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-pink-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Select Memories</h2>
                  <span className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold border border-pink-200">
                    {exportSettings.selectedMemories.length} of {memories.length} selected
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button onClick={selectAllMemories} className="text-pink-600 hover:text-pink-700 font-medium transition-colors">
                    Select All
                  </button>
                  <button onClick={deselectAllMemories} className="text-gray-600 hover:text-gray-700 font-medium transition-colors">
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-200 cursor-pointer border-2 mb-3 ${
                    exportSettings.selectedMemories.includes(memory.id) 
                      ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200' 
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                  onClick={() => toggleMemorySelection(memory.id)}
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    {exportSettings.selectedMemories.includes(memory.id) ? (
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-lg"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 text-sm">{formatDate(memory.date)}</span>
                      {exportSettings.includeMoods && (
                        <span className="text-xl">{memory.moodEmoji}</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {memory.content.substring(0, 120)}
                      {memory.content.length > 120 ? '...' : ''}
                    </p>
                    {memory.photos.length > 0 && (
                      <div className="flex items-center space-x-1 mt-2 text-gray-500">
                        <Image className="w-4 h-4" />
                        <span className="text-xs">{memory.photos.length} photo{memory.photos.length !== 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {memories.length === 0 && (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-pink-200 mx-auto mb-4" />
                  <p className="text-gray-500">No memories found in the selected date range</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Export</h3>
              <p className="text-gray-600">
                {exportSettings.selectedMemories.length} memories selected • 
                {exportSettings.template} template • 
                {exportSettings.includeImages ? 'With' : 'Without'} photos
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={generatePDF}
                disabled={exportSettings.selectedMemories.length === 0 || isExporting}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[160px] justify-center"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {isExporting && (
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300 rounded-full"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 mt-2 block text-center">{exportProgress}% Complete</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PDFExport;