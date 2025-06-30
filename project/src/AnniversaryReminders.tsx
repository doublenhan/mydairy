import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Bell, Plus, X, Edit3, Trash2, ArrowLeft, Gift, Sparkles, Clock, BellRing } from 'lucide-react';
import './styles/AnniversaryReminders.css';

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
    <div className="anniversary-reminders-page">
      {/* Header */}
      <header className="anniversary-header">
        <div className="anniversary-header-container">
          <div className="anniversary-header-content">
            <button 
              onClick={onBack}
              className="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="back-button-text">Back</span>
            </button>
            
            <div className="header-logo">
              <div className="header-logo-icon">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="header-logo-text">Love Journal</span>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="add-button"
            >
              <Plus className="w-5 h-5" />
              <span className="add-button-text">Add</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="anniversary-main">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">
            Anniversary
            <span className="gradient-text"> Reminders</span>
          </h1>
          <p className="page-subtitle">
            Never miss a special moment - keep track of all your important relationship milestones
          </p>
        </div>

        {/* Upcoming Anniversaries */}
        {upcomingAnniversaries.length > 0 && (
          <section className="upcoming-section">
            <div className="section-header">
              <div className="section-title-container">
                <BellRing className="w-6 h-6 text-pink-500 animate-pulse" />
                <h2 className="section-title">Coming Soon</h2>
              </div>
              <div className="upcoming-count">
                {upcomingAnniversaries.length} upcoming
              </div>
            </div>
            
            <div className="anniversaries-grid">
              {upcomingAnniversaries.map((anniversary, index) => (
                <div 
                  key={anniversary.id}
                  className="anniversary-card upcoming-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={createFloatingHearts}
                >
                  {/* Card Header */}
                  <div className="card-header">
                    <div className={`anniversary-icon bg-gradient-to-r ${getAnniversaryColor(anniversary.type)}`}>
                      {getAnniversaryIcon(anniversary.type)}
                    </div>
                    <div className="card-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNotification(anniversary.id);
                        }}
                        className={`notification-toggle ${anniversary.isNotificationEnabled ? 'active' : ''}`}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAnniversary(anniversary);
                        }}
                        className="edit-button"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAnniversary(anniversary.id);
                        }}
                        className="delete-button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="card-content">
                    <h3 className="anniversary-title">{anniversary.title}</h3>
                    <div className="anniversary-date">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(anniversary.date)}</span>
                    </div>
                    
                    <div className="anniversary-details">
                      <div className="years-badge">
                        {(anniversary.yearsSince ?? 0) > 0 ? `${(anniversary.yearsSince ?? 0) + 1} Years` : 'First Year'}
                      </div>
                      <div className="days-until">
                        <Clock className="w-4 h-4" />
                        <span className="days-count">{anniversary.daysUntil}</span>
                        <span className="days-text">days to go</span>
                      </div>
                    </div>

                    {anniversary.isNotificationEnabled && (
                      <div className="reminder-info">
                        <Bell className="w-4 h-4" />
                        <span>Reminder set for {anniversary.reminderDays} day{anniversary.reminderDays !== 1 ? 's' : ''} before</span>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Glow Effect */}
                  <div className="upcoming-glow"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Anniversaries */}
        <section className="all-anniversaries-section">
          <div className="section-header">
            <div className="section-title-container">
              <Heart className="w-6 h-6 text-pink-500" />
              <h2 className="section-title">All Anniversaries</h2>
            </div>
            <div className="total-count">
              {anniversaries.length} total
            </div>
          </div>
          
          <div className="anniversaries-grid">
            {otherAnniversaries.map((anniversary, index) => (
              <div 
                key={anniversary.id}
                className="anniversary-card"
                style={{ animationDelay: `${(upcomingAnniversaries.length + index) * 0.1}s` }}
                onClick={createFloatingHearts}
              >
                {/* Card Header */}
                <div className="card-header">
                  <div className={`anniversary-icon bg-gradient-to-r ${getAnniversaryColor(anniversary.type)}`}>
                    {getAnniversaryIcon(anniversary.type)}
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotification(anniversary.id);
                      }}
                      className={`notification-toggle ${anniversary.isNotificationEnabled ? 'active' : ''}`}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAnniversary(anniversary);
                      }}
                      className="edit-button"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnniversary(anniversary.id);
                      }}
                      className="delete-button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="card-content">
                  <h3 className="anniversary-title">{anniversary.title}</h3>
                  <div className="anniversary-date">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(anniversary.date)}</span>
                  </div>
                  
                  <div className="anniversary-details">
                    <div className="years-badge">
                      {(anniversary.yearsSince ?? 0) > 0 ? `${(anniversary.yearsSince ?? 0) + 1} Years` : 'First Year'}
                    </div>
                    <div className="days-until">
                      <Clock className="w-4 h-4" />
                      <span className="days-count">{anniversary.daysUntil}</span>
                      <span className="days-text">days to go</span>
                    </div>
                  </div>

                  {anniversary.isNotificationEnabled && (
                    <div className="reminder-info">
                      <Bell className="w-4 h-4" />
                      <span>Reminder set for {anniversary.reminderDays} day{anniversary.reminderDays !== 1 ? 's' : ''} before</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {anniversaries.length === 0 && (
          <div className="empty-state">
            <Heart className="empty-state-icon" />
            <h3 className="empty-state-title">No anniversaries yet</h3>
            <p className="empty-state-text">Add your first anniversary to start tracking your special moments!</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="empty-state-button"
            >
              <Plus className="w-5 h-5" />
              Add Anniversary
            </button>
          </div>
        )}
      </main>

      {/* Add/Edit Anniversary Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">
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
                className="modal-close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Anniversary Title</label>
                <input
                  type="text"
                  value={newAnniversary.title}
                  onChange={(e) => setNewAnniversary(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., First Date Anniversary"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={newAnniversary.date}
                  onChange={(e) => setNewAnniversary(prev => ({ ...prev, date: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Anniversary Type</label>
                <select
                  value={newAnniversary.type}
                  onChange={(e) => setNewAnniversary(prev => ({ ...prev, type: e.target.value as any }))}
                  className="form-select"
                >
                  <option value="custom">Custom</option>
                  <option value="first_date">First Date</option>
                  <option value="engagement">Engagement</option>
                  <option value="wedding">Wedding</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Remind me</label>
                <select
                  value={newAnniversary.reminderDays}
                  onChange={(e) => setNewAnniversary(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                  className="form-select"
                >
                  <option value={1}>1 day before</option>
                  <option value={3}>3 days before</option>
                  <option value={7}>1 week before</option>
                  <option value={14}>2 weeks before</option>
                  <option value={30}>1 month before</option>
                </select>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newAnniversary.isNotificationEnabled}
                    onChange={(e) => setNewAnniversary(prev => ({ ...prev, isNotificationEnabled: e.target.checked }))}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Enable notifications</span>
                </label>
              </div>
            </div>

            <div className="modal-actions">
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
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={editingAnniversary ? handleUpdateAnniversary : handleAddAnniversary}
                disabled={!newAnniversary.title || !newAnniversary.date}
                className="save-button"
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
          className="floating-heart"
          style={{
            left: heart.x,
            top: heart.y,
          }}
        >
          <Heart className="w-6 h-6 fill-current text-pink-500" />
        </div>
      ))}
    </div>
  );
}

export default AnniversaryReminders;