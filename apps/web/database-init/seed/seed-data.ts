/**
 * Game asset seed data for database initialization.
 *
 * Contains predefined game items (weapons, armor, consumables) for
 * both source and target game asset tables with metadata and attributes.
 * @module
 */

/**
 * Source game assets representing items available for NFT minting.
 * These items can be exported from the source game to become NFTs.
 */
export const sourceGameAssetsData = [
  {
    uid: 10001,
    name: 'Healing Salve',
    description: 'A potent ointment that soothes wounds and restores vitality.',
    localImageName: 'healing-salve.png',
    item_type: 'Consumable',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Effect', value: 'Heal' },
      { trait_type: 'HP Restore', value: 50 },
      { trait_type: 'Stack Size', value: 10 }
    ]
  },
  {
    uid: 10002,
    name: 'Flask of Pure Light',
    description: 'Contains condensed sunlight, capable of blinding dark creatures or illuminating paths.',
    localImageName: 'flask-of-pure-light.png',
    item_type: 'Consumable',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Effect', value: 'Blind' },
      { trait_type: 'Duration', value: '5 seconds' },
      { trait_type: 'Area', value: 'Small AoE' }
    ]
  },
  {
    uid: 10003,
    name: 'Minor Health Potion',
    description: 'A basic potion to mend minor injuries in the heat of battle.',
    localImageName: 'minor-health-potion.png',
    item_type: 'Consumable',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Effect', value: 'Heal' },
      { trait_type: 'HP Restore', value: 30 },
      { trait_type: 'Stack Size', value: 15 }
    ]
  },
  {
    uid: 10004,
    name: 'Orb of Scrying',
    description: 'A mystical orb allowing glimpses of distant places or hidden truths.',
    localImageName: 'orb-of-scrying.png',
    item_type: 'Utility',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Effect', value: 'Divination' },
      { trait_type: 'Range', value: 'Global' },
      { trait_type: 'Usage', value: 'Limited Charges' }
    ]
  },
  {
    uid: 10005,
    name: 'Vial of Bloodlust',
    description: 'A churning, crimson liquid that induces a powerful, short-lived battle rage.',
    localImageName: 'vial-of-bloodlust.png',
    item_type: 'Consumable',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Effect', value: 'Frenzy' },
      { trait_type: 'Attack Speed', value: '+30%' },
      { trait_type: 'Duration', value: '10 seconds' }
    ]
  },
  {
    uid: 10006,
    name: 'Steel Broadsword',
    description: 'A reliable and balanced blade, standard issue for royal infantry.',
    localImageName: 'steel-broadsword.png',
    item_type: 'Weapon',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Type', value: 'Sword' },
      { trait_type: 'Attack', value: 20 },
      { trait_type: 'Weight', value: 'Medium' }
    ]
  },
  {
    uid: 10007,
    name: "Hunter's Recurve Bow",
    description: 'A flexible and reliable bow, favored by hunters and scouts.',
    localImageName: 'hunters-recurve-bow.png',
    item_type: 'Weapon',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Type', value: 'Bow' },
      { trait_type: 'Attack', value: 18 },
      { trait_type: 'Range', value: 'Medium' }
    ]
  },
  {
    uid: 10008,
    name: 'Golden War Axe',
    description: 'A heavy war axe forged from a lustrous golden alloy, granting powerful strikes.',
    localImageName: 'golden-war-axe.png',
    item_type: 'Weapon',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Type', value: 'Axe' },
      { trait_type: 'Attack', value: 50 },
      { trait_type: 'Weight', value: 'Heavy' }
    ]
  },
  {
    uid: 10009,
    name: 'Phoenix Brand',
    description: 'A legendary sword said to hold the soul of a phoenix. It reignites upon breaking.',
    localImageName: 'phoenix-brand.png',
    item_type: 'Weapon',
    rarity: 'Legendary',
    attributes: [
      { trait_type: 'Type', value: 'Greatsword' },
      { trait_type: 'Attack', value: 90 },
      { trait_type: 'Element', value: 'Fire' }
    ]
  },
  {
    uid: 10010,
    name: 'Ember Bow',
    description: 'A yew bow strung with phoenix hair, granting arrows a fiery enchantment.',
    localImageName: 'ember-bow.png',
    item_type: 'Weapon',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Type', value: 'Bow' },
      { trait_type: 'Attack', value: 30 },
      { trait_type: 'Element', value: 'Fire' }
    ]
  },
  {
    uid: 10011,
    name: 'Shadowflame Scythe',
    description: 'A wicked scythe that reaps both soul and life, leaving embers of shadow in its wake.',
    localImageName: 'shadowflame-scythe.png',
    item_type: 'Weapon',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Type', value: 'Scythe' },
      { trait_type: 'Attack', value: 75 },
      { trait_type: 'Element', value: 'Shadow' }
    ]
  },
  {
    uid: 10012,
    name: 'Viridian Longbow',
    description: "A bow crafted from the heartwood of a sentient tree, imbued with the forest's vitality.",
    localImageName: 'viridian-longbow.png',
    item_type: 'Weapon',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Type', value: 'Bow' },
      { trait_type: 'Attack', value: 40 },
      { trait_type: 'Element', value: 'Nature' }
    ]
  },
  {
    uid: 10013,
    name: 'Blade of the Dawn',
    description: "A holy sword that channels the sun's first light, scorching the undead.",
    localImageName: 'blade-of-the-dawn.png',
    item_type: 'Weapon',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Type', value: 'Sword' },
      { trait_type: 'Attack', value: 68 },
      { trait_type: 'Element', value: 'Light' }
    ]
  },
  {
    uid: 10014,
    name: 'Prismatic Recurve',
    description: 'A bow of alien design, its string thrums with a spectrum of chaotic energies.',
    localImageName: 'prismatic-recurve.png',
    item_type: 'Weapon',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Type', value: 'Bow' },
      { trait_type: 'Attack', value: 60 },
      { trait_type: 'Element', value: 'Prismatic' }
    ]
  },
  {
    uid: 10015,
    name: 'Netherlight Rapier',
    description: 'A thin blade that seems to phase in and out of reality, striking with arcane energy.',
    localImageName: 'netherlight-rapier.png',
    item_type: 'Weapon',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Type', value: 'Rapier' },
      { trait_type: 'Attack', value: 55 },
      { trait_type: 'Element', value: 'Arcane' }
    ]
  },
  {
    uid: 10016,
    name: 'Gilded Plate Cuirass',
    description: 'A polished brass cuirass that gleams in the sun. Favored by high-ranking officers.',
    localImageName: 'gilded-plate-cuirass.png',
    item_type: 'Armor',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Slot', value: 'Chest' },
      { trait_type: 'Defense', value: 35 },
      { trait_type: 'Material', value: 'Brass' }
    ]
  },
  {
    uid: 10017,
    name: 'Patinated Steel Mail',
    description: 'Steel armor coated in a faint green patina, offering surprisingly good protection.',
    localImageName: 'patinated-steel-mail.png',
    item_type: 'Armor',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Slot', value: 'Chest' },
      { trait_type: 'Defense', value: 20 },
      { trait_type: 'Material', value: 'Steel' }
    ]
  },
  {
    uid: 10018,
    name: 'Patinated Steel Boots',
    description: 'Matching boots for the Patinated Steel set. Surprisingly quiet.',
    localImageName: 'patinated-steel-boots.png',
    item_type: 'Armor',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Slot', value: 'Feet' },
      { trait_type: 'Defense', value: 10 },
      { trait_type: 'Set', value: 'Patinated Steel' }
    ]
  },
  {
    uid: 10019,
    name: 'Gilded Plate Greaves',
    description: 'Polished brass greaves that complete the Gilded Plate set.',
    localImageName: 'gilded-plate-greaves.png',
    item_type: 'Armor',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Slot', value: 'Feet' },
      { trait_type: 'Defense', value: 14 },
      { trait_type: 'Set', value: 'Gilded Plate' }
    ]
  },
  {
    uid: 10020,
    name: "Archmage's Boots",
    description: 'Enchanted boots that allow the wearer to walk silently on any surface.',
    localImageName: 'archmages-boots.png',
    item_type: 'Armor',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Slot', value: 'Feet' },
      { trait_type: 'Defense', value: 8 },
      { trait_type: 'Ability', value: 'Silent Step' }
    ]
  }
]

/**
 * Target game assets representing items available after NFT import.
 * These items appear in the target game when NFTs are imported.
 */
export const targetGameAssetsData = [
  {
    uid: 20001,
    name: 'Poisonous Concoction',
    description: 'A vile brew that can incapacitate foes with a lingering sickness.',
    localImageName: 'poisonous-concoction.png',
    item_type: 'Consumable',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Effect', value: 'Poison' },
      { trait_type: 'Damage Over Time', value: '10/s for 5s' },
      { trait_type: 'Stack Size', value: 5 }
    ]
  },
  {
    uid: 20002,
    name: "Berserker's Draught",
    description: 'A crimson elixir that ignites primal fury, boosting strength at a cost.',
    localImageName: 'berserkers-draught.png',
    item_type: 'Consumable',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Effect', value: 'Strength Boost' },
      { trait_type: 'Attack Damage', value: '+25%' },
      { trait_type: 'Defense', value: '-15%' }
    ]
  },
  {
    uid: 20003,
    name: 'Mana Book',
    description: 'A shimmering fragment that can restore magical energy.',
    localImageName: 'mana-book.png',
    item_type: 'Consumable',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Effect', value: 'Mana Restore' },
      { trait_type: 'Mana Points', value: 75 },
      { trait_type: 'Stack Size', value: 8 }
    ]
  },
  {
    uid: 20004,
    name: 'Elixir of Stamina',
    description: 'A glowing, golden potion that instantly restores all physical endurance.',
    localImageName: 'elixir-of-stamina.png',
    item_type: 'Consumable',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Effect', value: 'Stamina Restore' },
      { trait_type: 'Stamina Points', value: '100%' },
      { trait_type: 'Stack Size', value: 10 }
    ]
  },
  {
    uid: 20005,
    name: 'Vial of Lumina',
    description: 'A small bottle containing glowing liquid, useful for navigation in darkness.',
    localImageName: 'vial-of-lumina.png',
    item_type: 'Utility',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Effect', value: 'Illumination' },
      { trait_type: 'Duration', value: 'Long' },
      { trait_type: 'Light Radius', value: 'Small' }
    ]
  },
  {
    uid: 20006,
    name: 'Magma Blade',
    description: 'A blade forged in the heart of a volcano, it sears everything it touches.',
    localImageName: 'magma-blade.png',
    item_type: 'Weapon',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Type', value: 'Greatsword' },
      { trait_type: 'Attack', value: 65 },
      { trait_type: 'Element', value: 'Fire' }
    ]
  },
  {
    uid: 20007,
    name: 'Staff of the Ice Weaver',
    description: 'A staff imbued with the essence of a glacier, pulsing with cold energy.',
    localImageName: 'staff-of-the-ice-weaver.png',
    item_type: 'Weapon',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Type', value: 'Staff' },
      { trait_type: 'Magic Power', value: 35 },
      { trait_type: 'Element', value: 'Ice' }
    ]
  },
  {
    uid: 20008,
    name: 'Crystalline Blade',
    description: 'A fragile but exceptionally sharp blade crafted from a rare, enchanted crystal.',
    localImageName: 'crystalline-blade.png',
    item_type: 'Weapon',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Type', value: 'Sword' },
      { trait_type: 'Attack', value: 70 },
      { trait_type: 'Special', value: 'Ignores Armor' }
    ]
  },
  {
    uid: 20009,
    name: "Reinforced Hunter's Bow",
    description: "A standard hunter's bow, reinforced with steel bands for a stronger pull.",
    localImageName: 'reinforced-hunters-bow.png',
    item_type: 'Weapon',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Type', value: 'Bow' },
      { trait_type: 'Attack', value: 25 },
      { trait_type: 'Range', value: 'Medium' }
    ]
  },
  {
    uid: 20010,
    name: 'Glacial Battleaxe',
    description: 'An axe hewn from solid ice, freezing foes with every blow.',
    localImageName: 'glacial-battleaxe.png',
    item_type: 'Weapon',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Type', value: 'Axe' },
      { trait_type: 'Attack', value: 55 },
      { trait_type: 'Element', value: 'Ice' }
    ]
  },
  {
    uid: 20011,
    name: "Royal Knight's Greatsword",
    description: 'A heavy, masterfully crafted greatsword bestowed upon the captains of the Royal Guard.',
    localImageName: 'royal-knights-greatsword.png',
    item_type: 'Weapon',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Type', value: 'Greatsword' },
      { trait_type: 'Attack', value: 38 },
      { trait_type: 'Weight', value: 'Heavy' }
    ]
  },
  {
    uid: 20012,
    name: 'Bronze Hoplite Helm',
    description: 'A standard-issue bronze helmet that offers solid protection against glancing blows.',
    localImageName: 'bronze-hoplite-helm.png',
    item_type: 'Armor',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Slot', value: 'Head' },
      { trait_type: 'Defense', value: 10 },
      { trait_type: 'Material', value: 'Bronze' }
    ]
  },
  {
    uid: 20013,
    name: 'Rusted Iron Helm',
    description: 'A battle-worn iron helmet that has seen better days, but still offers decent protection.',
    localImageName: 'rusted-iron-helm.png',
    item_type: 'Armor',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Slot', value: 'Head' },
      { trait_type: 'Defense', value: 12 },
      { trait_type: 'Material', value: 'Iron' }
    ]
  },
  {
    uid: 20014,
    name: 'Corrupted Firebrand',
    description: 'A once-holy sword now corrupted by shadow magic, burning with a cold, dark flame.',
    localImageName: 'corrupted-firebrand.png',
    item_type: 'Weapon',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Type', value: 'Sword' },
      { trait_type: 'Attack', value: 45 },
      { trait_type: 'Element', value: 'Shadowflame' }
    ]
  },
  {
    uid: 20015,
    name: "Viper's Fang",
    description: "A serrated blade crafted from a venomous beast's tooth. It drips with a potent toxin.",
    localImageName: 'vipers-fang.png',
    item_type: 'Weapon',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Type', value: 'Dagger' },
      { trait_type: 'Attack', value: 28 },
      { trait_type: 'Element', value: 'Poison' }
    ]
  },
  {
    uid: 20016,
    name: "Traveler's Leather Boots",
    description: 'Simple but durable leather boots, well-worn from many journeys.',
    localImageName: 'travelers-leather-boots.png',
    item_type: 'Armor',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Slot', value: 'Feet' },
      { trait_type: 'Defense', value: 8 },
      { trait_type: 'Bonus', value: '+5% Stamina Regen' }
    ]
  },
  {
    uid: 20017,
    name: "Archmage's Robes",
    description: 'The formal robes of a master of the arcane arts, woven with threads of power.',
    localImageName: 'archmages-robes.png',
    item_type: 'Armor',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Slot', value: 'Chest' },
      { trait_type: 'Defense', value: 15 },
      { trait_type: 'Magic Resist', value: 40 }
    ]
  },
  {
    uid: 20018,
    name: 'Gilded Hoplite Helm',
    description: 'A golden helmet with a full face guard, favored by arena champions.',
    localImageName: 'gilded-hoplite-helm.png',
    item_type: 'Armor',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Slot', value: 'Head' },
      { trait_type: 'Defense', value: 18 },
      { trait_type: 'Set', value: 'Gilded Plate' }
    ]
  },
  {
    uid: 20019,
    name: "Wizard's Pointed Hat",
    description: 'The quintessential hat of a practicing wizard. Smells faintly of ozone.',
    localImageName: 'wizards-pointed-hat.png',
    item_type: 'Armor',
    rarity: 'Uncommon',
    attributes: [
      { trait_type: 'Slot', value: 'Head' },
      { trait_type: 'Defense', value: 5 },
      { trait_type: 'Bonus', value: '+10 Max Mana' }
    ]
  },
  {
    uid: 20020,
    name: 'Sturdy Leather Tunic',
    description: 'A tunic made of hardened leather, offering a good balance of protection and mobility.',
    localImageName: 'sturdy-leather-tunic.png',
    item_type: 'Armor',
    rarity: 'Common',
    attributes: [
      { trait_type: 'Slot', value: 'Chest' },
      { trait_type: 'Defense', value: 18 },
      { trait_type: 'Weight', value: 'Light' }
    ]
  }
]
