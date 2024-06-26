import { COMMIT_GRAPH_HOME, DEFAULT_IMAGE, PBFT_GRAPH_HOME, PREPARE_GRAPH_HOME, TOGGLE_CHANGE_HOME } from "../../../../../Constants";

// ------ HOME PAGE CARD IMAGES -------
export const homePageCardDetails = [
    {
        image: PBFT_GRAPH_HOME ?? DEFAULT_IMAGE, 
        alt: 'PBFT Graph Image',
        title: 'PBFT Graph',
        // TODO: Change the below details FOR ALL
        description: 'Novel PBFT visualizer with bespoke animations, speed ups and replays',
        link: '/pages/visualizer',
    },
    {
        image: COMMIT_GRAPH_HOME ?? DEFAULT_IMAGE, 
        alt: 'Messages v Time',
        title: 'Messages v Time',
        // TODO: Change the below details FOR ALL
        description: 'Check out the commit messages over time for different replicas',
        link: '/pages/visualizer',
    },
    {
        image: PREPARE_GRAPH_HOME ?? DEFAULT_IMAGE, 
        alt: 'Messages v Time',
        title: 'Messages v Time',
        // TODO: Change the below details FOR ALL
        description: 'Check out the prepare messages over time for different replicas',
        link: '/pages/visualizer',
    },
    {
        image: TOGGLE_CHANGE_HOME ?? DEFAULT_IMAGE, 
        alt: 'Simulate Fualtiness',
        title: 'Simulate Fualtiness',
        // TODO: Change the below details FOR ALL
        description: 'Toggle faultiness to simulate different consensus situations',
        link: '/pages/visualizer',
    },
]