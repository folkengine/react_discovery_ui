import { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'
import './dataset-query.scss'
import LoadingElement from '../generic-elements/loading-element'
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { RecommendationUtils } from '../../utils'


const DatasetQuery = props => {
  const {
    queryText,
    recommendations,
    isQueryLoading,
    queryFailureMessage,
    userHasInteracted,

    executeQuery,
    cancelQuery,
    setQueryText,
    setUserInteracted
  } = props

  const [localQueryText, setLocalQueryText] = useState(queryText)
  const [showTooltipCopied, setShowTooltipCopied] = useState(false)

  React.useEffect(() => {
    setLocalQueryText(queryText);
  }, [queryText])

  const submit = () => {
    // I'd like to use the Redux queryText here, but this way makes a test pass -JBP 10/9/2019
    executeQuery(localQueryText)
    setUserInteracted()
  }

  const cancel = () => {
    setUserInteracted()
    cancelQuery()
  }

  const updateLocalQueryText = e => setLocalQueryText(e.target.value)
  const updateReduxQueryText = (e) => setQueryText(e.target.value)

  const textArea = <textarea rows={5} type='text' value={localQueryText} onBlur={updateReduxQueryText} onChange={updateLocalQueryText} className='sql-textbox' />
  const submitButton = <button className="action-button" disabled={isQueryLoading} onClick={submit}>Submit</button>
  const cancelButton = <button className="action-button" disabled={!isQueryLoading} onClick={cancel}>Cancel</button>

  const showSuccessMessage = !queryFailureMessage && userHasInteracted && !isQueryLoading
  const successMessage = showSuccessMessage && (
    <span className='success-message'>
      Query successful.  To refresh the visualization, you must change an element in the trace
    </span>
  )
  const createHoverText = (systemName) => showTooltipCopied ? 'Copied!' : `Copy table name '${systemName}'`

  const recommendationItems = () => {
    return recommendations.map(rec => {
      const tooltipId = `tool-tip-${rec.id}`
      return (
        <div key={rec.id}>
          <a className="recommended-dataset" href={RecommendationUtils.getDatasetUrl(rec)} target='_blank'>
            {rec.dataTitle}
          </a>
          <ReactTooltip id={tooltipId} place="right" effect="solid" afterHide={() => setShowTooltipCopied(false)} getContent={() => createHoverText(rec.systemName)} />
          <CopyToClipboard text={rec.systemName} onCopy={() => setShowTooltipCopied(true)}>
            <AssignmentOutlinedIcon data-for={tooltipId} className="copy-table-name-icon" data-tip />
          </CopyToClipboard>
        </div>)
    })
  }

  const recommendationList = () => {
    return (
      <div className="recommendation-list">
        {recommendationItems()}
      </div>
    )
  }

  const showFailureMessage = queryFailureMessage && !isQueryLoading
  const failureMessage = (
    showFailureMessage && <span className='error-message'>
      {queryFailureMessage}
    </span>
  )

  return (
    <dataset-query>
      <div className="user-input">
        <div>
          <div className="sql-title">Enter your SQL query below. For best performance, you should limit your results to no more than 20,000 rows.</div>
          {textArea}
        </div>
        <div className="recommendation-section">
          <div className="recommendation-title">Recommendations</div>
          {recommendations && recommendationList()}
        </div>
      </div>
      <div>
        {submitButton}
        {cancelButton}
        {failureMessage}
        {successMessage}
        {isQueryLoading && <LoadingElement />}
      </div>
    </dataset-query>
  )
}

DatasetQuery.propTypes = {
  queryText: PropTypes.string,
  recommendations: PropTypes.array,
  queryFailureMessage: PropTypes.string,
  userHasInteracted: PropTypes.bool,
  isQueryLoading: PropTypes.bool.isRequired,

  executeQuery: PropTypes.func.isRequired,
  cancelQuery: PropTypes.func.isRequired,
  setQueryText: PropTypes.func.isRequired,
  setUserInteracted: PropTypes.func.isRequired
}

export default DatasetQuery
