<script>
    import Template from "./ExperienceTamplate.svelte";

    const period = "2020 - 2021";
    const techs = [
        "JavaScript",
        "React",
        "Redux",
        "NodeJS",
        "MongoDB",
        "Firebase",
    ];
    const orgs = ["Windows", "GitHub", "Telegram", "Agile"];
</script>

<Template {period} {techs} {orgs}>
    Outsource consulting company.
    <br />
    Developed different projects for local and foreign markets.
</Template>
