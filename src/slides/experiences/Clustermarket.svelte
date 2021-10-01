<script>
    import Template from "./ExperienceTamplate.svelte";
    import { techSkills } from "./skills";

    const period = "2021 - current";
    const techs = techSkills.clustermarket.sort(
        (a, b) => a.weight - b.weight
    ).map((x) => x.label);

    const orgs = ["Linux", "GitLab", "Slack", "Agile"];
</script>

<Template {period} {techs} {orgs}>
    Product company, developing an online platform for booking and managing
    scientific resources for laboratories.
    <br />
    Some of the main clients are: Harvard University, Oxford University, etc.
</Template>
