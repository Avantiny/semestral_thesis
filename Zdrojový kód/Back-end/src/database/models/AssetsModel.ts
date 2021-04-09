import * as Sequelize from 'sequelize'

// TYPESCRIPT!!!
export enum AssetType {
  Video = 'Video',
  Image = 'Image',
}

// TODO: fix ts interfaces
export default (sequelize: Sequelize.Sequelize, DataTypes: any) => {
  const AssetsModel = sequelize.define('assets', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    creation_year: {
      type: DataTypes.INTEGER,
    },
    src: {
      type: DataTypes.STRING,
    },
  })

  // @ts-ignore
  AssetsModel.associate = models => {
    models.Assets.hasMany(models.TagsAssets, {
      foreignKey: 'asset_id',
      sourceKey: 'id',
      constraints: false,
    })
  }

  return AssetsModel
}
