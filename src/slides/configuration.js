function parallax(e) {
    const divider = 100;
    const parallaxElements = document.getElementsByClassName("parallax");

    for (const element of parallaxElements) {
        let x = 0;
        let y = 0;
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        const speed = element.getAttribute("speed");

        const mouseX = (screenCenterX - e.pageX)
        const mouseY = (screenCenterY - e.pageY);
        x = (mouseX / divider) * speed;
        if (e.pageY < screenCenterY) {
            y = (mouseY / divider) * speed;
        } else if (e.pageY > screenCenterY) {
            y = (mouseY / divider) * speed;
        }

        element.style.transform = `translateX(${x}px) translateY(${y}px)`;
    }
}

export const slidesConfig = {
    speed: 500,
    loadParallax: () => {
        const speeds = ['1.2', '1.4', '1.6', '1.8'];
        const parallaxElements = document.getElementsByClassName("parallax");
        for (const element of parallaxElements) {
            const rndSpeed = speeds[Math.floor(Math.random() * speeds.length)];
            element.setAttribute('speed', rndSpeed);
        }

        window.addEventListener("mousemove", parallax);
    },
    removeParallax: () => {
        window.removeEventListener('mousemove', parallax);
    }
}
