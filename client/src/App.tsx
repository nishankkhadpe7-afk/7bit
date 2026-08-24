import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ChevronDown, Clapperboard, Frame, Menu, Palette, Play, Plus, Sparkles, X } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { fallbackProjects, fallbackServices, fallbackSettings } from './data';
import { useReducedMotion, useScroll } from './hooks';
import { getFeaturedProjects, getServices, getSettings, submitContact } from './services/api';
import type { Project, Service, Settings } from './types';
import aboutVideo from '../../assets/video1.mp4';

const icons = { Frame, Sparkles, Clapperboard, Palette };
const nav = ['Home', 'Services', 'Work', 'About', 'Contact'];
const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
function Media({ src, type, alt, className = '' }: { src: string; type: Project['mediaType']; alt: string; className?: string }) { if (type === 'video') return <video className={className} src={src} muted autoPlay loop playsInline preload="metadata" aria-label={alt} />; return <img className={className} src={src} alt={alt} loading="lazy" />; }
function Navbar() { const [open, setOpen] = useState(false); const scrolled = useScroll(); return <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}><a href="#home" className="brand-logo" aria-label="7bit Media home"><img src="/7bit-media-logo.png" alt="7bit Media"/></a><nav>{nav.map(n => <a key={n} href={`#${n.toLowerCase()}`}>{n}</a>)}</nav><a className="button button--small nav-cta" href="#contact">Let’s Talk <ArrowUpRight size={15}/></a><button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X/> : <Menu/>}</button><AnimatePresence>{open && <motion.div className="mobile-nav" initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }} exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}>{nav.map((n, i) => <motion.a initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} transition={{delay:i*.06}} onClick={() => setOpen(false)} key={n} href={`#${n.toLowerCase()}`}>{n}</motion.a>)}</motion.div>}</AnimatePresence></header> }
function SectionTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) { return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div> }
function Stat({ value, suffix, label }: Settings['statistics'][number]) { const ref = useRef<HTMLDivElement>(null); const inView = useInView(ref, { once: true }); const [count, setCount] = useState(0); useEffect(() => { if (!inView) return; let start = performance.now(); const timer = requestAnimationFrame(function step(now) { const t = Math.min((now - start) / 900, 1); setCount(Math.floor(value * (1 - Math.pow(1-t, 3)))); if (t < 1) requestAnimationFrame(step); }); return () => cancelAnimationFrame(timer); }, [inView, value]); return <div ref={ref} className="stat"><b>{count}{suffix}</b><span>{label}</span></div> }
const getApiBase = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const resolveVideoUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = getApiBase();
  if (path.startsWith('/api/')) {
    return `${base}${path.substring(4)}`;
  }
  return `${base}${path}`;
};

function ProjectModal({ project, close }: { project: Project; close: () => void }) {
  useEffect(() => {
    const escape = (e: KeyboardEvent) => e.key === 'Escape' && close();
    addEventListener('keydown', escape);
    document.body.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', escape);
      document.body.style.overflow = '';
    };
  }, [close]);

  const embed = project.mediaType === 'youtube' ? `https://www.youtube.com/embed/${project.mediaUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1]}` : project.mediaType === 'vimeo' ? `https://player.vimeo.com/video/${project.mediaUrl.split('/').pop()}` : '';

  return (
    <motion.div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={project.title} onMouseDown={e => e.currentTarget === e.target && close()} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <motion.article className="modal" initial={{opacity:0,scale:.97,y:18}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.97}}>
        <button className="close" onClick={close} aria-label="Close project"><X/></button>
        <div className="modal-media">
          {embed ? (
            <iframe src={embed} title={project.title} allow="autoplay; fullscreen" allowFullScreen />
          ) : (
            <video src={resolveVideoUrl(project.videoUrl || project.mediaUrl)} controls autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          )}
        </div>
        <div className="modal-copy">
          <span className="eyebrow">{project.category}</span>
          <h2>{project.title || project.name}</h2>
          <p>{project.description}</p>
          {project.externalUrl && <a className="text-link" href={project.externalUrl} target="_blank" rel="noreferrer">View project <ArrowUpRight size={16}/></a>}
        </div>
      </motion.article>
    </motion.div>
  );
}

function ReelVideo({ project, isActive, shouldPreload, onClick, onMetadataLoaded }: { project: Project; isActive: boolean; shouldPreload: boolean; onClick: () => void; onMetadataLoaded?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [aspect, setAspect] = useState<'landscape' | 'portrait'>('landscape');
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.preload = 'auto';
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`Autoplay or playback interrupted for project ${project.slug}:`, err);
        });
      }
    } else {
      video.pause();
      video.currentTime = 0;
      if (shouldPreload) {
        if (!hasLoadedRef.current) {
          video.preload = 'auto';
          video.load();
          hasLoadedRef.current = true;
        }
      } else {
        if (hasLoadedRef.current) {
          video.preload = 'metadata';
          video.load(); // clears buffer and releases memory/resources
          hasLoadedRef.current = false;
        }
      }
    }
  }, [isActive, shouldPreload, project.slug]);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const isPortrait = video.videoHeight > video.videoWidth;
    setAspect(isPortrait ? 'portrait' : 'landscape');
    if (onMetadataLoaded) {
      onMetadataLoaded();
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error(`Failed to load video for project ${project.slug}:`, e.nativeEvent);
  };

  return (
    <div
      className={`reel-item ${isActive ? 'reel-item--active' : ''} reel-item--${aspect}`}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={resolveVideoUrl(project.videoUrl || project.mediaUrl)}
        poster={project.thumbnail}
        muted
        playsInline
        loop
        preload={shouldPreload || isActive ? 'auto' : 'metadata'}
        onLoadedMetadata={handleMetadata}
        onError={handleError}
      />
      <div className="reel-item-shade" />
      <div className="reel-item-meta">
        <span className="eyebrow">{project.category}</span>
        <h3>{project.title || project.name}</h3>
      </div>
      <span className="play">
        <Play size={16} fill="currentColor" />
      </span>
    </div>
  );
}

function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="about-video-container">
      <video
        ref={videoRef}
        src={aboutVideo}
        muted
        playsInline
        loop
        preload="metadata"
        className="about-video-el"
      />
    </div>
  );
}

function Contact() { const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle'); const [errorMessage, setErrorMessage] = useState(''); const [projectType, setProjectType] = useState('Brand film'); const [dropdownOpen, setDropdownOpen] = useState(false); const options = ['Brand film', 'Social content', 'Corporate video', 'Other']; const send = async (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const form = e.currentTarget; setStatus('loading'); setErrorMessage(''); const formData = new FormData(form); const payload = Object.fromEntries(formData); payload.projectType = projectType; try { await submitContact(payload as never); setStatus('success'); form.reset(); } catch (err: any) { setErrorMessage(err.message || 'Couldn’t submit right now.'); setStatus('error'); } }; return <section id="contact" className="contact"><div><span className="eyebrow">START A CONVERSATION</span><h2>Have a project<br/>in mind?</h2><p>Let’s create something amazing together.</p></div><form onSubmit={send}><label>Name<input required name="name" placeholder="Your name"/></label><label>Email<input required name="email" type="email" placeholder="you@company.com"/></label><label>Company / Brand<input name="company" placeholder="Optional"/></label><label className="custom-select-wrapper">Project Type<div className="custom-select-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}><span>{projectType}</span><ChevronDown className={`select-chevron ${dropdownOpen ? 'open' : ''}`} size={16}/></div>{dropdownOpen && <div className="custom-select-options">{options.map(opt => <div key={opt} className={`custom-option ${opt === projectType ? 'selected' : ''}`} onClick={() => { setProjectType(opt); setDropdownOpen(false); }}>{opt}</div>)}</div>}</label><label className="full">Tell us about it<textarea required name="message" rows={3} placeholder="Scope, goals, timeline…"/></label><button className="button full" disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : 'Get In Touch'} <ArrowDownRight size={16}/></button>{status === 'success' && <p className="form-message good">Thanks — your inquiry has been received.</p>}{status === 'error' && <p className="form-message">{errorMessage || 'Couldn’t submit right now. Please try again shortly.'}</p>}</form></section> }
import { CinematicIntro } from './CinematicIntro';
import { WorkInProgress } from './WorkInProgress';

export default function App() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [services, setServices] = useState(fallbackServices);
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState<Project | null>(null);
  const [wipPlatform, setWipPlatform] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<1 | -1>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [trackOffset, setTrackOffset] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/assets/video2.mp4';

    const handleCanPlay = () => {
      setHeroVideoUrl('/assets/video2.mp4');
    };
    const handleError = () => {
      setHeroVideoUrl(null);
    };

    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startX = useRef(0);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => undefined);
    getServices().then(setServices).catch(() => undefined);
    getFeaturedProjects().then((projs) => {
      setProjects(projs);
      setActiveIndex(0); // Start at first element (index 0)
    }).catch(() => {
      setProjects(fallbackProjects);
      setActiveIndex(0);
    });
  }, []);

  useEffect(() => {
    document.title = settings.seo.title;
  }, [settings]);

  // Center active item in scroll track using mathematical layout translation offsets
  const calculateOffset = useCallback(() => {
    const track = trackRef.current;
    if (!track || projects.length === 0) return;
    const activeEl = track.children[activeIndex] as HTMLElement;
    if (!activeEl) return;

    const viewportWidth = track.parentElement?.clientWidth || window.innerWidth;
    const activeWidth = activeEl.clientWidth;
    const activeOffset = activeEl.offsetLeft;

    const targetOffset = (viewportWidth / 2) - (activeOffset + activeWidth / 2);
    setTrackOffset(targetOffset);
  }, [activeIndex, projects]);

  useEffect(() => {
    calculateOffset();
  }, [calculateOffset]);

  // Handle window resizing or device rotation
  useEffect(() => {
    addEventListener('resize', calculateOffset);
    addEventListener('orientationchange', calculateOffset);
    return () => {
      removeEventListener('resize', calculateOffset);
      removeEventListener('orientationchange', calculateOffset);
    };
  }, [calculateOffset]);

  // Seamless wrapping reset (no longer needed for ping-pong, keep empty to preserve signature)
  const handleTransitionEnd = () => {};

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const triggerNext = () => {
    if (projects.length <= 1) return;
    const n = projects.length;
    let nextIndex = activeIndex + carouselDirection;
    let newDirection = carouselDirection;

    if (nextIndex >= n) {
      newDirection = -1;
      nextIndex = n - 2 >= 0 ? n - 2 : 0;
    } else if (nextIndex < 0) {
      newDirection = 1;
      nextIndex = 1 < n ? 1 : 0;
    }

    setCarouselDirection(newDirection);
    setIsTransitioning(true);
    setActiveIndex(nextIndex);
  };

  // Auto rotation timer
  useEffect(() => {
    if (active || isDragging || projects.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      triggerNext();
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, projects, active, isDragging, carouselDirection]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (projects.length === 0) return;
    setIsDragging(true);
    setIsTransitioning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    startX.current = pageX;
    dragOffsetRef.current = trackOffset;
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const dx = pageX - startX.current;
    setDragOffset(dx);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const finalOffset = dragOffsetRef.current + dragOffset;
    setDragOffset(0);

    const track = trackRef.current;
    if (track && projects.length > 0) {
      const viewportWidth = track.parentElement?.clientWidth || window.innerWidth;
      const center = viewportWidth / 2;

      let closestIndex = activeIndex;
      let closestDistance = Infinity;

      Array.from(track.children).forEach((child, idx) => {
        const el = child as HTMLElement;
        const childCenterInTrack = el.offsetLeft + el.clientWidth / 2;
        const childCenterInViewport = childCenterInTrack + finalOffset;
        const distance = Math.abs(childCenterInViewport - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = idx;
        }
      });

      setIsTransitioning(true);
      setActiveIndex(closestIndex);
      if (closestIndex >= projects.length - 1) {
        setCarouselDirection(-1);
      } else if (closestIndex <= 0) {
        setCarouselDirection(1);
      }
    }

    pauseTimeoutRef.current = setTimeout(() => {
      // triggers interval restart via dependencies
    }, 8000);
  };

  const transition = reduced ? { duration: 0 } : { duration: .7, ease: [0.22, 1, .36, 1] };

  // Calculate next target index based on direction
  let nextTargetIndex = activeIndex + carouselDirection;
  if (projects.length > 0) {
    if (nextTargetIndex >= projects.length) {
      nextTargetIndex = projects.length - 2 >= 0 ? projects.length - 2 : 0;
    } else if (nextTargetIndex < 0) {
      nextTargetIndex = 1 < projects.length ? 1 : 0;
    }
  } else {
    nextTargetIndex = 0;
  }

  // Render single copy of projects for ping-pong carousel
  const itemsToRender = projects;

  const currentTransform = isDragging
    ? `translate3d(${trackOffset + dragOffset}px, 0, 0)`
    : `translate3d(${trackOffset}px, 0, 0)`;

  const transitionStyle = isTransitioning && !isDragging
    ? 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
    : 'none';

  return (
    <>
      <CinematicIntro />
      <Navbar />
      <main>
        <section id="home" className="hero">
          <motion.div className="hero-copy" initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:.13}}}}>
            <motion.span variants={reveal} transition={transition} className="eyebrow">{settings.hero.eyebrow}</motion.span>
            <motion.h1 variants={reveal} transition={transition}>{settings.hero.heading.replace(/\\n/g, '\n').split('\n').map(x => <span key={x}>{x}</span>)}</motion.h1>
            <motion.p variants={reveal} transition={transition}>{settings.hero.copy}</motion.p>
            <motion.div variants={reveal} transition={transition} className="hero-actions">
              <a className="button" href="#work">View Our Work <ArrowDownRight size={16}/></a>
              <a className="text-link" href="#contact">Let’s Talk <ArrowUpRight size={16}/></a>
            </motion.div>
          </motion.div>
          <motion.div className="hero-media" initial={{opacity:0,scale:1.04}} animate={{opacity:1,scale:1}} transition={{duration:1.1}}>
            {heroVideoUrl ? (
              <video
                src={heroVideoUrl}
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                aria-label="Editing suite atmosphere"
              />
            ) : (
              <Media src={settings.hero.mediaUrl} type={settings.hero.mediaType} alt="Editing suite atmosphere"/>
            )}
            <div className="film-grain"/>
            <span className="hero-index">01 — 07</span>
          </motion.div>
        </section>

        <section id="services" className="services">
          <SectionTitle eyebrow="WHAT WE DO" title="What We Do" copy="End-to-end video editing solutions for creators, businesses & brands."/>
          <div className="service-grid">
            {services.map((s, i) => {
              const Icon = icons[s.icon as keyof typeof icons] || Frame;
              return (
                <motion.article className="service" key={s.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}>
                  <Icon/>
                  <span>0{i+1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <ArrowUpRight className="service-arrow" size={18}/>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="about" className="about">
          <AboutVideo />
          <div className="about-copy">
            <SectionTitle eyebrow="ABOUT US" title={'Stories Told.\nVisions Realized.'}/>
            <p>We’re a detail-obsessed post-production partner for people with something worth saying. From the first select to the final frame, we shape footage into stories that look as good as they feel.</p>
            <div className="stats">{settings.statistics.map(s => <Stat key={s.label} {...s}/>)}</div>
          </div>
        </section>

        <section id="work" className="portfolio">
          <div className="portfolio-head">
            <SectionTitle eyebrow="SELECTED WORK" title="Featured Projects"/>
            <a className="text-link" href="#contact">Start a project <ArrowUpRight size={16}/></a>
          </div>
          <div className="portfolio-viewport" style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
            <div
              ref={trackRef}
              className={`reel-track ${isDragging ? 'reel-track--dragging' : ''}`}
              style={{
                transform: currentTransform,
                transition: transitionStyle,
                display: 'flex',
                willChange: 'transform'
              }}
              onTransitionEnd={handleTransitionEnd}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {itemsToRender.map((p, i) => {
                const uniqueKey = `${p.slug}-${i}`;
                return (
                  <ReelVideo
                    key={uniqueKey}
                    project={p}
                    isActive={i === activeIndex}
                    shouldPreload={i === activeIndex || i === nextTargetIndex}
                    onMetadataLoaded={calculateOffset}
                    onClick={() => {
                      if (i === activeIndex) {
                        setActive(p);
                      } else {
                        setIsTransitioning(true);
                        setActiveIndex(i);
                        if (i >= projects.length - 1) {
                          setCarouselDirection(-1);
                        } else if (i <= 0) {
                          setCarouselDirection(1);
                        }
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="reel-drag-prompt">
            <span>Drag to explore</span>
          </div>
        </section>

        <Contact />
      </main>

      <footer>
        <a className="brand-logo brand-logo--footer" href="#home"><img src="/7bit-media-logo.png" alt="7bit Media"/></a>
        <div>
          {Object.entries(settings.socialLinks).map(([name, url]) => {
            if (name.toLowerCase() === 'instagram' || (url && url !== '#')) {
              return <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>;
            }
            return <a key={name} href={`#${name.toLowerCase()}`} onClick={(e) => { e.preventDefault(); setWipPlatform(name); }}>{name}</a>;
          })}
        </div>
        <small>© 2026 {settings.companyName}. All rights reserved.</small>
      </footer>

      <AnimatePresence>
        {active && <ProjectModal project={active} close={() => setActive(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {wipPlatform && <WorkInProgress platformName={wipPlatform} onBack={() => setWipPlatform(null)} />}
      </AnimatePresence>
    </>
  );
}
