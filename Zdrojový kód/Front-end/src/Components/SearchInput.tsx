import { Button } from 'reactstrap'
import React from 'react'

type Props = {
  onSubmitSearchText: (searchText: string) => void
  loading: boolean
}
type State = {
  searchValue: string
}
export class SearchInput extends React.PureComponent<Props, State> {
  state = {
    searchValue: '',
  }

  handleSubmit = () => {
    this.props.onSubmitSearchText(this.state.searchValue)
  }

  onChangeText = (e: any) => {
    this.setState({ searchValue: e.target.value })
  }

  render() {
    return (
      <div>
        tag name:
        <input type='text' value={this.state.searchValue} onChange={this.onChangeText} />
        <Button color='danger' size='lg' disabled={this.props.loading} onClick={this.handleSubmit}>
          Submit
        </Button>
      </div>
    )
  }
}
