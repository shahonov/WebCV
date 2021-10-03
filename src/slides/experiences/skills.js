export const skillType = {
    fe: 'front-end',
    be: 'back-end'
}

export const techSkills = {
    sbTech: [
        { label: ".NET Core", weight: 8, type: skillType.be },
        { label: "MS SQL", weight: 9, type: skillType.be },
        { label: "React", weight: 2, type: skillType.fe },
        { label: "MobX", weight: 4, type: skillType.fe },
        { label: "TypeScript", weight: 5, type: skillType.fe }
    ],
    motionSoftware: [
        { label: "JavaScript", weight: 1, type: skillType.fe },
        { label: "React", weight: 2, type: skillType.fe },
        { label: "Redux", weight: 3, type: skillType.fe },
        { label: "NodeJS", weight: 6, type: skillType.be },
        { label: "MongoDB", weight: 7, type: skillType.be },
        { label: "Firebase", weight: 11, type: skillType.be },
    ],
    clustermarket: [
        { label: "Svelte", weight: 10, type: skillType.fe },
        { label: "GraphQL", weight: 12, type: skillType.be },
        { label: "Postrges SQL", weight: 13, type: skillType.be },
        { label: "Ruby on Rails", weight: 14, type: skillType.be }
    ],
    others: [
        { label: "HTML", weight: 1, type: skillType.fe },
        { label: "CSS", weight: 1, type: skillType.fe },
        { label: "SASS", weight: 1, type: skillType.fe },
    ]
}

export const softSkills = [

];
