import * as Sequelize from 'sequelize'

export default (sequelize: Sequelize.Sequelize, DataTypes: any) => {
  const TagModel = sequelize.define('tags', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })

  // @ts-ignore
  TagModel.associate = models => {
    models.Tags.hasMany(models.TagsAssets, {
      foreignKey: 'tag_id',
      sourceKey: 'id',
      constraints: false,
    })
  }

  return TagModel
}
