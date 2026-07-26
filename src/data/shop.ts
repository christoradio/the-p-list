export interface ShopItem {
  name: string;
  author: string;
  blurb: string;
  connectedTo?: { title: string; slug: string };
  tag: string;
  url: string;
  image?: string;
  emoji?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    name: "The Lamp That Belongs Here",
    author: "Orange Mushroom Touch Lamp",
    blurb:
      "A proper 1960s mushroom lamp shape in a very committed shade of orange. Touch to turn on. Glows like every good thing that ever happened in a mid-century living room. Would not look out of place in a single house we've ever featured.",
    connectedTo: { title: "Step Into 1980", slug: "step-into-1980-jamboree-heights" },
    tag: "As vaguely seen on The P List",
    url: "https://amzn.to/4ancNqn",
    image: "https://images.theplist.com.au/orange_touch_lamp.jpg",
  },
  {
    name: "Throw Pillows With Opinions",
    author: "Retro Tufted Cushion Cover",
    blurb:
      "Chunky tufted squares in terracotta, mustard, avocado and blue on a cream base. Looks like it was designed by someone who grew up in every house on this site simultaneously. Your sofa deserves a point of view.",
    connectedTo: { title: "Knights of the Yellow Kitchen Table", slug: "knights-of-the-yellow-kitchen-table" },
    tag: "Inspired by the list",
    url: "https://amzn.to/4eJxcXW",
    image: "https://images.theplist.com.au/retro_throw_pillows.jpg",
  },
  {
    name: "The Groovy Mirror",
    author: "Wavy Irregular Wall Mirror",
    blurb:
      "A rust-brown wavy frame that looks like it was sculpted rather than manufactured. Organic, irregular, and deeply committed to having a personality. Goes in literally any room that needs to stop being so boring about mirrors.",
    connectedTo: { title: "Gidget Goes to Palm Springs", slug: "gidget-goes-to-palm-springs-palm-beach" },
    tag: "Inspired by the list",
    url: "https://amzn.to/4oWgY2j",
    image: "https://images.theplist.com.au/groovy_mirror.jpg",
  },
  {
    name: "Starbursts for the Wall",
    author: "Mid-Century Starburst Wall Decorations, Set of 4",
    blurb:
      "Four atomic-age starburst wall hangings in teal, orange, mustard and silver. The kind of thing that turns a blank wall into a statement and a statement into a whole personality. Hamilton Hill would approve. We certainly do.",
    connectedTo: { title: "WA’s Retro Wonder", slug: "was-retro-wonder-hamilton-hill" },
    tag: "As seen on The P List (spiritually)",
    url: "https://amzn.to/444wIH3",
    image: "https://images.theplist.com.au/retro_decorations.jpg",
  },
  {
    name: "The Clock That Ties It All Together",
    author: "Ball Starburst Wall Clock",
    blurb:
      "Wooden beads radiating off chrome spokes around a brushed brass face — the exact clock that should be hanging in every house on this list and somehow isn't. Pure atomic-age confidence. Tells the time. Makes a statement while doing it.",
    connectedTo: { title: "POV: 1975", slug: "pov-1975-dianella" },
    tag: "As vaguely seen on The P List",
    url: "https://amzn.to/4w9OPHA",
    image: "https://images.theplist.com.au/star_clock.jpg",
  },
  {
    name: "Karate Chopped Pillows",
    author: "MIULEE Corduroy Striped Farmhouse Throw Pillow Covers, Set of 4",
    blurb:
      "Sage green corduroy, perfectly karate-chopped down the middle the way every styled sofa on this list seems to manage and yours somehow doesn't. Four covers, one crease, endless smugness.",
    tag: "Inspired by the list",
    url: "https://amzn.to/4vJjpad",
    image: "https://images.theplist.com.au/karate_chop_pillows.jpg",
  },
  {
    name: "Toilet Art",
    author: "FKRYTYB Vintage Framed Duck Wall Art Wearing Toilet Paper Hat",
    blurb:
      "A duck. Wearing a toilet paper hat. Framed, vintage, entirely sincere about it. Every bathroom on this list has earned art exactly this unhinged — now yours can too.",
    connectedTo: { title: "The Toilet's Right There: Glebe", slug: "the-toilets-right-there-glebe" },
    tag: "As vaguely seen on The P List",
    url: "https://amzn.to/4vLRDKt",
    image: "https://images.theplist.com.au/toilet_duck_art.jpg",
  },
  {
    name: "Melted Disco Ball",
    author: "Handmade Mirror Ball Sculpture, 12in, Silver",
    blurb:
      "A disco ball that's given up on being spherical and we respect it. Mirrored glass, fully melted, deeply committed to the bit. The party's over. This is what's left.",
    connectedTo: { title: "Studio 54: Kenthurst", slug: "studio-54-kenthurst" },
    tag: "Inspired by the list",
    url: "https://amzn.to/44PaOIi",
    image: "https://images.theplist.com.au/melted_disco_ball.jpg",
  },
  {
    name: "Mirror, Mirror On The Wall",
    author: "TEIPAI Resin Leaf Frame Wall Mirror, Yellow-Orange",
    blurb:
      "A wavy resin leaf frame in a yellow-orange flocked finish that looks like it grew there rather than got hung. Every hallway on this list needed one of these. Now yours has one.",
    tag: "As seen on The P List (spiritually)",
    url: "https://www.amazon.com/dp/B0G2BYXVPS?tag=theplist-20",
    image: "https://images.theplist.com.au/resin_leaf_mirror.jpg",
  },
];
