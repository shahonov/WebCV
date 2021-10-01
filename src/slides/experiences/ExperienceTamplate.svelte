<script>
    export let period;
    export let techs;
    export let orgs;

    const rnd = (max) => Math.floor(Math.random() * max);

    const signs = ["+", "-"];
    const speeds = ["1", "1.2", "1.4", "1.6"];

    const rndSign = () => signs[rnd(signs.length)];
    const rndSpeed = () => speeds[rnd(speeds.length)];
</script>

<div class="experience-details">
    <div class="period">
        <h3 class="parallax" speed={rndSpeed()}>{period}</h3>
    </div>
    <div class="overview">
        <p class="parallax" speed={rndSpeed()}>
            <slot />
        </p>
    </div>
    <div class="stacks">
        <div class="tech-stack">
            <h4 class="parallax">Tech stack</h4>
            <ul>
                {#each techs as tech, i (i)}
                    <li class="parallax" speed={rndSpeed()}>
                        {tech}
                    </li>
                {/each}
            </ul>
        </div>
        <div class="org-stack">
            <h4 class="parallax">Organisation</h4>
            <ul>
                {#each orgs as org, i (i)}
                    <li class="parallax" speed={rndSpeed()}>
                        {org}
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../styles.scss";

    .experience-details {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        .period {
            width: 100%;
            display: flex;
            color: $lightGrey;
            align-items: center;
            justify-content: center;
        }

        .overview {
            width: 100%;
            display: flex;
            align-items: center;
            color: $lightGrey;
            justify-content: center;

            p {
                text-align: center;
            }
        }

        .stacks {
            display: flex;
            margin-top: 1em;
            justify-content: space-between;

            .tech-stack {
                width: 40%;
                display: flex;
                flex-wrap: wrap;
                color: $darkGrey;
                justify-content: center;
                transition: $transitionTime;

                h4 {
                    width: 100%;
                    text-align: center;
                }

                ul {
                    margin-top: -2vh;
                    list-style-type: none;

                    li {
                        margin: 0.5em;
                    }
                }

                &:hover {
                    padding: 1em;
                    color: $lightGrey;
                    transition: $transitionTime;
                    border: 1px solid $darkGrey;
                }
            }

            .org-stack {
                width: 40%;
                display: flex;
                flex-wrap: wrap;
                color: $darkGrey;
                justify-content: center;
                transition: $transitionTime;

                h4 {
                    width: 100%;
                    text-align: center;
                }

                ul {
                    margin-top: -2vh;
                    list-style-type: none;

                    li {
                        margin: 0.5em;
                    }
                }

                &:hover {
                    padding: 1em;
                    color: $lightGrey;
                    transition: $transitionTime;
                    border: 1px solid $darkGrey;
                }
            }
        }
    }
</style>
