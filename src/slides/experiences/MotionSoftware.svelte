<script>
    import Template from "./ExperienceTamplate.svelte";
    import { techSkills } from "./skills";

    const period = "2020 - 2021";
    const techs = techSkills.motionSoftware
        .sort((a, b) => a.weight - b.weight)
        .map((x) => x.label);
    const orgs = ["Windows", "GitHub", "Telegram", "Agile"];
</script>

<Template {period} {techs} {orgs}>
    Outsource consulting company.
    <br />
    Developed different projects for local and foreign markets.
</Template>
