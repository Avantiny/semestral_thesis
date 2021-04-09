import * as shortid from 'shortid'
import { AssetType } from '../src/database/models/AssetsModel'
import {
  loadImageAssetsData,
  loadImageTagsAssetsData,
  loadImageTagsData,
  loadTaggedVideosAssetsData,
  loadVideosData,
} from './loadAndParseData'
import models from '../src/database/core'
import Case = require('case')

//REMINDER: videoAssets contain videoName, videoUrl, categoryName, creation_year, id
//videoTags contain name, id
//taggedVideosAssetsData contain categoryName, tags (list)

//put tag ids into taggedVideosAssetsData
const getVideoTagsAssets = (videosAssets, videoTags, taggedVideosAssetsData) => {
  const taggedVideosAssetsDataWIthIds = taggedVideosAssetsData.map(item => ({
    categoryName: item.categoryName,
    tags: item.tags.map(tag => ({
      name: tag,
      /*if videoTag name is the same as tag for taggedVideosAssetsData tags,
      give the tag an id which is the same as in videoTag */
      id: videoTags.find(videoTag => videoTag.name === tag).id,
    })),
  }))

  const videoTagAssets = videosAssets
    .map(video => {
      /*for each video join tags as a 2D array
       where each index has videoId and tagId (3D) 
       flat removes video and tag and leaves only
       matched videoId and tagId */
      const videoTags = taggedVideosAssetsDataWIthIds.find(
        item => item.categoryName === video.categoryName
      )
      //give it tag ids
      if (videoTags) {
        return videoTags.tags
          .map(tag => tag.id)
          .map(tagId => ({ tag_id: tagId, asset_id: video.id }))
      } else {
        return []
      }
    })
    .flat()
  // match by category -> and generate new arr with relation ships
  return videoTagAssets
}

const trimString = toTrim => {
  const trimmed = toTrim.substring(0, 25)
  return Case.pascal(trimmed.replace(/[^\x00-\x7F]/g, ''))
}

const getDbAssets = (imageAssetsData: any[], videosData: any[]) => [
  ...imageAssetsData.map(({ image_id, image_url, title, creation_year }) => ({
    id: image_id,
    name: trimString(title), // TODO: add title,, // TODO: add title,
    type: AssetType.Image,
    src: image_url,
    creation_year,
  })),
  ...videosData.map(({ videoName, videoUrl, categoryName, id, creation_year }) => ({
    id,
    name: videoName,
    type: AssetType.Video,
    src: videoUrl,
    categoryName: categoryName,
    creation_year,
  })),
]

const getDbTags = (imagesTags, uniqVideoTags) => [
  ...imagesTags.map(imageTag => ({ name: imageTag.image_tag_name, id: imageTag.image_tag_id })),
  ...uniqVideoTags,
]

//shortid generator
const addIdsToArr = arr => arr.map(item => ({ ...item, id: shortid.generate() }))

const getUniqTags = videosTags => {
  const duplicitVideoTags = videosTags.map(videoTag => videoTag.tags).flat()

  const tags = [
    ...duplicitVideoTags
      // filter duplicit
      .filter((v, i) => duplicitVideoTags.indexOf(v) === i)
      .map(name => ({ name })),
  ]
  return tags
}

const getImageTagsAssetsData = assetsImagesTags =>
  assetsImagesTags.map(tagAsset => ({
    id: shortid.generate(),
    tag_id: tagAsset.image_tag_id,
    asset_id: tagAsset.image_id,
  }))

const main = async () => {
  try {
    console.time('resetDb')
    await models.sequelize.sync({ force: true })
    console.timeEnd('resetDb')

    console.time('parseFiles')
    const [
      imageTagsData,
      imageTagsAssetsData,
      imageAssetsData,
      videosData,
      taggedVideosAssetsData,
    ] = await Promise.all([
      loadImageTagsData(),
      loadImageTagsAssetsData(),
      loadImageAssetsData(),
      loadVideosData(),
      loadTaggedVideosAssetsData(),
    ])
    const videoDataWithIds = addIdsToArr(videosData)
    // uniq === unique
    const uniqVideoTags = addIdsToArr(getUniqTags(taggedVideosAssetsData))

    // taggedVideosAssetsData
    // it generate M:N table
    const videoTagsAssets = addIdsToArr(
      getVideoTagsAssets(videoDataWithIds, uniqVideoTags, taggedVideosAssetsData)
    )

    console.timeEnd('parseFiles')

    console.time('loadDataToDb')

    const assets = getDbAssets(imageAssetsData, videoDataWithIds)
    const tags = getDbTags(imageTagsData, uniqVideoTags)
    // console.log(imageAssetsData[0])
    // console.log(videoDataWithIds[0])
    // console.log(assets[0])
    // splitting
    const imageTagsAssets = getImageTagsAssetsData(imageTagsAssetsData)

    await Promise.all([
      models.Tags.bulkCreate(tags),
      models.Assets.bulkCreate(assets),
      // TODO: make it better
      // > sequelize cant load 0.25M rows in one bulk create i guess??? maybe some node problem??? dunno
      models.TagsAssets.bulkCreate(imageTagsAssets.slice(0, 100000)),
      models.TagsAssets.bulkCreate(imageTagsAssets.slice(100000, 200000)),
      models.TagsAssets.bulkCreate(imageTagsAssets.slice(200000, 300000)),
      models.TagsAssets.bulkCreate(videoTagsAssets.slice(0, 100000)),
      models.TagsAssets.bulkCreate(videoTagsAssets.slice(100000, 200000)),
      models.TagsAssets.bulkCreate(videoTagsAssets.slice(200000, 300000)),
      models.TagsAssets.bulkCreate(videoTagsAssets.slice(300000, 400000)),
    ])

    console.timeEnd('loadDataToDb')
    console.log('done!!!')
  } catch (err) {
    console.error(err)
  }
}

main()
