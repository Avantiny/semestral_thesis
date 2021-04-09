import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Col, Container, Row, Spinner } from 'reactstrap'
import { SearchInput } from './Components/SearchInput'
import { TagsHierarchyTree } from './Components/TagsHierarchyTree'
import { YearSliders } from './Components/YearSliders'
import React from 'react'
import axios from 'axios'
import imageHierarchyTree from './data/imageHierarchyTree.json'
const PAGE_OFFSET_SIZE = 5

type TagsAssets = {
  id: string
  asset_id: number
  tag_id: number
  createdAt: string
  updatedAt: string
  tag: {
    id: string
    name: string
    createdAt: string
    updatedAt: string
  }
}
type Asset = {
  id: string
  src: string
  name: string
  creation_year: number
  type: string
  tags_assets: TagsAssets[]
}

type Props = {}
type State = {
  tags: any[]
  assets: Asset[]
  limit: number
  offset: number
  loading: boolean
  selectedTagId: string | null
  creationYearFrom: number
  creationYearTo: number
}

// TODO: move it to utils
const uniq = (arr: any) =>
  arr.filter((item: any, pos: any, self: any) => self.indexOf(item) === pos)

class AssetsList extends React.Component<Props, State> {
  state: State = {
    assets: [],
    limit: 30,
    offset: 0,
    loading: false,
    tags: [],
    selectedTagId: null,
    creationYearFrom: 1920,
    creationYearTo: 2020,
  }

  async componentDidMount() {
    // this.fetchNewAssets()
    this.getTags()
  }

  fetchNewAssets = async (searchText: string) => {
    this.setState({ loading: true, assets: [] })
    try {
      const res = await axios.get(
        // TODO: look at URL params
        `http://localhost:3001/assets/fulltext?limit=${this.state.limit}&offset=${this.state.offset}&search=${searchText}&creationYearFrom=${this.state.creationYearFrom}&creationYearTo=${this.state.creationYearTo}`
      )

      this.setState({
        assets: res.data,
      })
    } catch (err) {
      console.error(err)
    }
    this.setState({ loading: false })
  }

  fetchAssetsByTagId = async () => {
    if (!this.state.selectedTagId) return

    this.setState({ loading: true, assets: [] })
    try {
      const res = await axios.get(
        // TODO: look at URL params
        `http://localhost:3001/assets/tags/${encodeURIComponent(this.state.selectedTagId)}?limit=${
          this.state.limit
        }&offset=${this.state.offset}`
      )
      this.setState({
        assets: res.data,
      })
    } catch (err) {
      console.error(err)
    }
    this.setState({ loading: false })
  }

  fetchTagsDetails = async (assetId: string) => {
    this.setState({ loading: true })
    try {
      const res = await axios.get<any>(`http://localhost:3001/assets/${assetId}/tags`)
      alert(res.data.map((tag: any) => tag.name).join('\n'))
    } catch (err) {
      console.error(err)
    }
    this.setState({ loading: false })
  }

  getTags = async () => {
    try {
      const res = await axios.get<any>(`http://localhost:3001/tags`)
      this.setState({ tags: res.data }, () => {
        this.getTagsByType()
      })
    } catch (err) {
      console.error(err)
    }
  }

  onTagClick = (tagId: string) => {
    this.setState({ selectedTagId: tagId }, this.fetchAssetsByTagId)
  }

  onChangeCreationYearFrom = ({ x }: { x: number }) => {
    if (x <= this.state.creationYearTo) {
      this.setState({ creationYearFrom: x })
    }
  }

  onChangeCreationYearTo = ({ x }: { x: number }) => {
    if (x >= this.state.creationYearFrom) {
      this.setState({ creationYearTo: x })
    }
  }

  onSubmitSearchText = (searchText: string) => {
    this.fetchNewAssets(searchText)
  }

  onClickPrevPage = () => {
    this.setState(
      prevState => ({
        offset: prevState.offset - PAGE_OFFSET_SIZE,
      }),
      this.fetchAssetsByTagId
    )
  }
  onClickNextPage = () => {
    this.setState(
      prevState => ({
        offset: prevState.offset + PAGE_OFFSET_SIZE,
      }),
      this.fetchAssetsByTagId
    )
  }

  // add moize npm ???
  getTagsByType = () => {
    // rekurze
    const getLabelNames = (category: any) =>
      category
        ? // ? [category.LabelName, ...(category.Subcategory || []).map(getLabelNames).flat()]
          [category.LabelName, ...(category.Subcategory || []).map(getLabelNames).flat()]
        : []
    const treeTags = getLabelNames(imageHierarchyTree)

    const imageTags = uniq(treeTags)
    const videosTags = this.state.tags.filter(tag => !imageTags.includes(tag.id))
    return {
      imageTags,
      videosTags,
    }
  }

  render() {
    const { videosTags } = this.getTagsByType()
    return (
      <Container>
        <h1>Vítejte v aplikaci Sample_Archiv</h1>
        <Row>
          <Col>
            <YearSliders
              creationYearFrom={this.state.creationYearFrom}
              creationYearTo={this.state.creationYearTo}
              onChangeCreationYearFrom={this.onChangeCreationYearFrom}
              onChangeCreationYearTo={this.onChangeCreationYearTo}
            />
          </Col>
        </Row>
        <Row>
          <TagsHierarchyTree tags={this.state.tags} onTagClick={this.onTagClick} />

          {/* ============== */}
          {/* <VideosTags /> */}
          <Col
            style={{
              height: '300px',
              overflow: 'auto',
              maxWidth: '50%',
              backgroundColor: '#FAFAFA',
            }}
          >
            <h2>Videos</h2>
            {videosTags.map(tag => (
              <Button
                outline
                color='secondary'
                key={tag.id}
                onClick={() => this.setState({ selectedTagId: tag.id }, this.fetchAssetsByTagId)}
              >
                {tag.name}
              </Button>
            ))}
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Search by tag name</h2>
            <SearchInput
              onSubmitSearchText={this.onSubmitSearchText}
              loading={this.state.loading}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Assets list</h2>
            {/* ============== */}
            {/* <Pagination /> */}
          </Col>
        </Row>
        <Row>
          <Col>
            <Button color='primary' onClick={this.onClickPrevPage}>
              prev page
            </Button>
            <Button color='primary' onClick={this.onClickNextPage}>
              next page
            </Button>
          </Col>
        </Row>
        <Row>
          {/* <ViewAssets assets={Asset[]} /> */}
          <Col>current view assets: {this.state.assets.length}</Col>
        </Row>
        <Row>
          {this.state.loading && (
            <Spinner size='lg' color='dark'>
              loading...
            </Spinner>
          )}
        </Row>
        <Row>
          {this.state.assets.map(asset => (
            <Col key={asset.id}>
              <h3>{asset.name}</h3>
              {asset.type === 'Image' ? (
                <img src={asset.src} height='200' width='300' />
              ) : asset.type === 'Video' ? (
                <a href={asset.src}>click to download</a>
              ) : null}
              <Button
                outline
                color='info'
                size='sm'
                onClick={() => this.fetchTagsDetails(asset.id)}
              >
                {'show details'}
              </Button>
              {asset.creation_year}
            </Col>
          ))}
        </Row>
      </Container>
    )
  }
}

// const getTagsByType = () => {
//   console.log(imageHierarchyTree)
// }

// TODO
// const Assets = React.memo(({ asseets }: any) => {
//   // .map <Asset />
// })
// const Asset = React.memo(({ asset }: any) => {
//   // swich case if asset img | video...
// })
export default AssetsList
