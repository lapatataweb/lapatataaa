document.addEventListener('DOMContentLoaded', () => {
    console.log("La Patata!!!!!!!!!!!!!!!!!!");

    // Check if AOS is loaded, otherwise animations won't even work at all and things will look mid
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom',
        });
        console.log("AOS Initialized.");
    } 

    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        }
    }

    const reserveButtons = document.querySelectorAll('.reserve-button');
    const visitSection = document.getElementById('visit');

    if (visitSection && reserveButtons.length > 0) {
        reserveButtons.forEach(reserveButton => {
            const reserveLink = reserveButton.closest('a');
            const isLocalVisitLink = reserveLink && (reserveLink.getAttribute('href') === '#visit' || (reserveLink.pathname === window.location.pathname && reserveLink.hash === '#visit'));

            if (isLocalVisitLink) {
                reserveLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Smooth scrolling to #visit section when clicking reserve button thing");
                    visitSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });

            } else if (reserveLink && reserveLink.href.includes('index.html#visit')) {
                console.log("Reserve button points to index.html#visit - probably handled elsewhere so not touching it here");
            } 
            
            
            else {
                reserveButton.addEventListener('click', (e) => {
                    if (document.body.contains(visitSection)) {
                        e.preventDefault();
                        console.log("Smooth scroll to #visit - fallback cause links might be weird sometimes");
                        visitSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                      
                });
            }
        });
    }

    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = navLinks?.querySelectorAll('a');

    if (navToggle && navLinks) {
        // setup mobile nav toggle button thing
        console.log("Setting up mobile navigation toggle now.");

        navToggle.addEventListener('click', () => {
            console.log('--- Hamburger Button Clicked ---');
            const isExpanded = navLinks.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isExpanded.toString());
            const icon = navToggle.querySelector('i');
            if (isExpanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        if (navLinkItems) {
            navLinkItems.forEach(link => {
                if (!link.closest('.nav-toggle')) {
                    link.addEventListener('click', () => {
                        if (navLinks.classList.contains('active')) {
                            console.log("Closing mobile menu bc user clicked a link");
                            navLinks.classList.remove('active');
                            navToggle.setAttribute('aria-expanded', 'false');
                            const icon = navToggle.querySelector('i');
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    });
                }
            });
        }
    } else {
        console.log("Mobile nav setup skipped (maybe nav-toggle or nav-links missing idk)");
    }

    const svgContainer = document.getElementById('flowchart-svg-paths');
    const svgPaths = svgContainer?.querySelectorAll('.animate-path');
    const flowchartSteps = document.querySelectorAll('.flowchart-vertical-container .flowchart-step-v');

    // flowchart svg animations coming up, hope this works haha
    if (svgContainer && svgPaths && svgPaths.length > 0 && flowchartSteps.length > 0) {
        console.log(`Found ${svgPaths.length} ${flowchartSteps.length}`);

        let pathsPrepared = true;
        svgPaths.forEach((path, index) => {
            try {
                const length = path.getTotalLength();
                if (length > 0) {
                    path.style.strokeDasharray = length;
                    path.style.strokeDashoffset = length;
                    path.style.opacity = '0';
                    path.classList.remove('visible');
                } else {
                    console.warn(`Path ${path.id || index} has 0 length so we skipping it.`);
                }
            } catch (error) {
                console.error(`Error preparing path ${path.id || index}:`, error);
                pathsPrepared = false;
            }
        });

        if (pathsPrepared) {
            const flowchartObserverOptions = { root: null, threshold: 0.2 };
            const flowchartObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const stepElement = entry.target;
                        const stepNumber = parseInt(stepElement.dataset.step, 10);

                        if (stepNumber > 1) {
                            const precedingPathId = `path-${stepNumber - 1}-${stepNumber}`;
                            const precedingPath = document.getElementById(precedingPathId);
                            if (precedingPath && !precedingPath.classList.contains('visible')) {
                                const pathDelay = parseFloat(precedingPath.dataset.animDelay || 0) * 1000;
                                setTimeout(() => {
                                    precedingPath.style.opacity = '1';
                                    precedingPath.classList.add('visible');
                                }, pathDelay);
                            }
                        }
                    }
                });
            }, flowchartObserverOptions);

            flowchartSteps.forEach(step => {
                flowchartObserver.observe(step);
            });
        } else {
            console.error("SVG paths prep failed so observer never started sadly.");
        }
    } else {
        if (document.getElementById('plant-to-plate-vertical')) {
            if (!svgContainer) console.log("SVG container '#flowchart-svg-paths' NOT found.");
            if (!svgPaths || svgPaths.length === 0) console.log("SVG paths '.animate-path' missing too.");
            if (flowchartSteps.length === 0) console.log("Flowchart steps '.flowchart-step-v' missing oh nooo");
        }
    }

    const heroSectionCheck = document.querySelector('.hero');
    const idleButton = document.getElementById('idle-menu-prompt');

    if (heroSectionCheck && idleButton) {
        console.log("Setting up idle menu prompt (the thing that pops up if u don't do anything)");
        let idleTimerId = null;
        let userHasInteracted = false;

        const showIdleButton = () => {
            if (window.scrollY === 0 && !userHasInteracted) {
                console.log("idle timer elapsed, showing the idle prompt button now");
                idleButton.classList.add('visible');
            } else {
                if (idleTimerId) {
                    clearTimeout(idleTimerId);
                    idleTimerId = null;
                }
            }
        };

        const handleInteraction = () => {
            if (!userHasInteracted) {
                console.log("User interacted -cancelling idle prompt");
                userHasInteracted = true;
                if (idleTimerId) {
                    clearTimeout(idleTimerId);
                    idleTimerId = null;
                }
                if (idleButton.classList.contains('visible')) {
                    idleButton.classList.remove('visible');
                }
                window.removeEventListener('scroll', handleInteraction);
                document.body.removeEventListener('click', handleInteraction);
                document.body.removeEventListener('touchstart', handleInteraction);
            }
        };

        idleTimerId = setTimeout(showIdleButton, 7000);

        window.addEventListener('scroll', handleInteraction, { passive: true });
        document.body.addEventListener('click', handleInteraction, { once: true });
        document.body.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
    } else {
        console.log("Idle menu prompt skipped - missing hero section or button, not a big deal probably");
    }

    const internalLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && (href.endsWith('.html') || !href.includes('.'))) {
                // internal navigation - fadeout page before loading new one
                console.log(`Internal link clicked: ${href} - starting fadeout animation now`);
                e.preventDefault();
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            }
        });
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            console.log("Page was restored from bfcache, removing fade-out class to fix weird glitches");
            document.body.classList.remove('fade-out');
        }
    });

});