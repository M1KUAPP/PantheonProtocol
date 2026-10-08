/**
 * Database seeder for game assets.
 *
 * Provides methods to reset the database and create game asset records
 * in both source and target tables using Prisma ORM.
 * @module
 */

import { PrismaClient } from '@prisma/client'

/** Game asset data structure matching the database schema. */
export interface GameAsset {
  uid: number
  name: string
  description: string
  localImageName: string
  item_type: string
  rarity: string
  attributes: Array<{ trait_type: string; value: string | number }>
}

/**
 * Database seeder class for managing game asset records.
 * Handles creation and deletion of game assets in source and target tables.
 */
export class Seeder {
  constructor(private prisma: PrismaClient) {}

  /** Clears all records from source and target game asset tables. */
  async resetDatabase(): Promise<void> {
    await this.prisma.source_game_assets.deleteMany({})
    await this.prisma.target_game_assets.deleteMany({})
  }

  /**
   * Creates a game asset record in the source table.
   * @param asset - Game asset data to insert.
   * @param imageUrl - Public URL of the uploaded asset image.
   */
  async createSourceGameAsset(asset: GameAsset, imageUrl: string): Promise<void> {
    await this.prisma.source_game_assets.create({
      data: {
        uid: asset.uid,
        name: asset.name,
        description: asset.description,
        image_path: imageUrl,
        item_type: asset.item_type,
        rarity: asset.rarity,
        attributes: asset.attributes
      }
    })
  }

  /**
   * Creates a game asset record in the target table.
   * @param asset - Game asset data to insert.
   * @param imageUrl - Public URL of the uploaded asset image.
   */
  async createTargetGameAsset(asset: GameAsset, imageUrl: string): Promise<void> {
    await this.prisma.target_game_assets.create({
      data: {
        uid: asset.uid,
        name: asset.name,
        description: asset.description,
        image_path: imageUrl,
        item_type: asset.item_type,
        rarity: asset.rarity,
        attributes: asset.attributes
      }
    })
  }
}
