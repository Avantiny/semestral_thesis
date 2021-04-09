import * as cors from 'cors'
import * as express from 'express'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Sequelize from 'sequelize'
import models, { sequelize } from './database/core'
const Op = Sequelize.Op

const app = express()
const port = 3001
app.use(cors())

//getTags
app.get('/tags', async (req, res) => {
  try {
    const tags = await sequelize.query(
      `
    SELECT tags.*
    FROM tags
    -- LEFT JOIN tags_assets on tags_assets.tag_id = tags.id
    -- LEFT JOIN assets on assets.id = tags_assets.asset_id
    -- ORDER BY tags.name
    `,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          assetId: req.params.assetId,
        },
      }
    )
    res.send(tags)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

//fetchTagsDetails
app.get('/assets/:assetId/tags', async (req, res) => {
  try {
    const assets = await sequelize.query(
      `
    SELECT
      tags.* -- ,
    FROM assets
      JOIN tags_assets on tags_assets.asset_id = assets.id
      JOIN tags on tags.id = tags_assets.tag_id
    WHERE assets.id = :assetId
    `,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          assetId: req.params.assetId,
        },
      }
    )
    res.send(assets)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
})

// fetchNewAssets
app.get('/assets/fulltext', async (req, res) => {
  try {
    const tagNameSearch = req.query.search || ''
    // TODO: optimise DB
    const assets = await sequelize.query(
      `
      SELECT * FROM (
        SELECT
          tags.*
          FROM tags
          WHERE tags.name LIKE :search
      ) AS tags
      JOIN tags_assets on tags_assets.tag_id = tags.id
      JOIN assets on assets.id = tags_assets.asset_id
      WHERE creation_year >= :creation_year_from
        AND creation_year <= :creation_year_to
      GROUP BY assets.name
      ORDER BY assets.name
      LIMIT :limit
      OFFSET :offset
      ;`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit: parseInt(req.query.limit, 10),
          offset: parseInt(req.query.offset, 10),
          search: `%${tagNameSearch}%`,
          creation_year_from: parseInt(req.query.creationYearFrom, 10) || 1900,
          creation_year_to: parseInt(req.query.creationYearTo, 10) || 2020,
        },
      }
    )
    res.send(assets)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
  console.timeEnd('queryData')
})

//FetchAssetsByTagId
app.get('/assets/tags/:tagId', async (req, res) => {
  console.time('queryData')
  try {
    const tagId = decodeURIComponent(req.params.tagId)
    console.log(tagId)
    // TODO: add sql index for data
    console.log('queryData')
    // TODO: optimise DB
    const assets = await sequelize.query(
      `
      SELECT * FROM (
        SELECT
          tags.*
          FROM tags
          WHERE tags.id = :tagId
      ) AS tags
      JOIN tags_assets on tags_assets.tag_id = tags.id
      JOIN assets on assets.id = tags_assets.asset_id
      GROUP BY assets.name
      ORDER BY assets.name
      LIMIT :limit
      OFFSET :offset
      ;`,
      {
        type: Sequelize.QueryTypes.SELECT,
        replacements: {
          limit: parseInt(req.query.limit, 10),
          offset: parseInt(req.query.offset, 10),
          tagId,
        },
      }
    )
    res.send(assets)
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
  console.timeEnd('queryData')
})

app.listen(port, () => console.info(`Example app listening on port ${port}!`))
