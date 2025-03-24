document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            if (mainNav.classList.contains('active')) {
                mainNav.style.display = 'block';
            } else {
                mainNav.style.display = '';
            }
        });
    }
    
    // Interactive Grid Effect
    const interactiveGrid = document.getElementById('interactive-grid');
    if (interactiveGrid) {
        createInteractiveGrid(interactiveGrid);
    }
    
    // Shine effect on portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            this.style.setProperty('--mouse-x', `${x}%`);
            this.style.setProperty('--mouse-y', `${y}%`);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mobileMenuBtn.click();
                }
            }
        });
    });
});

// Create interactive grid effect
function createInteractiveGrid(container) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);
    
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let points = [];
    let mousePosition = { x: 0, y: 0 };
    let animationFrameId;
    
    function resizeCanvas() {
        width = container.offsetWidth;
        height = container.offsetHeight;
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
    }
    
    function initPoints() {
        points = [];
        const numPoints = 40;
        const cols = Math.floor(Math.sqrt(numPoints));
        const rows = Math.floor(numPoints / cols);
        const cellWidth = width / cols;
        const cellHeight = height / rows;
        
        for (let i = 0; i < numPoints; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = cellWidth * col + cellWidth / 2;
            const y = cellHeight * row + cellHeight / 2;
            const angle = Math.random() * Math.PI * 2;
            
            points.push({
                x,
                y,
                translateX: 0,
                translateY: 0,
                rotate: angle
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        points.forEach(point => {
            const distance = Math.sqrt(
                Math.pow(mousePosition.x - point.x, 2) + 
                Math.pow(mousePosition.y - point.y, 2)
            );
            const maxDistance = 120;
            
            if (distance < maxDistance) {
                const force = (1 - distance / maxDistance) * 0.2;
                const angle = Math.atan2(mousePosition.y - point.y, mousePosition.x - point.x);
                point.translateX = Math.cos(angle) * force * 20;
                point.translateY = Math.sin(angle) * force * 20;
                point.rotate = angle;
            } else {
                point.translateX *= 0.8;
                point.translateY *= 0.8;
            }
            
            ctx.save();
            ctx.translate(point.x + point.translateX, point.y + point.translateY);
            ctx.rotate(point.rotate);
            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(4, 0);
            ctx.stroke();
            ctx.restore();
        });
        
        animationFrameId = requestAnimationFrame(draw);
    }
    
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        mousePosition = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    function handleResize() {
        resizeCanvas();
        initPoints();
    }
    
    // Initialize
    resizeCanvas();
    initPoints();
    draw();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function (not used in this example but good practice)
    return function cleanup() {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
    };
}