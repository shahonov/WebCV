export const slidesConfig = {
    speed: 500,
    loadParallax: () => {
        const parallaxElements = document.getElementsByClassName("parallax");
        window.addEventListener("mousemove", (e) => {
            for (const element of parallaxElements) {
                const sign = element.getAttribute("sign");
                const speed = element.getAttribute("speed");
                const width = e.pageX * speed;
                const height = e.pageY * speed;
                let x = 0;
                let y = 0;
                if (sign === "+") {
                    x = (window.innerWidth + width) / 100;
                    y = (window.innerHeight + height) / 100;
                } else if (sign === "-") {
                    x = (window.innerWidth - width) / 100;
                    y = (window.innerHeight - height) / 100;
                }
                element.style.transform = `translateX(${x}px) translateY(${y}px)`;
            }
        });
    }
}
