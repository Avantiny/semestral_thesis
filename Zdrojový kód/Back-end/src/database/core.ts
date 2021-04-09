import * as Sequelize from 'sequelize'
import config from '../../env-config'

// @ts-ignore
export const sequelize = new Sequelize(config.DB_DATABASE, config.DB_USER, config.DB_PASSWORD, {
  host: config.DB_HOST,
  dialect: 'mariadb',
  port: parseInt(process.env.DB_PORT, 10),
  logging: false, // console.log,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 300000,
    idle: 100000,
  },
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    underscored: true,
  },
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Database Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

// config models
const models = {
  Assets: sequelize.import('./models/AssetsModel'),
  Tags: sequelize.import('./models/TagsModel'),
  TagsAssets: sequelize.import('./models/TagsAssetsModel'),
  sequelize,
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

export default models
