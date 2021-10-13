export const skillType = {
    fe: 'front-end',
    be: 'back-end'
}

export const techSkills = {
    sbTech: [
        { label: ".NET Core", weight: 70, type: skillType.be },
        { label: "MS SQL", weight: 80, type: skillType.be },
        { label: "React", weight: 10, type: skillType.fe },
        { label: "MobX", weight: 30, type: skillType.fe },
        { label: "TypeScript", weight: 40, type: skillType.fe }
    ],
    motionSoftware: [
        { label: "JavaScript", weight: 0, type: skillType.fe },
        { label: "React", weight: 10, type: skillType.fe },
        { label: "Redux", weight: 20, type: skillType.fe },
        { label: "NodeJS", weight: 50, type: skillType.be },
        { label: "MongoDB", weight: 60, type: skillType.be },
        { label: "Firebase", weight: 100, type: skillType.be },
    ],
    clustermarket: [
        { label: "Svelte", weight: 90, type: skillType.fe },
        { label: "GraphQL", weight: 110, type: skillType.be },
        { label: "Postrges SQL", weight: 120, type: skillType.be },
        { label: "Ruby on Rails", weight: 130, type: skillType.be }
    ],
    others: [
        { label: "HTML", weight: 21, type: skillType.fe },
        { label: "CSS", weight: 22, type: skillType.fe },
        { label: "SASS", weight: 23, type: skillType.fe },
    ]
}

export const softSkills = [

];
