import * as csvtojson from 'csvtojson/v2'
import * as fs from 'fs'
// @ts-ignore
import * as Case from 'case'

//for mock data for sliders
const getRandomYear = () => 1900 + Math.round(Math.random() * 120)

// const norm = toNorm => normalize(toNorm)

//converts csv to json
export const loadImageTagsData = async () => {
  const contents = await csvtojson({
    headers: ['image_tag_id', 'image_tag_name'],
  }).fromFile(`${process.cwd()}/fixtures/class-descriptions-boxable.csv`) //csv to json method
  return contents
}

// converts csv to json, returns only necessary data
export const loadImageTagsAssetsData = async () => {
  const data = await csvtojson({
    headers: ['image_id', 'source', 'image_tag_id', 'confidence'],
  }).fromFile(`${process.cwd()}/fixtures/validation-annotations-human-imagelabels-boxable.csv`)
  return data.map(({ image_id, image_tag_id }) => ({
    image_id,
    image_tag_id,
  }))
}

// converts csv to json, returns only necessary data (Assets)
export const loadImageAssetsData = async () => {
  const contents = await csvtojson({
    headers: [
      'image_id',
      'subset',
      'image_url',
      'image_landing_url',
      'license',
      'author_profile_url',
      'author',
      'title',
      'original_sizee',
      'original_md5',
      'thumbnail300_kurl',
      'rotation',
    ],
  }).fromFile(`${process.cwd()}/fixtures/validation-images-with-rotation.csv`)

  return contents.map(({ image_id, image_url, title }) => ({
    image_id,
    image_url,
    title,
    // mock
    creation_year: getRandomYear(),
  }))
}

//converts txt to json
export const loadVideosData = async () => {
  const videosTxt = fs.readFileSync(`${process.cwd()}/fixtures/video-names.txt`, 'utf-8')
  const videos = videosTxt
    .split('\n') //removes space
    .map(row => row.split('\t')[1]) //removes everything that's not between tab 0 and 2
    .map(videoName => ({
      videoName: videoName,
      videoUrl: `https://www.crcv.ucf.edu/THUMOS14/UCF101/UCF101/${videoName}`,
      categoryName: videoName.split('_')[1],
      // mock
      creation_year: getRandomYear(),
    }))
  return videos
}

export const loadTaggedVideosAssetsData = async () => {
  const contents = await csvtojson().fromFile(
    `${process.cwd()}/fixtures/class_attributes_ufc101_list_of_attributes.csv`
  )

  // DANGEROUS: js does not return keys in the same order
  // changes csv file to pascal case for categoryName (for M:N relationship)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, ...categoryNames] = Object.keys(contents[0])
  //ignores "Actions" as asset, maps first row
  const taggedVideos = categoryNames.map(categoryName => ({
    categoryName: Case.pascal(categoryName),
    //converts 0 1 strings to int, returns only true values
    tags: contents.filter(row => Boolean(parseInt(row[categoryName], 10))).map(row => row.Actions),
    //10 for decimal system, if boolean true, map
  }))
  return taggedVideos
}

// loadTaggedVideosAssetsData()
