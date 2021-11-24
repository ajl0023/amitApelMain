import About from "../About.svelte";
import ContactUs from "../ContactUs/ContactUs.svelte";
import Development from "../Developments/Development.svelte";
import MalibuRebuild from "../MalibuRebuild.svelte";
import Masonry from "../Masonry/Masonry.svelte";
import MeetTheTeam from "../meetTheTeam/MeetTheTeam.svelte";
import Press from "../press/Press.svelte";
import WhatWeDo from "../WhatWeDo/WhatWeDo.svelte";
import Bar3Gallery from "./../Bar-3-Gallery/Bar3Gallery.svelte";
export const pages = {
  "meet amit apel": {
    name: "meet amit apel",
    component: About,
  },
  "malibu rebuild": {
    component: MalibuRebuild,
    name: "malibu rebuild",
  },
  "meet the team": {
    component: MeetTheTeam,
    name: "meet the team",
  },
  press: {
    component: Press,
    name: "press",
  },
  "private homes": {
    component: Bar3Gallery,
    name: "private homes",
  },
  "multi units": {
    component: Bar3Gallery,
    name: "multi units",
  },

  concept: {
    component: Bar3Gallery,
    name: "concept",
  },
  "contact us": {
    component: ContactUs,
    name: "contact us",
  },
  aviator: {
    component: Development,
    name: "aviator",
  },
  maliview: {
    component: Development,
    name: "maliview",
  },
  sculptures: {
    component: Masonry,
    name: "sculpture",
  },
  "what we do": { component: WhatWeDo, name: "what we do" },
  furniture: { component: Masonry, name: "furniture" },
  art: { component: Masonry, name: "art" },
};
