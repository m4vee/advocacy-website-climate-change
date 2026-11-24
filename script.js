/**
 * ==========================================================================
 * TINDIG: Rise Together for Climate Action in the Philippines
 * Shared Client-Side JavaScript (script.js) - Enhanced Motion & Interaction
 * 
 * Features:
 * 1. Theme Management (Light/Dark mode with localStorage)
 * 2. Sticky Header with Scroll Threshold
 * 3. Mobile Navigation Drawer & ARIA Accessibility
 * 4. Reading Progress Bar (Scroll Down / Up Depth)
 * 5. Directional Scroll Detection & Dynamic Scroll Animation (Every Scroll Down & Up)
 * 6. Living Timeline Real-Time Progress Tracker (story.html)
 * 7. Climate Before/After Comparison Switcher (story.html)
 * 8. Parallax Scroll & Floating Elements
 * 9. Animated Number Counters (stats strip)
 * 10. Category Filter & Accessible Lightbox Viewer (gallery.html)
 * 11. "My Climate Pledge" LocalStorage Checklist & Circular SVG Ring (take-action.html)
 * 12. Dynamic Carbon & Bayanihan Action Calculator (take-action.html)
 * 13. Community Voice Story Submission & Live Preview (take-action.html)
 * 14. Accessible Climate FAQ Accordions & Emergency Directory (contact.html)
 * 15. Accessible Contact Form Validation & State Handlers (contact.html)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStickyHeader();
  initMobileNav();
  initScrollProgressBar();
  initScrollDirectionAndReveal();
  initParallax();
  initCounters();
  initLivingTimeline();
  initCompareSwitcher();
  initGallery();
  initPledgeTracker();
  initActionCalculator();
  initStorySubmission();
  initFaqAccordion();
  initContactForm();
  highlightActiveNav();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('tindig_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const next = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('tindig_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (theme === 'dark') {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />`;
  } else {
    icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />`;
  }
}

/* --------------------------------------------------------------------------
   2. Sticky Header with Scroll Threshold
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer & ARIA Accessibility
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  const toggle = (force) => {
    const isOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  };

  toggleBtn.addEventListener('click', () => toggle());

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggle(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggle(false);
      toggleBtn.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Reading Progress Bar (Top of Viewport)
   -------------------------------------------------------------------------- */
function initScrollProgressBar() {
  let bar = document.getElementById('scrollProgressBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scrollProgressBar';
    bar.className = 'scroll-progress-bar';
    document.body.prepend(bar);
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
   5. Dynamic Bidirectional Scroll Detection & Element Reveal
   -------------------------------------------------------------------------- */
let lastScrollY = window.scrollY;

function initScrollDirectionAndReveal() {
  const revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const floatingAccents = document.querySelectorAll('.floating-accent-element');

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Direction tracking
    if (currentScrollY > lastScrollY && currentScrollY > 60) {
      document.body.classList.add('scroll-down');
      document.body.classList.remove('scroll-up');
    } else if (currentScrollY < lastScrollY) {
      document.body.classList.add('scroll-up');
      document.body.classList.remove('scroll-down');
    }
    lastScrollY = currentScrollY;

    // Floating accents parallax drift
    floatingAccents.forEach((item, index) => {
      const speed = (index % 2 === 0 ? 0.08 : -0.06);
      item.style.transform = `translateY(${currentScrollY * speed}px)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // IntersectionObserver for Bidirectional Entry
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          // If scrolled significantly past, reset so it re-animates smoothly on scroll up/down
          const rect = entry.target.getBoundingClientRect();
          if (rect.top > window.innerHeight + 120 || rect.bottom < -120) {
            entry.target.classList.remove('revealed');
          }
        }
      });
    }, {
      rootMargin: '40px 0px -40px 0px',
      threshold: [0.08, 0.2]
    });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('revealed'));
  }
}

/* --------------------------------------------------------------------------
   6. Living Timeline Real-Time Progress Tracker (story.html)
   -------------------------------------------------------------------------- */
function initLivingTimeline() {
  const timelineContainer = document.querySelector('.timeline-container');
  if (!timelineContainer) return;

  let trackFill = document.querySelector('.timeline-track-fill');
  if (!trackFill) {
    trackFill = document.createElement('div');
    trackFill.className = 'timeline-track-fill';
    timelineContainer.prepend(trackFill);
  }

  const nodes = document.querySelectorAll('.timeline-node');
  const items = document.querySelectorAll('.timeline-item');

  const updateTimelineProgress = () => {
    const rect = timelineContainer.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    // Calculate how far the timeline has traveled past the middle of the screen
    const startOffset = windowH * 0.55;
    const totalHeight = rect.height;
    const progress = Math.min(Math.max(0, startOffset - rect.top), totalHeight);
    const percent = totalHeight > 0 ? (progress / totalHeight) * 100 : 0;

    trackFill.style.height = `${percent}%`;

    // Highlight active nodes as the timeline line crosses them
    items.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const node = item.querySelector('.timeline-node');
      if (!node) return;

      if (itemRect.top < windowH * 0.58) {
        node.classList.add('active-node');
      } else {
        node.classList.remove('active-node');
      }
    });
  };

  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  updateTimelineProgress();
}

/* --------------------------------------------------------------------------
   7. Climate Before/After Comparison Switcher (story.html)
   -------------------------------------------------------------------------- */
function initCompareSwitcher() {
  const switchBtns = document.querySelectorAll('.compare-toggle-btn');
  const views = document.querySelectorAll('.compare-view');

  if (!switchBtns.length) return;

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-view');
      views.forEach(v => {
        if (v.getAttribute('data-view-id') === target) {
          v.style.display = 'block';
        } else {
          v.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Parallax Scroll Effect on Hero Image
   -------------------------------------------------------------------------- */
function initParallax() {
  const heroImg = document.querySelector('.hero-background-img');
  if (!heroImg) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${scrollY * 0.22}px)`;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   9. Number Counter Animation for Stats
   -------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const duration = 1600;
    const start = 0;
    const isDecimal = target % 1 !== 0;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * ease;

      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* --------------------------------------------------------------------------
   10. Gallery Filter & Accessible Lightbox Viewer (gallery.html)
   -------------------------------------------------------------------------- */
let activeGalleryItems = [];
let currentLightboxIndex = 0;

function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');

  if (!items.length) return;
  activeGalleryItems = Array.from(items);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      activeGalleryItems = [];

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.classList.add('revealed');
          activeGalleryItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const index = activeGalleryItems.indexOf(item);
      if (index !== -1) openLightbox(index);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  if (!lightbox) return;

  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => stepLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => stepLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox || !activeGalleryItems[index]) return;

  currentLightboxIndex = index;
  renderLightboxContent();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('lightboxClose');
  if (closeBtn) closeBtn.focus();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function stepLightbox(direction) {
  if (!activeGalleryItems.length) return;
  currentLightboxIndex = (currentLightboxIndex + direction + activeGalleryItems.length) % activeGalleryItems.length;
  renderLightboxContent();
}

function renderLightboxContent() {
  const target = activeGalleryItems[currentLightboxIndex];
  if (!target) return;

  const img = target.querySelector('.gallery-img');
  const title = target.querySelector('.gallery-item-title');
  const desc = target.getAttribute('data-story') || '';
  const category = target.getAttribute('data-category') || '';

  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalCategory = document.getElementById('lightboxCategory');
  const modalCaption = document.getElementById('lightboxCaption');

  if (modalImg && img) { modalImg.src = img.src; modalImg.alt = img.alt; }
  if (modalTitle && title) modalTitle.textContent = title.textContent;
  if (modalCategory) modalCategory.textContent = category.toUpperCase();
  if (modalCaption) modalCaption.textContent = desc;
}

/* --------------------------------------------------------------------------
   11. "My Climate Pledge" LocalStorage Checklist & Circular Ring
   -------------------------------------------------------------------------- */
function initPledgeTracker() {
  const checkboxes = document.querySelectorAll('.pledge-checkbox');
  const progressText = document.getElementById('pledgePercentText');
  const progressCircle = document.getElementById('pledgeCircle');
  const celebrationBox = document.getElementById('pledgeCelebration');

  if (!checkboxes.length) return;

  const STORAGE_KEY = 'tindig_climate_pledges';
  const SUPABASE_URL = 'https://vrwjiazqhpiziupuiquo.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_omTrlXF1zdoNQAwA6mtkUA_eqPz_jwS';

  let saved = [];
  let supabaseClient = null;
  let currentUserId = null;
  let changedBeforeCloudLoad = false;
  let saveQueue = Promise.resolve();

  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) saved = [];
  } catch (e) {
    saved = [];
  }

  const getCheckedIndices = () => {
    const indices = [];
    checkboxes.forEach((cb, index) => {
      if (cb.checked) indices.push(index);
    });
    return indices;
  };

  const applyCheckedIndices = (indices) => {
    const valid = Array.isArray(indices)
      ? indices.filter(index => Number.isInteger(index) && index >= 0 && index < checkboxes.length)
      : [];

    checkboxes.forEach((cb, index) => {
      cb.checked = valid.includes(index);
      cb.closest('.pledge-item')?.classList.toggle('checked', cb.checked);
    });
    recalculate(valid);
  };

  const recalculate = (checkedIndices = getCheckedIndices()) => {
    const total = checkboxes.length;
    const completed = checkedIndices.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    if (progressText) progressText.textContent = `${percent}%`;

    if (progressCircle) {
      const circumference = 283;
      progressCircle.style.strokeDashoffset = circumference - (circumference * percent) / 100;
    }

    if (celebrationBox) {
      celebrationBox.style.display = percent === 100 ? 'block' : 'none';
    }
  };

  const saveLocal = (indices) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(indices));
    } catch (error) {
      console.warn('Unable to save pledge progress locally:', error);
    }
  };

  const saveCloud = (indices) => {
    if (!supabaseClient || !currentUserId) return;

    const percent = checkboxes.length
      ? Math.round((indices.length / checkboxes.length) * 100)
      : 0;

    // Serialize writes so rapid checkbox changes do not arrive out of order.
    saveQueue = saveQueue
      .then(() => supabaseClient
        .from('youth_pledges')
        .upsert({
          user_id: currentUserId,
          commitments: indices,
          percent,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }))
      .then(({ error }) => {
        if (error) throw error;
      })
      .catch(error => {
        console.error('Could not sync pledge to Supabase:', error);
      });
  };

  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      cb.closest('.pledge-item')?.classList.toggle('checked', cb.checked);
      const indices = getCheckedIndices();
      changedBeforeCloudLoad = true;
      saveLocal(indices);
      recalculate(indices);
      saveCloud(indices);
    });
  });

  // Restore this browser's last state immediately while cloud data loads.
  applyCheckedIndices(saved);

  // Create/reuse a Supabase client and an anonymous session (no login form).
  const connectAndRestore = async () => {
    if (!window.supabase || !window.supabase.createClient) {
      console.warn('Supabase library did not load; pledge progress is stored locally only.');
      return;
    }

    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

      let { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) throw sessionError;

      if (!sessionData.session) {
        const result = await supabaseClient.auth.signInAnonymously();
        if (result.error) throw result.error;
        sessionData = { session: result.data.session };
      }

      currentUserId = sessionData.session?.user?.id;
      if (!currentUserId) throw new Error('No anonymous user session was created.');

      const { data, error } = await supabaseClient
        .from('youth_pledges')
        .select('commitments')
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (error) throw error;

      if (changedBeforeCloudLoad) {
        saveCloud(getCheckedIndices());
      } else if (data && Array.isArray(data.commitments)) {
        applyCheckedIndices(data.commitments);
        saveLocal(data.commitments);
      } else if (saved.length) {
        saveCloud(saved);
      }
    } catch (error) {
      console.error('Supabase pledge connection failed:', error);
      // The checklist remains usable with localStorage if cloud setup is incomplete.
    }
  };

  connectAndRestore();
}
/* --------------------------------------------------------------------------
   12. Dynamic Action Impact Calculator (take-action.html)
   -------------------------------------------------------------------------- */
function initActionCalculator() {
  const daysSlider = document.getElementById('calcTransitDays');
  const tumblerSlider = document.getElementById('calcPlasticAvoided');
  const treesSlider = document.getElementById('calcTreePropagules');

  const co2Output = document.getElementById('calcCo2Total');
  const plasticOutput = document.getElementById('calcPlasticTotal');
  const mangroveOutput = document.getElementById('calcMangroveTotal');

  if (!daysSlider || !co2Output) return;

  const recalculate = () => {
    const transitDays = parseInt(daysSlider.value, 10) || 0;
    const bottles = parseInt(tumblerSlider.value, 10) || 0;
    const mangroves = parseInt(treesSlider.value, 10) || 0;

    // Approximations: ~3.2 kg CO2 saved per commute day switched to public rail/jeepney; 0.08 kg per bottle avoided
    const co2Saved = (transitDays * 3.2 * 4.3).toFixed(1); // monthly kg CO2
    const totalPlastic = bottles * 30; // monthly bottles avoided
    const stormDissipation = (mangroves * 1.5).toFixed(1); // wave energy damping factor %

    co2Output.textContent = `${co2Saved} kg`;
    plasticOutput.textContent = `${totalPlastic} units`;
    mangroveOutput.textContent = `+${stormDissipation}%`;

    // Update slider label numbers
    const dVal = document.getElementById('calcTransitVal');
    const bVal = document.getElementById('calcPlasticVal');
    const mVal = document.getElementById('calcMangroveVal');

    if (dVal) dVal.textContent = `${transitDays} days/week`;
    if (bVal) bVal.textContent = `${bottles} bottles/day`;
    if (mVal) mVal.textContent = `${mangroves} seedlings/year`;
  };

  [daysSlider, tumblerSlider, treesSlider].forEach(slider => {
    if (slider) {
      slider.addEventListener('input', recalculate);
    }
  });

  recalculate();
}

/* --------------------------------------------------------------------------
   13. Community Voice Story Submission & Live Preview
   -------------------------------------------------------------------------- */
function initStorySubmission() {
  const form = document.getElementById('storySubmissionForm');
  const feed = document.getElementById('communityStoriesFeed');
  const feedback = document.getElementById('storyFeedback');

  if (!form || !feed) return;

  const SUPABASE_URL = 'https://vrwjiazqhpiziupuiquo.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_omTrlXF1zdoNQAwA6mtkUA_eqPz_jwS';

  let client = null;
  let realtimeChannel = null;

  const setFeedback = (message, type = 'success') => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
  };

  const renderStory = (record, prepend = true) => {
    if (!record || !record.id || feed.querySelector(`[data-supabase-story="${record.id}"]`)) return;

    const card = document.createElement('div');
    card.className = 'quote-bubble reveal revealed';
    card.setAttribute('data-supabase-story', record.id);

    const storyText = document.createTextNode(`“${record.story || ''}”`);
    const author = document.createElement('span');
    author.className = 'quote-author';
    author.textContent = `— ${record.name || 'Community Member'}, ${record.location || 'Philippines'}`;

    card.appendChild(storyText);
    card.appendChild(author);

    if (prepend) {
      feed.prepend(card);
    } else {
      feed.appendChild(card);
    }
  };

  const loadStories = async () => {
    if (!client) return;

    const { data, error } = await client
      .from('community_stories')
      .select('id, name, location, story, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Keep the page's original sample stories; cloud submissions are added above them.
    (data || []).slice().reverse().forEach(record => renderStory(record, true));
  };

  const connectStories = async () => {
    if (!window.supabase || !window.supabase.createClient) {
      console.warn('Supabase library did not load; community stories cannot be shared online.');
      return;
    }

    try {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
      await loadStories();

      realtimeChannel = client
        .channel('tindig-community-stories')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'community_stories' },
          payload => renderStory(payload.new, true)
        )
        .subscribe();
    } catch (error) {
      console.error('Could not load community stories from Supabase:', error);
      setFeedback('Community stories could not be loaded. Please check the database setup and try again.', 'error');
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('storyAuthorName');
    const locationInput = document.getElementById('storyAuthorLocation');
    const textInput = document.getElementById('storyContent');

    const name = nameInput?.value.trim() || '';
    const location = locationInput?.value.trim() || '';
    const story = textInput?.value.trim() || '';

    if (!name || !location || !story) {
      setFeedback('Please complete all fields before publishing.', 'error');
      return;
    }

    if (story.length > 3000 || name.length > 80 || location.length > 120) {
      setFeedback('Please shorten your entry. Name: 80 characters, location: 120, story: 3,000.', 'error');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Publishing...';
    }

    try {
      if (!client) {
        throw new Error('The shared database is not connected. Please try again in a moment.');
      }

      const { data, error } = await client
        .from('community_stories')
        .insert({ name, location, story })
        .select('id, name, location, story, created_at')
        .single();

      if (error) throw error;

      renderStory(data, true);
      form.reset();
      setFeedback('Maraming salamat! Your story has been published for the community.', 'success');
    } catch (error) {
      console.error('Story submission failed:', error);
      setFeedback(error.message || 'Sorry, your story could not be published. Please try again.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Publish to Community Voice Board';
      }
    }
  });

  connectStories();
}
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

/* --------------------------------------------------------------------------
   14. Accessible Climate FAQ Accordion (contact.html)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const headers = document.querySelectorAll('.faq-header');
  if (!headers.length) return;

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close other open accordions
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      item.classList.toggle('open', !isOpen);
    });
  });
}

/* --------------------------------------------------------------------------
   15. Accessible Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('contactFeedback');
  if (!form) return;

  const SUPABASE_URL = 'https://vrwjiazqhpiziupuiquo.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_omTrlXF1zdoNQAwA6mtkUA_eqPz_jwS';
  const client = window.supabase?.createClient
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const inquiryType = document.getElementById('contactInquiryType')?.value || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';

    if (!client) {
      if (feedback) {
        feedback.textContent = 'Unable to connect to the message service. Please try again later.';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
      }
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    if (feedback) {
      feedback.textContent = 'Sending your message...';
      feedback.className = 'form-feedback';
      feedback.style.display = 'block';
    }

    try {
      const { error } = await client
        .from('contact_messages')
        .insert([{ name, email, inquiry_type: inquiryType, message }]);

      if (error) throw error;

      if (feedback) {
        feedback.textContent = `Mabuhay ${name}! Your message has been received by the TINDIG team.`;
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
      }
      form.reset();
    } catch (error) {
      console.error('TINDIG contact form submission failed:', error);
      if (feedback) {
        feedback.textContent = 'Your message could not be sent. Please try again.';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

/* Highlight Active Navigation Link */
function highlightActiveNav() {
  const pathname = window.location.pathname;
  const page = pathname.split('/').pop() || 'index.html';

  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === './')) {
      link.classList.add('active');
    }
  });
}
