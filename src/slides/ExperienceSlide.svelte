<script>
    import { onMount, getContext } from "svelte";

    const globals = getContext("global");
    const { inT, outT } = globals;

    onMount(() => {
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
    });
</script>

<section in:inT out:outT class="slide">
    <div id="current-slide" class="experience-slide">
        <h1 class="parallax" speed='5' sign='+'>Experience slide</h1>
        <h1 class="parallax" speed='15' sign='-'>Experience slide</h1>
        <h1 class="parallax" speed='10' sign='+'>Experience slide</h1>
        <h1 class="parallax" speed='20' sign='-'>Experience slide</h1>
    </div>
</section>

<style lang="scss">
    @import "./styles.scss";

    .slide {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .experience-slide {
            width: 100%;
            height: 100%;
            opacity: 0.95;
            display: flex;
            flex-wrap: wrap;
            color: $mediumGrey;
            align-items: center;
            justify-content: center;
            background-color: $black;

            .parallax {
                width: 100%;
                text-align: center;
            }
        }
    }
</style>
