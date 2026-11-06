import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Eye, 
  EyeOff, 
  UploadCloud, 
  Globe, 
  Sparkles,
  Smartphone,
  Monitor,
  RefreshCw,
  Info
} from 'lucide-react';
import { HeroBanner } from '../adminTypes';

interface HeroBannerManagementProps {
  banners: HeroBanner[];
  onUpdateBanners: (updatedBanners: HeroBanner[]) => void;
  triggerNotify: (type: 'info' | 'success' | 'warn' | 'danger', message: string) => void;
}

// Preset designs for rapid insertion
const BANNER_PRESETS = [
  {
    title: 'SPIN & WIN SUNDAYS',
    subtitle: 'Get up to 500% Match Bonus + 200 Free Slots Reels Spins on registration',
    badgeText: 'MEGA OFFER',
    badgeColor: 'bg-amber-500/10 border border-amber-500/30 text-amber-400',
    ctaText: 'Spin Now',
    imageUrl: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=1200',
    clickUrl: '#/promotions/spin-and-win'
  },
  {
    title: 'LIVE SPORTS PREMIUM BOOK',
    subtitle: 'Place wagers on live football, tennis and cricket match events with elite ₹ odds',
    badgeText: 'LIVE WAGERING',
    badgeColor: 'bg-blue-500/10 border border-blue-500/30 text-blue-400',
    ctaText: 'Bet Pre-Match',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
    clickUrl: '#/sportsbook'
  },
  {
    title: 'ROYAL CASINO BLACKJACK VIP',
    subtitle: 'Immerse in direct high-stakes dealer card rooms with exclusive cashbacks',
    badgeText: 'VIP CLUB',
    badgeColor: 'bg-purple-500/10 border border-purple-500/30 text-purple-400',
    ctaText: 'Claim Seat',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200',
    clickUrl: '#/live-casino'
  },
  {
    title: 'CRASH TURBO - MULTIPLY ₹',
    subtitle: 'Watch the multiplier climb and cash out before the rocket goes boom',
    badgeText: 'INSTANT GAME',
    badgeColor: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
    ctaText: 'Launch Flight',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    clickUrl: '#/crash-turbo'
  }
];

export default function HeroBannerManagement({ 
  banners, 
  onUpdateBanners, 
  triggerNotify 
}: HeroBannerManagementProps) {
  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Explore Offer');
  const [clickUrl, setClickUrl] = useState('#/promotions');
  const [imageUrl, setImageUrl] = useState('');
  const [badgeText, setBadgeText] = useState('PROMOTIONAL');
  const [badgeColor, setBadgeColor] = useState('indigo'); // indigo, amber, emerald, rose, blue
  const [textPosition, setTextPosition] = useState<'left' | 'center' | 'right'>('left');
  const [overlayOpacity, setOverlayOpacity] = useState(40);
  const [isActive, setIsActive] = useState(true);

  // File upload state & ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Live preview slider states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Filter banners to show active ones in preview
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeBanners.length]);

  // Adjust preview index if banners count changes
  useEffect(() => {
    if (currentIndex >= activeBanners.length && activeBanners.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeBanners.length, currentIndex]);

  // Handle preset click
  const handleApplyPreset = (preset: typeof BANNER_PRESETS[number]) => {
    setTitle(preset.title);
    setSubtitle(preset.subtitle);
    setCtaText(preset.ctaText);
    setClickUrl(preset.clickUrl);
    setImageUrl(preset.imageUrl);
    setBadgeText(preset.badgeText);
    
    // Auto map preset badge colors
    if (preset.badgeText === 'MEGA OFFER') setBadgeColor('amber');
    else if (preset.badgeText === 'LIVE WAGERING') setBadgeColor('blue');
    else if (preset.badgeText === 'VIP CLUB') setBadgeColor('purple');
    else if (preset.badgeText === 'INSTANT GAME') setBadgeColor('emerald');
    else setBadgeColor('indigo');

    triggerNotify('info', `Preset template "${preset.title}" populated into config card.`);
  };

  // Helper for mapping badge color style to tailwind classes
  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'amber': return 'bg-amber-500/10 border border-amber-500/30 text-amber-400';
      case 'emerald': return 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400';
      case 'rose': return 'bg-rose-500/10 border border-rose-500/30 text-rose-400';
      case 'blue': return 'bg-blue-500/10 border border-blue-500/30 text-blue-400';
      case 'purple': return 'bg-purple-500/10 border border-purple-500/30 text-purple-400';
      default: return 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400';
    }
  };

  // Handle simulated file reading (convert local files to base64 immediately for fully functional local uploading!)
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      triggerNotify('danger', 'Uploaded file must be a valid image format.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setImageUrl(e.target.result);
        triggerNotify('success', `Simulated file upload finalized: "${file.name}"`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Clear Form
  const clearForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setCtaText('Explore Offer');
    setClickUrl('#/promotions');
    setImageUrl('');
    setBadgeText('PROMOTIONAL');
    setBadgeColor('indigo');
    setTextPosition('left');
    setOverlayOpacity(40);
    setIsActive(true);
  };

  // Submit Banner Creation or Update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      triggerNotify('warn', 'Banner Headline Title is required.');
      return;
    }
    if (!imageUrl.trim()) {
      triggerNotify('warn', 'Banner Cover Image URL or uploaded image is required.');
      return;
    }

    if (editingId) {
      // Edit mode
      const updated = banners.map(b => {
        if (b.id === editingId) {
          return {
            ...b,
            title: title.trim(),
            subtitle: subtitle.trim(),
            ctaText: ctaText.trim(),
            clickUrl: clickUrl.trim(),
            imageUrl: imageUrl.trim(),
            badgeText: badgeText.trim(),
            badgeColor: getBadgeClass(badgeColor),
            textPosition,
            overlayOpacity,
            isActive
          };
        }
        return b;
      });
      onUpdateBanners(updated);
      triggerNotify('success', `Hero banner config "${title}" saved successfully.`);
      clearForm();
    } else {
      // Add mode
      const newOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order)) + 1 : 1;
      const newBanner: HeroBanner = {
        id: `banner-${Date.now()}`,
        title: title.trim(),
        subtitle: subtitle.trim(),
        ctaText: ctaText.trim(),
        clickUrl: clickUrl.trim(),
        imageUrl: imageUrl.trim(),
        badgeText: badgeText.trim(),
        badgeColor: getBadgeClass(badgeColor),
        textPosition,
        overlayOpacity,
        isActive,
        order: newOrder
      };
      onUpdateBanners([...banners, newBanner]);
      triggerNotify('success', `Created & appended new slider banner: "${title}"`);
      clearForm();
    }
  };

  // Load Banner for Editing
  const handleLoadEdit = (banner: HeroBanner) => {
    setEditingId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setCtaText(banner.ctaText || 'Explore Offer');
    setClickUrl(banner.clickUrl);
    setImageUrl(banner.imageUrl);
    setBadgeText(banner.badgeText || '');
    setTextPosition(banner.textPosition || 'left');
    setOverlayOpacity(banner.overlayOpacity !== undefined ? banner.overlayOpacity : 40);
    setIsActive(banner.isActive);

    // Parse badge color mapping
    const lowerBadge = (banner.badgeColor || '').toLowerCase();
    if (lowerBadge.includes('amber')) setBadgeColor('amber');
    else if (lowerBadge.includes('emerald')) setBadgeColor('emerald');
    else if (lowerBadge.includes('rose')) setBadgeColor('rose');
    else if (lowerBadge.includes('blue')) setBadgeColor('blue');
    else if (lowerBadge.includes('purple')) setBadgeColor('purple');
    else setBadgeColor('indigo');

    triggerNotify('info', `Banner details loaded. Update configurations in the card workspace.`);
  };

  // Toggle Active Status
  const handleToggleActive = (id: string) => {
    const target = banners.find(b => b.id === id);
    if (!target) return;
    const nextState = !target.isActive;
    const updated = banners.map(b => b.id === id ? { ...b, isActive: nextState } : b);
    onUpdateBanners(updated);
    triggerNotify('info', `Banner state: "${target.title}" is now ${nextState ? 'Active' : 'Suspended'}.`);
  };

  // Delete Banner
  const handleDelete = (id: string) => {
    const target = banners.find(b => b.id === id);
    if (!target) return;
    if (window.confirm(`Are you sure you want to permanently delete slider banner: "${target.title}"?`)) {
      const updated = banners.filter(b => b.id !== id);
      onUpdateBanners(updated);
      triggerNotify('success', `Slider banner "${target.title}" has been removed from website.`);
      if (editingId === id) {
        clearForm();
      }
    }
  };

  // Move Order (Up / Down)
  const handleMoveOrder = (id: string, direction: 'up' | 'down') => {
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(b => b.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      // Swap with previous
      const temp = sorted[index].order;
      sorted[index].order = sorted[index - 1].order;
      sorted[index - 1].order = temp;
    } else if (direction === 'down' && index < sorted.length - 1) {
      // Swap with next
      const temp = sorted[index].order;
      sorted[index].order = sorted[index + 1].order;
      sorted[index + 1].order = temp;
    } else {
      return; // Boundary limit
    }

    onUpdateBanners(sorted);
    triggerNotify('info', 'Slider layout priority order adjusted.');
  };

  // Handle quick action: Load standard demo suite
  const handleResetDemoSuite = () => {
    if (window.confirm("Do you want to reset current banners and load the system's luxury gaming demo banners?")) {
      const standardBanners: HeroBanner[] = BANNER_PRESETS.map((preset, idx) => ({
        id: `b-demo-${idx + 1}`,
        title: preset.title,
        subtitle: preset.subtitle,
        ctaText: preset.ctaText,
        clickUrl: preset.clickUrl,
        imageUrl: preset.imageUrl,
        badgeText: preset.badgeText,
        badgeColor: getBadgeClass(
          preset.badgeText === 'MEGA OFFER' ? 'amber' :
          preset.badgeText === 'LIVE WAGERING' ? 'blue' :
          preset.badgeText === 'VIP CLUB' ? 'purple' : 'emerald'
        ),
        isActive: true,
        order: idx + 1,
        overlayOpacity: 45,
        textPosition: idx % 2 === 0 ? 'left' : 'center'
      }));
      onUpdateBanners(standardBanners);
      triggerNotify('success', 'Luxury gaming slider demo suite initialized.');
    }
  };

  return (
    <div id="hero-banner-management-page" className="space-y-6">
      
      {/* Page Title & Information Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-gradient-to-r from-obsidian-900 to-obsidian-950 border border-slate-800/80 rounded-2xl relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white tracking-tight">
              Casino Slider Hero Editor
            </h2>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-[#5C6BFF] border border-[#4E5DFD]/20 animate-pulse">
              Live Sync
            </span>
          </div>
          <p className="text-slate-400 text-xs font-sans max-w-2xl">
            Design, arrange, and manage high-conversion visual marketing slides featured at the top of the client portal. Supports instant image uploads, interactive slider previewing, and priority order mapping.
          </p>
        </div>

        <button
          id="btn-reset-demo-suite"
          onClick={handleResetDemoSuite}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-sans text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 transition-all shadow-md active:scale-[0.98]"
        >
          <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
          Load Demo Suite
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left column: Banner Form Workspace (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div id="banner-form-workspace" className="bg-obsidian-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            {/* Workspace Tab Header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-obsidian-950 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${editingId ? 'bg-amber-500/10 border border-amber-500/25 text-amber-400' : 'bg-[#4E5DFD]/10 border border-[#4E5DFD]/25 text-indigo-400'}`}>
                  {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    {editingId ? 'Modify Slide Settings' : 'Create Custom Banner'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-sans">
                    {editingId ? 'Editing existing registry configuration' : 'Publish new promotion slide instantly'}
                  </p>
                </div>
              </div>

              {editingId && (
                <button
                  id="btn-cancel-edit"
                  onClick={clearForm}
                  className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 hover:text-white border border-slate-800 rounded-md transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5.5 space-y-5.5 font-sans text-xs">
              
              {/* Presets Gallery Quick Access */}
              {!editingId && (
                <div className="space-y-2 bg-obsidian-950/60 p-3.5 border border-slate-850/50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Quick Template Injection Presets
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {BANNER_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        id={`btn-preset-${idx}`}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="p-1.5 text-left border border-slate-800/80 rounded-lg bg-obsidian-900/50 hover:bg-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between h-14 group outline-none"
                      >
                        <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white truncate block w-full">{preset.title.split(' - ')[0]}</span>
                        <span className="text-[8px] text-indigo-400 font-medium tracking-wide mt-auto">{preset.badgeText}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title Header & Badge Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Headline Banner Title */}
                <div className="md:col-span-8">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Banner Headline Title *
                  </label>
                  <input
                    id="input-banner-title"
                    type="text"
                    required
                    placeholder="e.g. MEGA CASHBACK SUNDAYS"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-obsidian-950 border border-slate-800 focus:border-[#4E5DFD] rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-colors font-semibold"
                  />
                </div>

                {/* Badge Text */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Badge Text / Label
                  </label>
                  <input
                    id="input-banner-badge"
                    type="text"
                    placeholder="e.g. HOT DEALS"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full bg-obsidian-950 border border-slate-800 focus:border-[#4E5DFD] rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Subtitle Message */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Promotional Description Subtitle
                </label>
                <textarea
                  id="textarea-banner-subtitle"
                  placeholder="Provide attractive action description, e.g. Claim 50% extra rollover cashback on roulette wagers..."
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-800 focus:border-[#4E5DFD] rounded-xl px-3 py-2 text-xs text-white outline-none transition-colors resize-none"
                />
              </div>

              {/* CTA Details & Target Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Button Action Text
                  </label>
                  <input
                    id="input-banner-cta"
                    type="text"
                    placeholder="e.g. Play Now"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-obsidian-950 border border-slate-800 focus:border-[#4E5DFD] rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Target Portal URL / Route
                  </label>
                  <input
                    id="input-banner-url"
                    type="text"
                    required
                    placeholder="e.g. #/promotions"
                    value={clickUrl}
                    onChange={(e) => setClickUrl(e.target.value)}
                    className="w-full bg-obsidian-950 border border-slate-800 focus:border-[#4E5DFD] rounded-xl px-3 py-2.5 text-xs text-[#5C6BFF] font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Cover Image Upload & Direct URL Container */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>Banner Cover Image Selection *</span>
                    <span className="text-[10px] text-slate-500 lowercase">Support Drag & Drop</span>
                  </label>

                  {/* Drag and Drop Simulator Area */}
                  <div
                    id="banner-dropzone"
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-[#4E5DFD] bg-[#4E5DFD]/5 scale-[0.99]' 
                        : 'border-slate-800 hover:border-slate-700 bg-obsidian-950/40 hover:bg-obsidian-950/80'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2.5 rounded-full bg-slate-800 text-indigo-400">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-white">Click or drag image file here to upload</p>
                      <p className="text-[10px] text-slate-500">Supports PNG, JPEG, WEBP. Transformed into direct local base64 memory asset.</p>
                    </div>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <Globe className="h-3.5 w-3.5" />
                    </span>
                    <input
                      id="input-banner-image-url"
                      type="text"
                      placeholder="Or paste external banner image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-obsidian-950 border border-slate-800 focus:border-[#4E5DFD] rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-300 outline-none transition-colors"
                    />
                  </div>
                  {imageUrl && imageUrl.startsWith('data:image') && (
                    <p className="text-[9px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                      <Check className="h-3 w-3 shrink-0" /> Loaded base64 memory buffer.
                    </p>
                  )}
                </div>
              </div>

              {/* Slider Display & Overlay Styling Config */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-obsidian-950/40 p-4 border border-slate-850/40 rounded-xl">
                
                {/* Badge color preset selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Badge Theme Color
                  </label>
                  <div className="flex gap-1.5">
                    {(['indigo', 'amber', 'emerald', 'rose', 'blue'] as const).map((color) => {
                      const mapping: Record<string, string> = {
                        indigo: 'bg-indigo-500',
                        amber: 'bg-amber-500',
                        emerald: 'bg-emerald-500',
                        rose: 'bg-rose-500',
                        blue: 'bg-blue-500'
                      };
                      return (
                        <button
                          key={color}
                          id={`btn-badge-color-${color}`}
                          type="button"
                          onClick={() => setBadgeColor(color)}
                          className={`h-5 w-5 rounded-full transition-all flex items-center justify-center outline-none ${mapping[color]} ${
                            badgeColor === color 
                              ? 'ring-2 ring-white ring-offset-2 ring-offset-obsidian-900 scale-110' 
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          {badgeColor === color && <Check className="h-3 w-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text positioning */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Text Placement Align
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-obsidian-950 border border-slate-800 p-1 rounded-lg">
                    {(['left', 'center', 'right'] as const).map((pos) => (
                      <button
                        key={pos}
                        id={`btn-align-${pos}`}
                        type="button"
                        onClick={() => setTextPosition(pos)}
                        className={`py-1 rounded text-[10px] font-extrabold capitalize transition-all outline-none ${
                          textPosition === pos
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Overlay opacity controller */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Dark Overlay Cover
                    </label>
                    <span className="text-[10px] font-mono text-indigo-400 font-extrabold">{overlayOpacity}%</span>
                  </div>
                  <input
                    id="input-banner-overlay"
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                    className="w-full accent-[#4E5DFD] bg-slate-950 h-1 rounded-full cursor-pointer outline-none"
                  />
                </div>

              </div>

              {/* Status active state toggle */}
              <div className="flex items-center justify-between bg-obsidian-950/30 p-3 rounded-lg border border-slate-850/30">
                <div className="flex gap-2">
                  <div className="h-4 w-4 text-slate-400">
                    <Info className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-300 text-[11px]">Set Slide Registry State</p>
                    <p className="text-[9px] text-slate-500">Uncheck to preserve slide config but suspend display on live portal slider</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    id="checkbox-banner-active"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-850 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500/20 peer-checked:after:bg-emerald-500 border border-slate-800 peer-checked:border-emerald-500/30" />
                </label>
              </div>

              {/* Action trigger button */}
              <button
                id="btn-banner-submit"
                type="submit"
                className="w-full py-3 rounded-xl font-bold tracking-wide text-xs text-white bg-gradient-to-r from-[#4E5DFD] to-[#1C1A42] hover:from-[#5C6BFF] hover:to-[#242152] border border-[#4E5DFD]/30 transition-all shadow-[0_4px_15px_rgba(78,93,253,0.15)] hover:shadow-[0_4px_20px_rgba(78,93,253,0.25)] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? 'Save & Commit Slide Configurations' : 'Approve & Publish Slide Live'}
              </button>

            </form>
          </div>
        </div>

        {/* Right column: Interactive Live Slider Preview & Registry list (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Interactive Live Slider Preview widget */}
          <div id="live-slider-preview-widget" className="bg-obsidian-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3.5 border-b border-slate-800 bg-obsidian-950 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  Responsive Slider Live Simulator
                </h3>
              </div>

              {/* Preview Device Selectors */}
              <div className="flex gap-1.5 bg-slate-900 border border-slate-850 p-0.5 rounded-lg">
                <button
                  id="btn-device-desktop"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded transition-all outline-none ${previewDevice === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Desktop Preview Frame"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  id="btn-device-mobile"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded transition-all outline-none ${previewDevice === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Mobile View Preview Frame"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 flex justify-center bg-obsidian-950/30">
              
              {/* Virtual Mockup Frame container */}
              <div 
                className={`transition-all duration-300 border border-slate-850 rounded-xl overflow-hidden bg-obsidian-950 relative shadow-2xl ${
                  previewDevice === 'desktop' ? 'w-full aspect-[16/7]' : 'w-[280px] aspect-[9/16]'
                }`}
              >
                {activeBanners.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <ImageIcon className="h-10 w-10 text-slate-700 mb-3 animate-pulse" />
                    <p className="text-xs font-bold text-slate-400">No Active Slider Banners Configured</p>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">Publish slides using the card configuration form to see live simulators.</p>
                  </div>
                ) : (
                  <>
                    {/* Active slide view */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeBanners[currentIndex]?.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 w-full h-full"
                      >
                        {/* Slide Cover Image */}
                        <img
                          src={activeBanners[currentIndex]?.imageUrl}
                          alt={activeBanners[currentIndex]?.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none"
                        />

                        {/* Slide Dark Overlay */}
                        <div 
                          className="absolute inset-0 bg-black transition-all"
                          style={{ opacity: (activeBanners[currentIndex]?.overlayOpacity ?? 40) / 100 }}
                        />

                        {/* Slide Text Content overlay */}
                        <div className={`absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col ${
                          previewDevice === 'mobile' ? 'justify-end pb-8 text-center' : 'justify-center'
                        } ${
                          activeBanners[currentIndex]?.textPosition === 'center' ? 'items-center text-center' :
                          activeBanners[currentIndex]?.textPosition === 'right' ? 'items-end text-right' : 'items-start text-left'
                        }`}>
                          <div className={`space-y-2 max-w-lg ${previewDevice === 'mobile' ? 'max-w-xs' : ''}`}>
                            
                            {/* Promo Badge text */}
                            {activeBanners[currentIndex]?.badgeText && (
                              <span className={`inline-block text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                activeBanners[currentIndex]?.badgeColor || 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
                              }`}>
                                {activeBanners[currentIndex]?.badgeText}
                              </span>
                            )}

                            {/* Headline */}
                            <h4 className={`font-black font-display text-white tracking-tight leading-tight ${
                              previewDevice === 'mobile' ? 'text-sm' : 'text-base sm:text-lg md:text-xl'
                            }`}>
                              {activeBanners[currentIndex]?.title}
                            </h4>

                            {/* Description (hide on extremely small layouts/mobile preview if needed) */}
                            {activeBanners[currentIndex]?.subtitle && (
                              <p className={`text-slate-300 font-sans leading-normal line-clamp-2 ${
                                previewDevice === 'mobile' ? 'text-[9px]' : 'text-[10px] sm:text-xs'
                              }`}>
                                {activeBanners[currentIndex]?.subtitle}
                              </p>
                            )}

                            {/* CTA Action button */}
                            <div className="pt-1.5">
                              <span className="inline-block bg-white text-slate-900 rounded-full font-bold uppercase transition-all shadow-md text-[9px] sm:text-[10px] px-3 py-1 hover:scale-105 active:scale-95 cursor-pointer">
                                {activeBanners[currentIndex]?.ctaText || 'Claim Offer'}
                              </span>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Left & Right arrow controls */}
                    {activeBanners.length > 1 && (
                      <>
                        <button
                          id="btn-slider-prev"
                          onClick={() => setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          id="btn-slider-next"
                          onClick={() => setCurrentIndex(prev => (prev + 1) % activeBanners.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {activeBanners.map((_, idx) => (
                        <button
                          key={idx}
                          id={`btn-slider-dot-${idx}`}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${currentIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`}
                        />
                      ))}
                    </div>

                    {/* Auto-play indicator controller */}
                    <button
                      id="btn-slider-autoplay"
                      onClick={() => setIsAutoPlaying(p => !p)}
                      className="absolute top-3 right-3 p-1.5 rounded-md bg-black/55 hover:bg-black/80 text-white border border-white/10 text-[9px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {isAutoPlaying ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
                      {isAutoPlaying ? 'Auto Playing' : 'Paused'}
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* Active slide banner registry List */}
          <div id="banner-registry-panel" className="bg-obsidian-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-slate-800 bg-obsidian-950 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Banner Priority Sequence
                </h3>
                <p className="text-[10px] text-slate-500 font-sans">
                  Current published sliders ({banners.length})
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                {activeBanners.length} Active / {banners.length - activeBanners.length} Hidden
              </span>
            </div>

            <div className="divide-y divide-slate-850 max-h-[380px] overflow-y-auto">
              {banners.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No banners registered.</p>
                  <p className="text-[10px] text-slate-600 mt-1">Configure & add one above to initiate portal sliders.</p>
                </div>
              ) : (
                [...banners].sort((a, b) => a.order - b.order).map((banner, index, arr) => (
                  <div 
                    key={banner.id} 
                    id={`banner-row-${banner.id}`}
                    className={`p-3.5 flex items-center gap-3 transition-colors ${
                      editingId === banner.id 
                        ? 'bg-amber-500/5 border-l-2 border-amber-500' 
                        : banner.isActive 
                          ? 'hover:bg-slate-800/20' 
                          : 'bg-obsidian-950/25 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Index Badge */}
                    <span className="text-[11px] font-black font-mono text-slate-600 w-4 text-center shrink-0">
                      {index + 1}
                    </span>

                    {/* Image preview Thumbnail */}
                    <div className="h-10 w-16 rounded-md overflow-hidden bg-slate-950 border border-slate-800 shrink-0 relative">
                      <img
                        src={banner.imageUrl}
                        alt="thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {!banner.isActive && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[0.5px] flex items-center justify-center">
                          <EyeOff className="h-3 w-3 text-rose-500" />
                        </div>
                      )}
                    </div>

                    {/* Banner Headline Details */}
                    <div className="flex-1 min-w-0 font-sans text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-200 truncate block max-w-[130px]">{banner.title}</span>
                        {banner.badgeText && (
                          <span className="px-1 py-0.2 text-[8px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 font-bold uppercase rounded scale-[0.95]">
                            {banner.badgeText}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[170px]">
                        Target: {banner.clickUrl}
                      </p>
                    </div>

                    {/* Controls Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      
                      {/* Priority Shifting buttons */}
                      <button
                        id={`btn-move-up-${banner.id}`}
                        disabled={index === 0}
                        onClick={() => handleMoveOrder(banner.id, 'up')}
                        className={`p-1 rounded bg-slate-950/45 border border-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-20 disabled:pointer-events-none`}
                        title="Move Priority Up"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        id={`btn-move-down-${banner.id}`}
                        disabled={index === arr.length - 1}
                        onClick={() => handleMoveOrder(banner.id, 'down')}
                        className={`p-1 rounded bg-slate-950/45 border border-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-20 disabled:pointer-events-none`}
                        title="Move Priority Down"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>

                      {/* Toggle status visibility */}
                      <button
                        id={`btn-toggle-active-${banner.id}`}
                        onClick={() => handleToggleActive(banner.id)}
                        className={`p-1 rounded border transition-colors cursor-pointer ${
                          banner.isActive 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-slate-950/45 border-slate-800/80 text-slate-500 hover:text-slate-300'
                        }`}
                        title={banner.isActive ? 'Suspend (Hide Live)' : 'Approve (Publish Live)'}
                      >
                        {banner.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>

                      {/* Edit click */}
                      <button
                        id={`btn-edit-${banner.id}`}
                        onClick={() => handleLoadEdit(banner)}
                        className={`p-1 rounded bg-slate-950/45 border border-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer ${
                          editingId === banner.id ? 'ring-1 ring-amber-500 text-amber-400' : ''
                        }`}
                        title="Edit configurations"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete Action */}
                      <button
                        id={`btn-delete-${banner.id}`}
                        onClick={() => handleDelete(banner.id)}
                        className="p-1 rounded bg-slate-950/45 border border-slate-800/80 text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Permanently remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
