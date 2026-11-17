import type { ImageMetadata } from 'astro';
import craneTreeTop from '../assets/photos/crane-lifting-tree-top.jpg';
import craneTrunkSection from '../assets/photos/crane-lifting-trunk-section.jpg';
import climberOnLimbedTrunk from '../assets/photos/climber-on-limbed-trunk.jpg';
import fellingNotch from '../assets/photos/felling-notch-double-trunk.jpg';
import climberViewCutTop from '../assets/photos/climber-view-cut-trunk-top.jpg';
import climberInCanopy from '../assets/photos/climber-in-large-canopy.jpg';
import climbersInBareTrees from '../assets/photos/climbers-in-bare-trees.jpg';

/**
 * Owner-supplied job photos (from the Google Business Profile), stripped of metadata.
 * Alt text describes only what is visible in each frame.
 */
export interface Photo {
  src: ImageMetadata;
  alt: string;
}

export const photos = {
  craneTreeTop: {
    src: craneTreeTop,
    alt: 'A crane lifts the whole leafy top of a tree, cut free at the trunk, high above a residential neighborhood.',
  },
  craneTrunkSection: {
    src: craneTrunkSection,
    alt: 'A tall trunk section wrapped in an orange lifting sling and hooked to a crane, rising off the freshly cut stump.',
  },
  climberOnLimbedTrunk: {
    src: climberOnLimbedTrunk,
    alt: 'A climber silhouetted against the sun at the top of a tree trunk stripped of its limbs, with ropes hanging to the ground.',
  },
  fellingNotch: {
    src: fellingNotch,
    alt: 'A crew member in a helmet holds up a long-bar chainsaw beside a massive two-trunk tree with a wedge-shaped notch cut into its base.',
  },
  climberViewCutTop: {
    src: climberViewCutTop,
    alt: 'A climber’s view from high in an evergreen: a chainsaw rests on a freshly cut trunk top above ropes and carabiners, with rooftops and mountains beyond.',
  },
  climberInCanopy: {
    src: climberInCanopy,
    alt: 'Looking up at a climber tied in where the trunks of a large leafy tree split, with a rope hanging toward the ground.',
  },
  climbersInBareTrees: {
    src: climbersInBareTrees,
    alt: 'Two climbers high in a pair of large leafless trees beside a ballfield, with cut branches piled on the ground below.',
  },
} satisfies Record<string, Photo>;
