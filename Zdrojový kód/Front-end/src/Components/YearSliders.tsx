import React from 'react'
// @ts-ignore
import { Col, Row } from 'reactstrap'
import Slider from 'react-input-slider'

type Props = {
  creationYearFrom: number
  creationYearTo: number
  onChangeCreationYearFrom: ({ x }: { x: number }) => void
  onChangeCreationYearTo: ({ x }: { x: number }) => void
}

// eslint-disable-next-line react/display-name
export const YearSliders = React.memo(
  ({
    creationYearFrom,
    creationYearTo,
    onChangeCreationYearFrom,
    onChangeCreationYearTo,
  }: Props) => (
    <Row>
      <Col>
        <label style={{ marginRight: '20px' }}>
          creation year from
          <Slider
            axis='x'
            x={creationYearFrom}
            y={30}
            xstep={1}
            xmin={1900}
            xmax={2020}
            onChange={onChangeCreationYearFrom}
          />
        </label>
        {creationYearFrom}
      </Col>
      <Col>
        <label style={{ marginRight: '20px' }}>
          creation year to
          <Slider
            axis='x'
            x={creationYearTo}
            y={30}
            xstep={1}
            xmin={1900}
            xmax={2020}
            onChange={onChangeCreationYearTo}
          />
        </label>
        {creationYearTo}
      </Col>
    </Row>
  )
)
