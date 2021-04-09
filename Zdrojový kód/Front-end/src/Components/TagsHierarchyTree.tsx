import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Col } from 'reactstrap'
import React from 'react'
import imageHierarchyTree from '../data/imageHierarchyTree.json'
// @ts-ignore

type Props = {
  tags: { name: string; id: string }[]
  onTagClick: (tagId: string) => void
}

const styles = {
  wrapper: {
    height: '300px',
    overflow: 'auto',
    maxWidth: '50%',
    backgroundColor: '#FAFAFA',
  },
}
// eslint-disable-next-line react/display-name
export class TagsHierarchyTree extends React.PureComponent<Props> {
  // TODO: optimise
  getTagNameById = (tagId: string) => {
    const tags = this.props.tags
    return (tags.find(({ id }) => id === tagId) || {}).name
  }

  render() {
    return (
      /* TODO: ADD STYLED COMPONENTS */
      <Col style={styles.wrapper}>
        <h2>Images</h2>
        <TagList
          tag={imageHierarchyTree}
          onCategoryClick={this.props.onTagClick}
          getTagNameById={this.getTagNameById}
        />
      </Col>
    )
  }
}

const TagButton = ({ tagId, onClick, name }: any) => (
  <Button outline color='secondary' onClick={() => onClick(tagId)}>
    {name}
  </Button>
)

// recursion
const TagList = ({ tag, onCategoryClick, getTagNameById }: any) => (
  <Col>
    <TagButton
      tagId={tag.LabelName}
      name={getTagNameById(tag.LabelName)}
      onClick={onCategoryClick}
    />
    <ul>
      {// @ts-nocheck
      (tag.Subcategory || []).map((tag: any, index: any) => (
        <li key={index}>
          <TagList tag={tag} onCategoryClick={onCategoryClick} getTagNameById={getTagNameById} />
        </li>
      ))}
    </ul>
  </Col>
)
