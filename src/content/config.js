
import { defineCollection, z } from "astro:content";

const trophyCollection = defineCollection({ type: 'data', schema: ({ image }) => z.object({
  id: z.string(),
  code: z.string(),
  biome: z.string(),
  image: image(),
  name: z.string(),
  dropChance: z.string(),
  score: z.number(),
  group: z.string(),
  order: z.number(),
  })
});

const matsCollection = defineCollection({ type: 'data', schema: ({ image }) => z.object({
  id: z.string(),
  image: image(),
  name: z.string(),
  desc: z.string(),
  code: z.string(),
  type: z.enum(['Food', 'Material', 'Metal', 'Trophy', 'Wood', 'Fragment', 'Gear']),
  drop: z.string().optional(),
  usage: z.string(),
  weight: z.number(),
  stack: z.number(),
  mats: z.record(z.number(z.string())).optional(),
})
});

const gearCollection = defineCollection({ type: 'data', schema: ({ image }) => z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  desc: z.string(),
  type: z.enum([
    'Knife', 'Spear', 'Crossbow', 'Bow', 'Shield', 'Fists', 'Axe', 'Bomb', 
    'Missile', 'Polearm', 'Bolt', 'Sword', 'Club', 'Arrow', 'Blood magic', 
    'Elemental magic'
  ]),
  image: image(),
  usage: z.string(),
  wield: z.string(),
  weight: z.number(),
  power: z.number(),
  source: z.string(),
  durab: z.string().optional(),
  craft: z.string().optional(),
  repair: z.string().optional(),
  mats: z.record(z.string(z.string())).optional(),
  attack: z.record(z.string(z.string())).optional(),
  block: z.object({
    'Block armor': z.string().optional(),
    'Parry block armor': z.string().optional(),
    'Block force': z.string().optional(),
    'Parry bonus': z.string().optional()
  }).optional(),
  passive: z.object({
    'Movement speed': z.number().optional()
  }).optional()
}) });

export const collections = {
  'gear': gearCollection,
  'mats': matsCollection,
  'trophy': trophyCollection,
};