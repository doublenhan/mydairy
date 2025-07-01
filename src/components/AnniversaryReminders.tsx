import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Bell, Plus, X, Edit3, Trash2, ArrowLeft, Gift, Sparkles, Clock, BellRing } from 'lucide-react';

interface Anniversary {
  id: string;
  title: string;
  date: string;
  type: 'first_date' | 'engagement' | 'wedding' | 'custom';
  reminderDays: number;
  isNotificationEnabled: boolean;
  yearsSince?: number;
  daysUntil?: number;
  isUpcoming?: boolean;
}

interface AnniversaryRemindersProps {
  onBack?: () => void;
}

function AnniversaryReminders({ onBack }: AnniversaryRemindersProps) {
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAnniversary, setEditingAnniversary] = useState<Anniversary | null>(null);
  const [newAnniversary, setNewAnniversary] = useState<{
    title: string;
    date: string;
    type: 'first_date' | 'engagement' | 'wedding' | 'custom';
    reminderDays: number;
    isNotificationEnabled: boolean;
  }>({
    title: '',
    date: '',
    type: 'custom',
    reminderDays: 1,
    isNotificationEnabled: true
  });
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Mock data for anniversaries
  useEffect(() => {
    const mockAnniversaries: Anniversary[] = [
      {
        id: '1',
        title: 'First Date Anniversary',
        date: '2025-01-15',
        type: 'first_date',
        reminderDays: 7,
        isNotificationEnabled: true
      },
      {
        id: '2',
        title: 'Engagement Anniversary',
        date: '2025-03-20',
        type: 'engagement',
        reminderDays: 3,
        isNotificationEnabled: true
      },
      {
        id: '3',
        title: 'Wedding Anniversary',
        date: '2025-06-15',
        type: 'wedding',
        reminderDays: 14,
        isNotificationEnabled: true
      },
      {
        id: '4',
        title: 'First Kiss Anniversary',
        date: '2025-02-14',
        type: 'custom',
        reminderDays: 1,
        isNotificationEnabled: false
      },
      {
        id: '5',
        title: 'Moving In Together',
        date: '2025-04-10',
        type: 'custom',
        reminderDays: 5,
        isNotificationEnabled: true
      }
    ];

    // Calculate years since and days until for each anniversary
    const processedAnniversaries = mockAnniversaries.map(anniversary => {
      const today = new Date();
      const anniversaryDate = new Date(anniversary.date);
      const thisYearDate = new Date(today.getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate());
      
      // If this year's date has passed, calculate for next year
      if (thisYearDate < today) {
        thisYearDate.setFullYear(today.getFullYear() + 1);
      }
      
      const daysUntil = Math.ceil((thisYearDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const yearsSince = today.getFullYear() - anniversaryDate.getFullYear();
      
      return {
        ...anniversary,
        yearsSince: yearsSince > 0 ? yearsSince : 0,
        daysUntil,
        isUpcoming: daysUntil <= anniversary.reminderDays
      };
    });

    // Sort by days until (soonest first)
    const sortedAnniversaries = processedAnniversaries.sort((a, b) => (a.daysUntil || 0) - (b.daysUntil || 0));
    setAnniversaries(sortedAnniversaries);
  }, []);

  const getAnniversaryIcon = (type: string) => {
    switch (type) {
      case 'first_date':
        return <Heart className="w-6 h-6" />;
      case 'engagement':
        return <Sparkles className="w-6 h-6" />;
      case 'wedding':
        return <Gift className="w-6 h-6" />;
      default:
        return <Calendar className="w-6 h-6" />;
    }
  };

  const getAnniversaryColor = (type: string) => {
    switch (type) {
      case 'first_date':
        return 'from-pink-400 to-rose-400';
      case 'engagement':
        return 'from-purple-400 to-pink-400';
      case 'wedding':
        return 'from-red-400 to-pink-400';
      default:
        return 'from-blue-400 to-purple-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddAnniversary = () => {
    if (!newAnniversary.title || !newAnniversary.date) return;

    const id = Date.now().toString();
    const today = new Date();
    const anniversaryDate = new Date(newAnniversary.date);
    const thisYearDate = new Date(today.getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate());
    
    if (thisYearDate < today) {
      thisYearDate.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntil = Math.ceil((thisYearDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const yearsSince = today.getFullYear() - anniversaryDate.getFullYear();

    const anniversary: Anniversary = {
      id,
      ...newAnniversary,
      yearsSince: yearsSince > 0 ? yearsSince : 0,
      daysUntil,
      isUpcoming: daysUntil <= newAnniversary.reminderDays
    };

    setAnniversaries(prev => [...prev, anniversary].sort((a, b) => (a.daysUntil || 0) - (b.daysUntil || 0)));
    setNewAnniversary({
      title: '',
      date: '',
      type: 'custom',
      reminderDays: 1,
      isNotificationEnabled: true
    });
    setShowAddForm(false);
  };

  const handleEditAnniversary = (anniversary: Anniversary) => {
    setEditingAnniversary(anniversary);
    setNewAnniversary({
      title: anniversary.title,
      date: anniversary.date,
      type: anniversary.type,
      reminderDays: anniversary.reminderDays,
      isNotificationEnabled: anniversary.isNotificationEnabled
    });
    setShowAddForm(true);
  };

  const handleUpdateAnniversary = () => {
    if (!editingAnniversary || !newAnniversary.title || !newAnniversary.date) return;

    const today = new Date();
    const anniversaryDate = new Date(newAnniversary.date);
    const thisYearDate = new Date(today.getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate());
    
    if (thisYearDate < today) {
      thisYearDate.setFullYear(today.getFullYear() + 1);
    }
    
    const daysUntil = Math.ceil((thisYearDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const yearsSince = today.getFullYear() - anniversaryDate.getFullYear();

    const updatedAnniversary: Anniversary = {
      ...editingAnniversary,
      ...newAnniversary,
      yearsSince: yearsSince > 0 ? yearsSince : 0,
      daysUntil,
      isUpcoming: daysUntil <= newAnniversary.reminderDays
    };

    setAnniversaries(prev => 
      prev.map(ann => ann.id === editingAnniversary.id ? updatedAnniversary : ann)
        .sort((a, b) => (a.daysUntil || 0) - (b.daysUntil || 0))
    );
    
    setEditingAnniversary(null);
    setNewAnniversary({
      title: '',
      date: '',
      type: 'custom',
      reminderDays: 1,
      isNotificationEnabled: true
    });
    setShowAddForm(false);
  };

  const handleDeleteAnniversary = (id: string) => {
    setAnniversaries(prev => prev.filter(ann => ann.id !== id));
  };

  const toggleNotification = (id: string) => {
    setAnniversaries(prev => 
      prev.map(ann => 
        ann.id === id 
          ? { ...ann, isNotificationEnabled: !ann.isNotificationEnabled }
          : ann
      )
    );
  };

  const createFloatingHearts = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hearts = [];
    
    for (let i = 0; i < 8; i++) {
      hearts.push({
        id: Date.now() + i,
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height
      });
    }
    
    setFloatingHearts(hearts);
    
    setTimeout(() => {
      setFloatingHearts([]);
    }, 2000);
  };

  const upcomingAnniversaries = anniversaries.filter(ann => ann.isUpcoming);
  const otherAnniversaries = anniversaries.filter(ann => !ann.isUpcoming);

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
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 hover:from-pink-600 hover:to-rose-600 hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:block">Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Anniversary
            <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"> Reminders</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Never miss a special moment - keep track of all your important relationship milestones
          </p>
        </div>

        {/* Upcoming Anniversaries */}
        {upcomingAnniversaries.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <BellRing className="w-6 h-6 text-pink-500 animate-pulse" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Coming Soon</h2>
              </div>
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold border border-pink-200">
                {upcomingAnniversaries.length} upcoming
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingAnniversaries.map((anniversary, index) => (
                <div 
                  key={anniversary.id}
                  className="bg-white rounded-3xl shadow-xl border-2 border-pink-200 p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer relative overflow-hidden animate-pulse-glow"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={createFloatingHearts}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getAnniversaryColor(anniversary.type)} flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110`}>
                      {getAnniversaryIcon(anniversary.type)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNotification(anniversary.id);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          anniversary.isNotificationEnabled 
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse' 
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAnniversary(anniversary);
                        }}
                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center transition-all duration-200 hover:bg-blue-200 hover:scale-110"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAnniversary(anniversary.id);
                        }}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center transition-all duration-200 hover:bg-red-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900">{anniversary.title}</h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(anniversary.date)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold border border-pink-200">
                        {(anniversary.yearsSince ?? 0) > 0 ? `${(anniversary.yearsSince ?? 0) + 1} Years` : 'First Year'}
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-2xl font-bold text-pink-600">{anniversary.daysUntil}</span>
                        <span className="text-sm">days to go</span>
                      </div>
                    </div>

                    {anniversary.isNotificationEnabled && (
                      <div className="flex items-center space-x-2 text-gray-600 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <Bell className="w-4 h-4" />
                        <span className="text-sm">Reminder set for {anniversary.reminderDays} day{anniversary.reminderDays !== 1 ? 's' : ''} before</span>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl pointer-events-none"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Anniversaries */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-pink-500" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">All Anniversaries</h2>
            </div>
            <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-semibold">
              {anniversaries.length} total
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherAnniversaries.map((anniversary, index) => (
              <div 
                key={anniversary.id}
                className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${(upcomingAnniversaries.length + index) * 0.1}s` }}
                onClick={createFloatingHearts}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getAnniversaryColor(anniversary.type)} flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110`}>
                    {getAnniversaryIcon(anniversary.type)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotification(anniversary.id);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                        anniversary.isNotificationEnabled 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAnniversary(anniversary);
                      }}
                      className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center transition-all duration-200 hover:bg-blue-200 hover:scale-110"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnniversary(anniversary.id);
                      }}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center transition-all duration-200 hover:bg-red-200 hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">{anniversary.title}</h3>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(anniversary.date)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold border border-pink-200">
                      {(anniversary.yearsSince ?? 0) > 0 ? `${(anniversary.yearsSince ?? 0) + 1} Years` : 'First Year'}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-2xl font-bold text-pink-600">{anniversary.daysUntil}</span>
                      <span className="text-sm">days to go</span>
                    </div>
                  </div>

                  {anniversary.isNotificationEnabled && (
                    <div className="flex items-center space-x-2 text-gray-600 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Bell className="w-4 h-4" />
                      <span className="text-sm">Reminder set for {anniversary.reminderDays} day{anniversary.reminderDays !== 1 ? 's' : ''} before</span>
                    </div>
                  )}
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {anniversaries.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No anniversaries yet</h3>
            <p className="text-gray-500 mb-8">Add your first anniversary to start tracking your special moments!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:from-pink-600 hover:to-rose-600 hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add Anniversary</span>
            </button>
          </div>
        )}
      </main>

      {/* Add/Edit Anniversary Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAnniversary ? 'Edit Anniversary' : 'Add New Anniversary'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAnniversary(null);
                  setNewAnniversary({
                    title: '',
                    date: '',
                    type: 'custom',
                    reminderDays: 1,
                    isNotificationEnabled: true
                  });
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Anniversary Title</label>
                <input
                  type="text"
                  value={newAnniversary.title}
                  onChange={(e) => setNewAnniversary(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., First Date Anniversary"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                <input
                  type="date"
                  value={newAnniversary.date}
                  onChange={(e) => setNewAnniversary(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Anniversary Type</label>
                <select
                  value={newAnniversary.type}
                  onChange={(e) => setNewAnniversary(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                >
                  <option value="custom">Custom</option>
                  <option value="first_date">First Date</option>
                  <option value="engagement">Engagement</option>
                  <option value="wedding">Wedding</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Remind me</label>
                <select
                  value={newAnniversary.reminderDays}
                  onChange={(e) => setNewAnniversary(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-100"
                >
                  <option value={1}>1 day before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                  <option value={14}>2 weeks before</option>
                  <option value={30}>1 month before</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAnniversary.isNotificationEnabled}
                    onChange={(e) => setNewAnniversary(prev => ({ ...prev, isNotificationEnabled: e.target.checked }))}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-gray-900">Enable notifications</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4 p-8 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAnniversary(null);
                  setNewAnniversary({
                    title: '',
                    date: '',
                    type: 'custom',
                    reminderDays: 1,
                    isNotificationEnabled: true
                  });
                }}
                className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingAnniversary ? handleUpdateAnniversary : handleAddAnniversary}
                disabled={!newAnniversary.title || !newAnniversary.date}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold transition-all duration-200 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
              >
                {editingAnniversary ? 'Update' : 'Add'} Anniversary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Hearts */}
      {floatingHearts.map(heart => (
        <div
          key={heart.id}
          className="fixed pointer-events-none z-50 animate-float-heart"
          style={{
            left: heart.x,
            top: heart.y,
          }}
        >
          <Heart className="w-6 h-6 fill-current text-pink-500" />
        </div>
      ))}

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(236, 72, 153, 0.6);
          }
        }

        @keyframes float-heart {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5) rotate(360deg);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s infinite;
        }

        .animate-float-heart {
          animation: float-heart 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default AnniversaryReminders;