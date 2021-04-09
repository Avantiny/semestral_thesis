import * as Sequelize from 'sequelize'

// M:N relationship
export default (sequelize: Sequelize.Sequelize, DataTypes: any) => {
  const TagsAssetsModel = sequelize.define('tags_assets', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    asset_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  // @ts-ignore
  TagsAssetsModel.associate = models => {
    models.TagsAssets.belongsTo(models.Assets, {
      foreignKey: 'asset_id',
      constraints: false,
    })
    models.TagsAssets.belongsTo(models.Tags, {
      foreignKey: 'tag_id',
      constraints: false,
    })
  }

  return TagsAssetsModel
}
